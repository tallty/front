<script lang="ts">
import { Place } from '@/engines/bpm/bpm-core/types';
import { PropType, computed, defineComponent, toRefs } from 'vue';
import ComBpmFlowTreeNodeBase from './ComBpmFlowTreeNodeBase.vue';
import { injectFlowTreeRootProps } from './useFlowTreeRootProps';

const ComBpmFlowTreeNode = defineComponent({
  name: 'ComBpmFlowTreeNode',
  components: { ComBpmFlowTreeNodeBase },
  props: {
    node: { type: Object as PropType<Place>, required: true },
    disabled: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  emits: ['update:node', 'click', 'remove', 'topCondition'],
  setup(props, { emit }) {
    const localNode = computed({
      get: () => props.node,
      set: val => emit('update:node', val),
    });

    const { rootProps } = injectFlowTreeRootProps();

    const change = () => {
      emit('update:node', props.node);
    };

    const clickNode = () => {
      emit('click', props.node);
    };

    const removeNode = () => {
      emit('remove', props.node);
    };

    const onTopCondition = () => {
      emit('topCondition', props.node);
    };

    return {
      ...toRefs(props),
      places: rootProps.value.places,
      change,
      clickNode,
      removeNode,
      localNode,
      onTopCondition,
    };
  },
});

export default ComBpmFlowTreeNode;
</script>

<template lang="pug">
ComBpmFlowTreeNodeBase(
  v-model:node='localNode',
  :disabled='disabled',
  :places='places',
  @remove='removeNode',
  @topCondition='onTopCondition',
  @click='clickNode'
)
  //- @change='change'
</template>
