<script lang="ts">
import { VObject, VStore } from '@/lib/vails';
import dayjs from 'dayjs';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { BpmUserWorkflows } from '../bpm-core/apis/user/workflowl.api';
import { Place, PlaceTypes, Token, TokenPlace } from '../bpm-core/types';
import ComBpmCommentTimelineNode from './ComBpmCommentTimelineNode.vue';
import ComBpmPlaceTokenTimelineNode from './ComBpmPlaceTokenTimelineNode.vue';
import ComBpmFlowTreeViewer from './designer/flowTree/ComBpmFlowTreeViewer.vue';
import { useInstanceActionAuthInject } from './useInstanceActionAuth';

const ComBpmInstanceTimeline = defineComponent({
  name: 'ComBpmInstanceTimeline',
  components: { ComBpmFlowTreeViewer, ComBpmPlaceTokenTimelineNode, ComBpmCommentTimelineNode },
  props: {
    record: { type: Object, required: true },
    commentStore: { type: Object, required: true },
  },
  emits: [],
  setup(props, { emit }) {
    const visibleFlowTree = ref(false);

    const workflowStore = new VStore(new BpmUserWorkflows());
    const onShowFlowTree = async () => {
      await workflowStore.find(props.record.workflow_id);
      visibleFlowTree.value = true;
    };

    const { tokenCanDo } = useInstanceActionAuthInject();

    const tokenCanEdit = (token: Token, place: Place) => {
      return (
        tokenCanDo(token, 'edit') &&
        place.place_form &&
        place.place_form.key &&
        (place.place_form.fields || []).length > 0
      );
    };

    const activeToken = ref<any>({ formData: {} });
    const activePlace = ref<any>({});
    const visibleTokenForm = ref(false);
    const onEditTokenPayload = (token: any, place: Place) => {
      activeToken.value = token;
      if (!activeToken.value.formData.token_payload) {
        activeToken.value.formData.token_payload = {};
      }
      activePlace.value = place;
      visibleTokenForm.value = true;
    };

    const records = computed(() =>
      ([] as VObject[])
        .concat(
          (props.record.placeTokensFormatted || [])
            .filter((tokenPlace: TokenPlace) => {
              return ![PlaceTypes.Trigger].includes(tokenPlace.place.type as any);
            })
            .map((i: VObject) =>
              Object.assign(i, {
                component: 'ComBpmPlaceTokenTimelineNode',
                created_at:
                  i.token_created_at ||
                  i.tokens.sort((a: VObject, b: VObject) =>
                    dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? -1 : 1,
                  )[0]?.created_at,
              }),
            ),
        )
        .concat(
          props.commentStore.records.value.map((i: VObject) =>
            Object.assign(i, { component: 'ComBpmCommentTimelineNode' }),
          ),
        )
        .sort((a: VObject, b: VObject) => {
          return dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? -1 : 1;
        }),
    );

    const getTimeCost = (item: VObject, nextRecord: VObject) => {
      return dayjs
        .duration(dayjs(nextRecord.created_at).diff(dayjs(item.created_at), 'seconds'), 'seconds')
        .humanize();
    };

    const onRefresh = () => {
      props.record.fetch();
      props.commentStore.index({ per_page: 999999 });
    };

    return {
      ...toRefs(props),
      visibleFlowTree,
      onShowFlowTree,
      workflow: workflowStore.record,
      tokenCanEdit,
      activeToken,
      activePlace,
      visibleTokenForm,
      onEditTokenPayload,
      records,
      getTimeCost,
      onRefresh,
    };
  },
});

export default ComBpmInstanceTimeline;
</script>

<template lang="pug">
.com-bpm-instance-timeline
  //- TaTextButton.eye(icon='EyeOutlined', color='#3da8f5', @click='onShowFlowTree') 查看流程图
  a-timeline
    template(v-for='(item, index) in records')
      component(
        :is='item.component',
        :placeToken='item',
        :record='item',
        :instance='record',
        :comment='item',
        @refresh='onRefresh'
      )
        template(#edit='{ token, place }')
          TaTextButton(
            v-if='tokenCanEdit(token, place)',
            @click='onEditTokenPayload(token, place)'
          )
            | 超级编辑
      //- a-timeline-item.text-sm.font-regular.text-gray-700(v-if='records[index + 1]') 耗时 {{ getTimeCost(item, records[index + 1]) }}

  ComBpmFlowTreeViewer(
    v-if='visibleFlowTree',
    v-model:visible='visibleFlowTree',
    :workflow='workflow'
  )
  TaTemplateFormDialog(
    v-model:modelValue='activeToken.formData.token_payload',
    v-model:visible='visibleTokenForm',
    :record='activeToken',
    :template='activePlace.place_form',
    @success='() => (visibleTokenForm = false)'
  )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-timeline
  width 100%
  height 100%
  overflow auto
  padding 20px 30px
  .eye
    margin 0 0 12px 0
</style>

<style lang="stylus">
.ant-timeline-item-head
  z-index none
</style>
