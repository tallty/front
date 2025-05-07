<script lang="ts">
// import InstanceDetailDialog from './InstanceDetailDialog.vue';
import ComBpmInstanceCreator from '@/engines/bpm/components/ComBpmInstanceCreator.vue';
import { PropType, defineComponent, nextTick, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import ComBpmInstanceDetailEasyDialogFromIndex from './ComBpmInstanceDetailEasyDialogFromIndex.vue';
import { useI18n } from 'vue-i18n';

const ComBpmInstanceCard = defineComponent({
  name: 'ComBpmInstanceCard',
  components: {
    ComBpmInstanceDetailEasyDialogFromIndex,
    ComBpmInstanceCreator,
  },
  props: {
    record: { type: Object as PropType<InstanceModel>, required: true },
    showActions: { type: Boolean, default: true },
    onShow: { type: Function, default: undefined },
    hideSeq: { type: Boolean, default: false },
  },
  emits: ['dialogClose'],
  setup(props, { emit }) {
    const visibleDialog = ref(false);

    const onClick = () => {
      if (typeof props.onShow === 'function') {
        props.onShow(props.record);
      } else {
        visibleDialog.value = true;
      }
    };

    const onDialogClose = () => {
      emit('dialogClose');
    };

    const creator = ref<any>(null);

    const onRebuild = () => {
      nextTick(() => creator.value.onCreateInstance());
    };

    const { t } = useI18n();

    return {
      ...toRefs(props),
      onDialogClose,
      onClick,
      visibleDialog,
      creator,
      onRebuild,
      t,
    };
  },
});

export default ComBpmInstanceCard;
</script>

<template lang="pug">
.com-bpm-instance-card.flex(@click.stop='onClick')
  .content
    .header
      .workflow-name.black-text.relative
        img.icon.h-6.w-6(src='@/engines/bpm/assets/images/app.svg')
        .unread-point.bg-red-600.w-2.h-2.-top-1.left-5.absolute(v-if='record.unread', class='rounded-1/2')
        .workflow-text
          a-tooltip
            template(#title)
              .text {{ record.workflow_name }}
            .overflow-hidden.two-line-text {{ record.workflow_name }}
        .create-time {{ `· ${record.createdStr}` }}
      .right
        .seq.gray-text(v-if='!hideSeq')
          | {{t('bpm.ComBpmInstanceCard.seq')}}：{{ record.seq }}
        a-tag.state(:color='record.stateInfo.color')
          | {{ record.stateInfo.label }}
    .summary.black-text(v-if='record.summaryAry.length !== 0')
      a-tooltip(placement='topLeft')
        template(#title)
          .title(v-for='item in record.summaryAry') {{ item }}
        .max-h-20.overflow-y-scroll
          span.line(v-for='item in record.summaryAry') {{ item }}
    //- .summary.gray-text(v-if='record.flowableSummaryAry.length !== 0')
    //-   span.line(v-for='item in record.flowableSummaryAry') {{ item }}
    .infos.gray-text
      .line
        //- span 所属单位：{{ record.creator }}
        span {{t('bpm.ComBpmInstanceCard.creator')}}：{{ record.creator }}
        template(v-if='record.last_token')
          span {{t('bpm.ComBpmInstanceCard.lasttoken')}}：{{ record.last_token.name }}
          span {{t('bpm.ComBpmInstanceCard.operator')}}：{{ record.last_token.operator_name }}
  //- .actions.flex-center
    //- a-button(type='primary', @click.stop='onRebuild') 再次发起
  ComBpmInstanceDetailEasyDialogFromIndex(
    v-if='visibleDialog',
    v-model:visible='visibleDialog',
    :instance='record',
    @close='onDialogClose'
  )

  ComBpmInstanceCreator(
    ref='creator',
    :workflowId='record.workflow_id',
    :initFormData='record.payload'
  )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-card
  cursor pointer
  // margin-bottom 12px
  margin-top 10px
  padding 24px 15px
  border-bottom 1px solid rgba(0, 0, 0, 0.08)
  border-radius 4px
  background rgba(255, 255, 255, 1)
  &:hover
    .actions
      width 106px
  .content
    flex-grow 1
    .header
      display flex
      justify-content space-between
      align-items center
      margin-bottom 3px
      .workflow-name
        display flex
        align-items center
        height 20px
        font-size 16px
        font-weight 500
        line-height 24px
        .create-time
          flex-shrink 0
          margin-left 16px
          height 20px
          color rgba(89, 89, 89, 0.65)
          font-weight 400
          font-size 14px
          line-height 20px
          margin-right 10px
        .icon
          display inline-block
          margin-right 8px
          background $primary-color
          position relative
      .right
        display inline-flex
        align-items center
        .seq
          padding-right 20px
    .summary
      overflow hidden
      padding 7px 6px 0 6px
      border-bottom 1px solid #E8E8E8
      .line
        margin-bottom 8px
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        display -moz-box
        -moz-line-clamp 2
        -moz-box-orient vertical
        overflow-wrap break-word
        word-break break-all
        white-space normal
        overflow hidden
      span
        float left
        margin-right 30px
    .infos
      padding 7px 6px
      .line
        margin-bottom 8px
        &:last-child
          margin-bottom 0px
      span
        margin-right 30px
  .actions
    width 0px
    overflow hidden
    transition all 0.2s
.gray-text
  color rgba(128, 128, 128, 1)
  font-weight 400
  font-size 14px
  line-height 20px
.black-text
  color rgba(38, 38, 38, 0.85)
</style>
