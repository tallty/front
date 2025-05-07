<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import ComBpmFlowTree from './ComBpmFlowTree.vue';

const defaultCore = {
  tree: [{ source: { id: null, seq: 'start' }, target: { id: null, seq: 'end' } }],
  places: [
    { id: null, name: '开始', seq: 'start', type: 'Place', transition_type: 'Transition' },
    { id: null, name: '结束', seq: 'end', type: 'Place' },
  ],
};

const ComBpmFlowTreeViewer = defineComponent({
  name: 'ComBpmFlowTreeViewer',
  components: { ComBpmFlowTree },
  props: {
    visible: { type: Boolean, default: false },
    workflow: { type: Object, default: () => ({ core: defaultCore }) },
  },
  setup(props, { emit }) {
    const localVisible = computed({
      get: () => props.visible,
      set: val => emit('update:visible', val),
    });

    const close = () => (localVisible.value = false);

    return {
      ...toRefs(props),
      close,
      localVisible,
    };
  },
});

export default ComBpmFlowTreeViewer;
</script>

<template lang="pug">
a-modal(
  v-model:visible='localVisible',
  title='流程图概览',
  :footer='null',
  :width='960',
  @onCancel='close'
)
  .flow-tree-container
    ComBpmFlowTree(
      v-if='workflow.core',
      :core='workflow.core',
      :showStartPoint='false',
      :showStartNode='true',
      :disabled='true'
    )
</template>

<style lang="stylus" scoped>
.flow-tree-container
  position relative
  height 550px
</style>
