<script lang="ts">
import { Place } from '@/engines/bpm/bpm-core/types';
import { PropType, defineComponent, toRefs } from 'vue';

const BpmFlowTreeNodePlaceCondition = defineComponent({
  name: 'BpmFlowTreeNodePlaceCondition',
  props: { node: { type: Object as PropType<Place>, required: true } },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});

export default BpmFlowTreeNodePlaceCondition;
</script>

<template lang="pug">
.bpm-flow-tree-node-place-condition
  span(v-if='node.condition.is_default')
    | 默认条件
  TaConditionGroupDesc(
    v-else-if='node.condition.action_condition?.actions?.length > 0',
    :condition='node.condition.action_condition',
    :root='true',
  )
  //- span(
  //-   v-else-if='node.condition?.condition?.groups?.some(group => group?.items.some(item => item.rule || item.user_mode))'
  //- )
  //-   TaTemplateFormDesignerComplexConditionDesc(:complexCondition='node.condition.condition')
  span.placeholder(v-else)
    | 点击查看
</template>

<style lang="stylus"></style>
