<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { TokenModel } from '../bpm-core/apis/user/token.api';
import { Token, TokenPlace, TokenTypes } from '../bpm-core/types';
import ComBpmPlaceTokenTimelineDeliverNode from './tokens/ComBpmPlaceTokenTimelineDeliverNode.vue';

const ComBpmPlaceTokenTimelineNode = defineComponent({
  name: 'ComBpmPlaceTokenTimelineNode',
  components: {
    ComBpmPlaceTokenTimelineDeliverNode,
  },
  props: {
    instance: { type: Object, required: true },
    placeToken: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const tokenPlaceStateInfo = (tokenPlace: TokenPlace) => {
      return TokenModel.stateMap()[tokenPlace.token_state] || {};
    };

    const visibleForm = ref(false);
    const activeToken = ref<Partial<Token>>({});

    const onShowForm = (token: Token) => {
      activeToken.value = token;
      visibleForm.value = true;
    };

    const visibleTokenSource = ref(false);
    const visibleTokenSourceComponent = ref(false);
    const customComponent = ref('');

    const onShowTokenSource = (token: Token) => {
      activeToken.value = token;
      if (props.placeToken?.place?.token_source_options?.options?.complete_component) {
        customComponent.value =
          props.placeToken.place.token_source_options.options.complete_component;
        visibleTokenSourceComponent.value = true;
      } else {
        visibleTokenSource.value = true;
      }
    };

    const onRefresh = () => emit('refresh');

    return {
      ...toRefs(props),
      tokenPlaceStateInfo,
      TokenTypes,
      TokenModel,
      visibleForm,
      activeToken,
      onShowForm,
      onShowTokenSource,
      visibleTokenSource,
      visibleTokenSourceComponent,
      customComponent,
      onRefresh,
    };
  },
});
export default ComBpmPlaceTokenTimelineNode;
</script>

<template lang="pug">
a-timeline-item.com-bpm-token-place-timeline-node.mt-2
  template(#dot)
    TaIcon(
      :size='22',
      :type='tokenPlaceStateInfo(placeToken).icon',
      :color='tokenPlaceStateInfo(placeToken).color'
    )
  .place-info
    .place-name {{ placeToken.place.name }}

  .empty-tokens-placeholder(v-if='placeToken.tokens.length === 0')
    .token.p-4.mb-2.bg-gray-50.rounded.relative.overflow-hidden.text-sm.font-normal.text-gray-500
      | 当前状态：{{ tokenPlaceStateInfo(placeToken).label || '处理中' }}

  template(v-for='token in placeToken.tokens')
    .token.p-2.mb-2.bg-gray-50.rounded.relative.overflow-hidden(
      v-if='token.state !== "inactivated"'
    )
      template(v-if='[TokenTypes.Deliver].includes(token.type)')
        ComBpmPlaceTokenTimelineDeliverNode(:token='token')
      template(v-else)
        .z-2.top-1.-left-7.absolute.mark.bg-blue-500.transform.-rotate-45.text-white.w-20.flex-center.tracking-wide.text-xs(
          v-if='[TokenTypes.Handle, TokenTypes.Confirm].includes(token.type)'
        )
          | 处理
        .avatar.pr-2
          TaAvatar(
            :nameOfUser='token.operator_name?.slice(0, 1)',
            :size='20'
          )
        .content
          .line
            .operator.text-sm.font-regular.text-gray-700
              .operator_name {{ token.title.value }}
            .state
              a-tag(v-if='!token.hideStateTag.value', :color='token.stateInfo.value.color')
                | {{ token.stateInfo.value.label }}
          .time.text-xs.font-regular.text-gray-400 {{ token.updatedStr.value }}
          .comment {{ token.comment }}
          .form.py-2(v-if='!TokenModel.isTokenPayloadEmpty(token)')
            .text-primary.font-semibold.text-sm.cursor-pointer(@click.stop='onShowForm(token)')
              | 查看表单详情
          //- .form.py-2(v-if='token.token_source')
          //-   .text-primary.font-semibold.text-sm.cursor-pointer(
          //-     @click.stop='onShowTokenSource(token)'
          //-   )
          //-     | 查看表单详情
          .edit.flex-end
            slot(name='edit', :token='token', :place='placeToken.place')

  TaNoPaddingModal(
    v-if='visibleForm',
    v-model:visible='visibleForm',
    :title='placeToken.place.name',
    :modalContentStyle='{ "border-radius": "12px", overflow: "hidden" }',
    :footer='null'
  )
    .py-4.px-6
      TaDataFormViewer(
        v-for='dataForm in activeToken.data_forms'
        :dataForm='dataForm',
        :context='instance?.flowable_info'
      )
    //- TaTemplateFormViewer.py-4.px-6(
    //-   :modelValue='activeToken.token_payload',
    //-   :template='placeToken.place.place_form'
    //- )

  TaNoPaddingModal(
    v-if='visibleTokenSource',
    v-model:visible='visibleTokenSource',
    :title='placeToken.place.name',
    :modalContentStyle='{ "border-radius": "12px", overflow: "hidden" }',
    :footer='null'
  )
    TaTemplateFormViewer.py-4.px-6(
      :modelValue='activeToken.token_source',
      :template='`${placeToken.place.token_source_options?.klass_singular}#${placeToken.place.token_source_options?.model_setting_flag}`'
    )

  component(
    v-if='visibleTokenSourceComponent',
    v-model:visible='visibleTokenSourceComponent',
    :is='customComponent',
    :title='placeToken.place.name',
    :formRecord='activeToken',
    :token='activeToken',
    :disabled='true',
    @refresh='onRefresh'
  )
</template>

<style lang="stylus" scoped>
.com-bpm-token-place-timeline-node
  padding 5px 8px
  .text-primary
    color $primary-color
  .place-info
    margin-bottom 12px
    display flex
    justify-content space-between
    .place-name
      font-size 14px
      font-weight 400
      color #262626
      line-height 14px
    .created
      font-size 12px
      font-weight 400
      color #8C8C8C
      line-height 17px
  .token
    display flex
    &:last-child
      margin-bottom 0
    .content
      width 100%
      margin-left 5px
      .line
        display flex
        justify-content space-between
        .operator
          display flex
          align-items center
      .time
        margin-top 4px
        font-size 10px
        font-weight 400
        color #8C8C8C
        line-height 12px
      .comment
        margin-top 6px
        font-size 14px
        font-weight 400
        color #8C8C8C
        line-height 14px
</style>
