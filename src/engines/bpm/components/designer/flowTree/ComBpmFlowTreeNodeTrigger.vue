<script lang="ts">
import { PropType, computed, defineComponent, toRefs } from 'vue';
import { TaTriggerTypeConfigMapping } from '../../../../../components/global/ta-component/actions/triggers/TaTriggerEditor.vue';

const ComBpmFlowTreeNodeTrigger = defineComponent({
  name: 'ComBpmFlowTreeNodeTrigger',
  components: {},
  props: {
    action: { type: Object, required: true },
    type: { type: String as PropType<'after' | 'before'>, default: 'before' },
  },
  setup(props) {
    const icon = computed(() => {
      return TaTriggerTypeConfigMapping[props.action.trigger?.type]?.icon;
    });

    const source = computed(() => {
      return isToken.value ? '单' : '多';
    });

    const name = computed(() => {
      return (
        props.action.trigger?.name || TaTriggerTypeConfigMapping[props.action.trigger?.type]?.label
      );
    });

    const isToken = computed(() => {
      return props.action.condition?.lifecycle.includes('token');
    });

    const boxClass = computed(() => ({
      'border-blue-500': isToken.value,
      'border-green-500': !isToken.value,
      'box-before': props.type === 'before',
      'box-after': props.type === 'after',
    }));

    return {
      ...toRefs(props),
      icon,
      source,
      name,
      isToken,
      boxClass,
    };
  },
});
export default ComBpmFlowTreeNodeTrigger;
</script>

<template lang="pug">
.com-bpm-flow-tree-node-trigger
  .flex.items-center(:class='boxClass')
    .flex.items-center.text-white.p-2.py-1(:class='isToken ? "bg-blue-500" : "bg-green-500"')
      TaIcon.mr-1(:type='icon')
      | {{ source }}
    .name.flex-grow.px-2.bg-white.h-full
      | {{ name }}
</template>

<style lang="stylus" scoped>
.box-before
  border-bottom-width 0.25rem
  // align-items flex-end
.box-after
  border-top-width 0.25rem
  // align-items flex-start
</style>
