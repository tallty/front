<script lang="ts">
import defaultTheme from '@/components/global/ta-component/TaTemplateForm/defaultTheme';
import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';
import { VObject } from '@/lib/vails/model';
import dayjs from 'dayjs';
import scrollIntoView from 'scroll-into-view-if-needed';
import {
  PropType,
  computed,
  defineAsyncComponent,
  defineComponent,
  nextTick,
  provide,
  ref,
  resolveDynamicComponent,
  toRefs,
} from 'vue';
import { DataForm } from '../../../components/global/ta-component/ta-template-form-core/data_form/data_form';
import { BpmTokenPlace, BpmTokenPlaceToken } from '../bpm-core/BpmTokenPlace';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { TokenModel } from '../bpm-core/apis/user/token.api';
import { Instance, Token, TokenAction, TokenPlace } from '../bpm-core/types';
import ComBpmInstanceCollapse from './ComBpmInstanceCollapse.vue';
import ComBpmTokenSourceTable from './ComBpmTokenSourceTable.vue';

const requireContext = require.context(
  '@/components/flowable/', // path to components folder which are resolved automatically
  true,
  /\.vue$/i,
  'sync',
);

let componentNames = requireContext.keys().map(file => file.replace(/(^.\/)|(\.vue$)/g, ''));
let components = {} as VObject;

componentNames.forEach(component => {
  //component represents the component name
  components[component] = defineAsyncComponent(
    () =>
      //import each component dynamically
      import('@/components/flowable/' + component + '.vue'),
  );
});

const ComBpmInstanceDetailContent = defineComponent({
  name: 'ComBpmInstanceDetailContent',
  components: { ...components, ComBpmInstanceCollapse, ComBpmTokenSourceTable },
  props: {
    record: { type: Object as PropType<InstanceModel & Instance>, required: true },
    expendedAll: { type: Boolean, default: false },
    showSteps: { type: Boolean, default: true },
    closeClone: { type: Boolean, default: false },
  },
  setup(props) {
    // const fakeRecord = (token: Token) => ({
    //   formData: reactive(token.token_payload),
    // });

    const instancePayloadRecord = computed(() => {
      return { formData: props.record.payload || {} };
    });

    const flowableComponent = computed(() => {
      const name = `${props.record.flowable_type?.replace('::', '')}Flowable`;
      const isComponent = typeof resolveDynamicComponent(name) !== 'string';
      return isComponent ? name : ''; // flowableComponent 可从 global 中取值
    });

    const getViewerStyle = (form: TaTemplateFormItem) => {
      return {
        '--background-color':
          (typeof form?.options?.theme !== 'string' && form?.options?.theme?.background?.color) ||
          defaultTheme.value?.background?.color,
      };
    };

    // key is place id
    const collapsedMap = ref<Record<number, boolean>>(
      props.expendedAll
        ? new Proxy(
            {},
            {
              get(obj, key) {
                typeof Reflect.get(obj, key) === 'boolean' ? Reflect.get(obj, key) : true;
              },
            },
          )
        : {},
    );

    const collapseRefs = ref<Record<number, any>>({});

    const onClickStep = (placeId: number) => {
      collapsedMap.value[placeId] = false;
      nextTick(() => {
        const node = collapseRefs.value[placeId]?.$el;
        if (node) {
          scrollIntoView(node, {
            scrollMode: node,
            block: 'center',
            behavior: 'smooth',
          });
        }
      });
    };

    provide(
      'fileEditable',
      !!props.record.enable_actions?.find((action: TokenAction) => action.key === 'edit'),
    );

    const firstPlaceExists = computed(() => {
      return (props.record.dataForms as any).some((dataForm: DataForm) => {
        return dataForm.formExists;
      });
    });

    const itemExists = (item: TokenPlace) => {
      return new BpmTokenPlace(item).dataFormExists;
    };

    const tokenPlaceUniqPlaceLastDataAllEmpty = computed(() => {
      return (props.record.tokenPlaceUniqPlaceLastData as any).reduce(
        (out: boolean, item: TokenPlace) => {
          return out && !itemExists(item);
        },
        true,
      );
    });

    const tokenPlaceUniqPlaceLastDataLastIndex = computed(() => {
      return (props.record.tokenPlaceUniqPlaceLastData as any).length > 0
        ? (props.record.tokenPlaceUniqPlaceLastData as any).length -
            1 -
            [...(props.record.tokenPlaceUniqPlaceLastData as any)]
              .reverse()
              .findIndex((item: TokenPlace) => {
                return itemExists(item);
              })
        : -1;
    });

    const tokenKey2Collapsed = ref<Record<string, boolean>>({});

    const getTokenKey = (token: Token) => `${token.place_id}_${token.id}`;
    const tokenPlaceAllCollapsed = (tokenPlace: TokenPlace) => {
      return tokenPlace.tokens
        .filter((token: any) => !TokenModel.isTokenPayloadEmpty(token))
        .reduce((out: boolean, token: Token) => {
          return out && tokenKey2Collapsed.value[getTokenKey(token)];
        }, true);
    };

    const onChangeAllCollapsed = (tokenPlace: TokenPlace, collapsed: boolean) => {
      tokenPlace.tokens
        .filter((token: any) => !TokenModel.isTokenPayloadEmpty(token))
        .forEach((token: Token) => {
          tokenKey2Collapsed.value[getTokenKey(token)] = collapsed;
        });
    };

    const stepsInfo = computed(() => {
      return props.record.summary_place_info || props.record.stepsInfo;
    });

    return {
      ...toRefs(props),
      // fakeRecord,
      instancePayloadRecord,
      flowableComponent,
      getViewerStyle,
      TokenModel,
      dayjs,
      collapsedMap,
      collapseRefs,
      onClickStep,
      firstPlaceExists,
      itemExists,
      tokenKey2Collapsed,
      getTokenKey,
      tokenPlaceAllCollapsed,
      onChangeAllCollapsed,
      tokenPlaceUniqPlaceLastDataAllEmpty,
      tokenPlaceUniqPlaceLastDataLastIndex,
      stepsInfo,
      BpmTokenPlaceToken,
      BpmTokenPlace,
    };
  },
});
export default ComBpmInstanceDetailContent;
</script>

