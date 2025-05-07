<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { PlaceTypes } from '../../../bpm-core/types';
import ComBpmFlowTreeNodeTrigger from './ComBpmFlowTreeNodeTrigger.vue';
import { TaAction } from '../../../../../components/global/ta-component/actions/types';
import { KIND_CONDITION } from './Transformer';

const ComBpmFlowTreeNodeButtonsShell = defineComponent({
  name: 'ComBpmFlowTreeNodeButtonsShell',
  components: {
    ComBpmFlowTreeNodeTrigger,
  },
  props: {
    node: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const localNode = computed({
      get: () => {
        return props.node;
      },
      set: val => {
        emit('update:node', val);
      },
    });

    const onCut = () => {
      emit('cut');
    };

    const onCopy = () => {
      emit('copy');
    };

    const onTopCondition = () => {
      emit('topCondition');
    };

    const onSummaryChange = () => {
      localNode.value.is_summary = !localNode.value.is_summary;
      // 不知为何无法触发
      emit('update:node', props.node);
    };

    const beforeActions = computed(() => {
      return (props.node.form_setting?.actions || []).filter((action: TaAction) =>
        action.condition?.lifecycle?.startsWith('before_fire_from_'),
      );
    });

    const afterActions = computed(() => {
      return (props.node.form_setting?.actions || []).filter((action: TaAction) =>
        action.condition?.lifecycle?.startsWith('after_fire_from_'),
      );
    });

    return {
      ...toRefs(props),
      localNode,
      onCut,
      onCopy,
      onTopCondition,
      onSummaryChange,
      PlaceTypes,
      beforeActions,
      afterActions,
      KIND_CONDITION,
    };
  },
});
export default ComBpmFlowTreeNodeButtonsShell;
</script>

<template lang="pug">
.com-bpm-flow-tree-node-buttons-shell.flex.flex-col
  .before-triggers.my-2
    ComBpmFlowTreeNodeTrigger(
      v-for='action in beforeActions',
      type='before',
      :action='action'
    )
  .shell.shadow.border-blue-400.transition-all.rounded.relative(
    :class='{ "border-x-4": localNode.is_summary, "px-1": localNode.is_summary }'
  )
    .buttons.absolute.h-full.w-full.top-0.right-0.transition-all.transform.rounded.flex.flex-col.text-sm.items-end.justify-around(
      v-if='!disabled'
    )
      template(v-if='![PlaceTypes.StartPlace, PlaceTypes.EndPlace].includes(node.type) && node.kind !== KIND_CONDITION')
        .button.mr-4.flex.items-center.cursor-pointer(@click='onCut')
          TaIcon.mr-2(type='ScissorOutlined')
          | 剪切

        .button.mr-4.flex.items-center.cursor-pointer(@click='onCopy')
          TaIcon.mr-2(type='CopyOutlined')
          | 复制

      template(v-if='node.kind === KIND_CONDITION')
        .button.mr-4.flex.items-center.cursor-pointer(@click='onTopCondition')
          TaIcon.mr-2(type='VerticalAlignTopOutlined')
          | 置顶
      template(v-else)
        .button.mr-4.flex.items-center.cursor-pointer(
          :class='{ "text-blue-400": localNode.is_summary }',
          @click='onSummaryChange'
        )
          TaIcon.mr-2(:type='localNode.is_summary ? "StarFilled" : "StarOutlined"')
          | {{ localNode.is_summary ? '取消' : '重点' }}
    slot

  .after-triggers.my-3
    ComBpmFlowTreeNodeTrigger(
      v-for='action in afterActions',
      type='after',
      :action='action'
    )
</template>

<style lang="stylus" scoped>
.com-bpm-flow-tree-node-buttons-shell:hover
  .buttons
    @apply -right-20
  .shell
    @apply shadow-xl
</style>
