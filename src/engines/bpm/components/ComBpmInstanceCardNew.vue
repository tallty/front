<script lang="ts">
import ComBpmInstanceCreator from '@/engines/bpm/components/ComBpmInstanceCreator.vue';
import { PropType, defineComponent, nextTick, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import ComBpmInstanceDetailEasyDialogFromIndex from './ComBpmInstanceDetailEasyDialogFromIndex.vue';
import { useI18n } from 'vue-i18n';
import ComBpmLevelTag from './ComBpmLevelTag.vue';

const ComBpmInstanceCard = defineComponent({
  name: 'ComBpmInstanceCard',
  components: {
    ComBpmInstanceDetailEasyDialogFromIndex,
    ComBpmInstanceCreator,
    ComBpmLevelTag,
  },
  props: {
    record: { type: Object as PropType<InstanceModel>, required: true },
    showActions: { type: Boolean, default: true },
    onShow: { type: Function, default: undefined },
  },
  emits: ['dialogClose'],
  setup(props, { emit }) {
    const { t } = useI18n();

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
.com-bpm-instance-card.w-full.flex.items-center.p-4.rounded-lg.cursor-pointer(@click.stop='onClick', class='hover:bg-gray-50')
  .left-sec.mr-2.flex-none(v-if='record.unread')
    .block.bg-red-500.w-2.h-2.rounded
  .right-sec.flex-grow
    .flex.items-center.justify-between.mb-1
      .flex.items-center.gap-x-4
        ComBpmLevelTag.level(v-if='record.level', :value='record.level', :options='record.level_options')
        .text-gray-900.text-base.font-medium {{ record.workflow_name }}
        .text-sm.text-gray-500 {{ record.createdStr }}
      a-tag.state(:style='record.stateInfo.style')
        | {{ record.stateInfo.label }}
    .flex.items-center.gap-x-6.mb-3.flex-wrap(v-if='record.summaryAry.length !== 0')
      .text-sm.text-gray-900(v-for='item in record.summaryAry') {{ item }}
    .flex.items-center.gap-x-6.text-sm.text-gray-500
      .creator {{t('bpm.ComBpmInstanceCard.establish')}}：{{ record.creator_name }}
      .seq {{t('bpm.ComBpmInstanceCard.seq')}}：{{ record.seq }}
      .create-time {{t('bpm.ComBpmInstanceCard.establishTime')}}：{{ record.createdStr }}
      .current-state {{t('bpm.ComBpmInstanceCard.lasttoken')}}：{{ record.last_token.name }}
      .operator {{t('bpm.ComBpmInstanceCard.operator')}}：{{ record.last_token?.operator_name }}

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
.state
  border: none
</style>