<template lang="pug">
.com-bpm-instance-detail-content(
  v-if='flowableComponent || (stepsInfo && showSteps) || firstPlaceExists || record.tokenPlaceUniqPlaceLastData.map(item => itemExists(item)).reduce((a, b) => a || b, false)'
)
  .pb-4.pt-4.mb-6.border-b.border-gary-200.overflow-x-auto(v-if='stepsInfo && showSteps')
    a-steps.steps(:current='stepsInfo.current_index')
      template(#progressDot='{ index, status }')
        .absolute.-top-3.-left-4.h-8.w-8.rounded-full.border.flex-shrink-0.bg-white.flex.items-center.justify-center(
          :class='{ [status]: true }'
        )
          TaIcon(v-if='status === "finish"', type='CheckOutlined')
          div(v-else) {{ index + 1 }}
      a-step(
        v-for='placeInfo in stepsInfo.places',
        :title='placeInfo.name',
        :description='placeInfo.completed_at ? dayjs(placeInfo.completed_at).format("YYYY-MM-DD HH:mm") : ""',
        @click='onClickStep(placeInfo.id)'
      )

  .flowable(v-if='flowableComponent')
    component.mb-4(:is='flowableComponent', :record='record')

  ComBpmInstanceCollapse.mb-4(
    :ref='el => (collapseRefs[record.startToken.place_id] = el)',
    v-if='firstPlaceExists',
    v-model:collapsed='collapsedMap[record.startToken.place_id]',
    :index='1',
    :header='record.startToken.name',
    :defaultCollapsed='!(firstPlaceExists && tokenPlaceUniqPlaceLastDataAllEmpty)',
    :closeClone='closeClone'
  )
    template(v-for='dataForm in record.dataForms')
      TaDataFormViewer(
        :dataForm='dataForm',
        :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }'
      )

  template(
    v-if='!tokenPlaceUniqPlaceLastDataAllEmpty',
    v-for='(item, index) in record.tokenPlaceUniqPlaceLastData'
  )
    ComBpmInstanceCollapse.mb-4(
      v-if='itemExists(item) || new BpmTokenPlace(item).dataFormsHasStatisticsComponentAry.length > 0',
      :ref='el => (collapseRefs[item.id] = el)',
      v-model:collapsed='collapsedMap[item.id]',
      :header='item.name',
      :index='index + 2',
      :defaultCollapsed='!(!tokenPlaceUniqPlaceLastDataAllEmpty && index === tokenPlaceUniqPlaceLastDataLastIndex)'
    )
      .change-all-collapsed.absolute.-top-7.right-6.flex.items-center
        .text-sm.font-normal.text-primary-500(
          v-if='item.tokens.filter(token => !TokenModel.isTokenPayloadEmpty(token)).length > 1'
        )
          template(v-if='tokenPlaceAllCollapsed(item)')
            .cursor-pointer(@click.stop='onChangeAllCollapsed(item, false)') 一键展开
          template(v-else)
            .cursor-pointer(@click.stop='onChangeAllCollapsed(item, true)') 一键收起
      .content(v-for='dataForm in new BpmTokenPlace(item).dataFormsHasStatisticsComponentAry')
        component(:is='dataForm.customStatisticsComponent', :tokenPlace='item')
      .content.space-y-4(v-if='new BpmTokenPlace(item).dataFormExists')
        template(v-for='(token, index) in item.tokens')
          .viewer(
            v-if='!TokenModel.isTokenPayloadEmpty(token)',
            :style='getViewerStyle(item.place.place_form)'
          )
            template(v-if='item.tokens.length > 1')
              .bg-gray-100.rounded-lg.overflow-hidden
                .collapse-header.flex.items-center.h-9.px-4.cursor-pointer(
                  @click='() => (tokenKey2Collapsed[getTokenKey(token)] = !tokenKey2Collapsed[getTokenKey(token)])'
                )
                  TaIcon.transition-all.text-gray-900.transform.mr-2(
                    type='solid/chevron-down',
                    :class='{ "-rotate-90": tokenKey2Collapsed[getTokenKey(token)] }'
                  )
                  .rounded-lg.text-primary-800.bg-primary-100.flex.justify-center.items-center.px-2.h-6.text-sm.font-medium
                    TaIcon.w-4.h-4(type='solid/user')
                    .ml-2 {{ token.operator_name }}
                .py-2.px-4.overflow-hidden(
                  :class='{ "h-0": tokenKey2Collapsed[getTokenKey(token)], "!p-0": tokenKey2Collapsed[getTokenKey(token)] }'
                )
                  TaDataFormViewer(
                    v-for='dataForm in new BpmTokenPlaceToken(token).dataForms',
                    :dataForm='dataForm',
                    :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }'
                  )
            template(v-else)
              TaDataFormViewer(
                v-for='dataForm in new BpmTokenPlaceToken(token).dataForms',
                :dataForm='dataForm',
                :context='{ flowable_info: record.flowable_info, record: record.flowable_info, instance: record }'
              )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-detail-content
  width 100%
  height 100%
  padding 20px 30px
  .flowable
    // padding-bottom 20px
  .viewer
    background-color var(--background-color)
  .steps
    .finish
      border-color $primary-color
    .process
      background $primary-color
  .bg-primary-100
    background #E1EFFE
  .text-primary-800
    color #1E429F
  .text-primary-500
    color #3F83F8
  >>> .ant-steps-item-title
    @apply mt-2
  >>> .ant-steps-item-description
    @apply mt-2
</style>
