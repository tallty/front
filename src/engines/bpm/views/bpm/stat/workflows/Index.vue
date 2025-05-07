<script lang="ts">
import ComBpmStatWorkflowsIndex from '@/engines/bpm/components/bpm/workflows/ComBpmStatWorkflowsIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { VStore } from '@/lib/vails';
import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';
import { BpmAdminWorkflows, WorkflowModel } from '../../../../bpm-core/apis/admin/workflow.api';

const BpmStatWorkflowsIndex = defineComponent({
  name: 'BpmStatWorkflowsIndex',
  components: {
    ComBpmStatWorkflowsIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(new BpmAdminWorkflows(), WorkflowModel);

    return {
      store,

    };
  },
});

export default BpmStatWorkflowsIndex;
</script>

<template lang="pug">
.bpm-stat-workflows-index
  ComBpmStatWorkflowsIndex(:store='store')
</template>

<style lang="stylus" scoped>
.bpm-stat-workflows-index
  height 100%
  width 100%
</style>
