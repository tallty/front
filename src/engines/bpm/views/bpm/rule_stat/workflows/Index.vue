<script lang="ts">
import { BpmRuleStatWorkflowsApi } from '@/engines/bpm/apis/bpm/rule_stat/workflows.api';
import ComBpmWorkflowsIndex from '@/engines/bpm/components/bpm/workflows/ComBpmWorkflowsIndex.vue';
import { BpmWorkflowModel } from '@/engines/bpm/models/bpm/rule_stat/workflows';
import { VStore } from '@/lib/vails';
import { defineComponent } from '@vue/runtime-core';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';

const BpmRuleStatWorkflowsIndex = defineComponent({
  name: 'BpmRuleStatWorkflowsIndex',
  components: {
    ComBpmWorkflowsIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(
      new BpmRuleStatWorkflowsApi({
        params: {
          q: {
            s: ['position asc'],
          },
        },
      }),
      BpmWorkflowModel,
    );

    return {
      store,
    };
  },
});

export default BpmRuleStatWorkflowsIndex;
</script>

<template lang="pug">
.bpm-rule-stat-workflows-index
  ComBpmWorkflowsIndex(:store='store')
</template>

<style lang="stylus" scoped>
.bpm-rule-stat-workflows-index
  height 100%
  width 100%
</style>
