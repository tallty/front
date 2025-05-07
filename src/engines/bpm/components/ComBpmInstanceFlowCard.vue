<script lang="ts">
import ComBpmInstanceCreator from '@/engines/bpm/components/ComBpmInstanceCreator.vue';
import { PropType, defineComponent, nextTick, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import ComBpmInstanceDetailEasyDialogFromIndex from './ComBpmInstanceDetailEasyDialogFromIndex.vue';

const ComBpmInstanceFlowCard = defineComponent({
  name: 'ComBpmInstanceFlowCard',
  components: {
    ComBpmInstanceDetailEasyDialogFromIndex,
    ComBpmInstanceCreator,
  },
  props: {
    record: { type: Object as PropType<InstanceModel>, required: true },
    showActions: { type: Boolean, default: true },
    onShow: { type: Function, default: undefined },
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

    return {
      ...toRefs(props),
      onDialogClose,
      onClick,
      visibleDialog,
      creator,
      onRebuild,
    };
  },
});

export default ComBpmInstanceFlowCard;
</script>

<template lang="pug">
.com-bpm-instance-card.p-3.rounded-lg.cursor-pointer.bg-white(@click.stop='onClick')
  .flex.items-center.gap-x-2.mb-2
    .block
      .bg-red-500.w-2.h-2.rounded(v-if='record.unread')
    .text-gray-900.text-base.font-medium {{ record.workflow_name }}
  .flex.items-center.gap-x-1.mb-2
    TaIcon.text-gray-500.w-4.h-4(type='outline/document-text')
    .text-gray-500.text-xs.truncate {{ record.seq }}
  .flex.items-center.gap-x-1.mb-2
    TaIcon.text-gray-500.w-4.h-4(type='outline/clock')
    .text-gray-500.text-xs.truncate {{ record.createdStr }}
  .flex.items-center.justify-between
    .text-sm.truncate {{ record.last_token.name  }}/{{ record.last_token?.operator_name }}
    a-tag.state(:style='record.stateInfo.style')
      | {{ record.stateInfo.label }}

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
