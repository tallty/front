<script lang="ts">
import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';
import useNavigateTab from '@/components/global/ta-component/useNavigateTab';
import { BpmRuleStatRulesApi } from '@/engines/bpm/apis/bpm/rule_stat/rules.api';
import { BpmRuleStatWorkflowsApi } from '@/engines/bpm/apis/bpm/rule_stat/workflows.api';
import ComBpmRulesIndex from '@/engines/bpm/components/bpm/rules/ComBpmRulesIndex.vue';
import { BpmRuleModel } from '@/engines/bpm/models/bpm/rule_stat/rules';
import { VStore } from '@/lib/vails';
import { defineComponent, onMounted, ref } from '@vue/runtime-core';
import { useRoute } from 'vue-router';

const BpmRuleStatRulesIndex = defineComponent({
  name: 'BpmRuleStatRulesIndex',
  components: {
    ComBpmRulesIndex,
  },
  setup() {
    usePolicy();
    const { updateTitle } = useNavigateTab();
    const route = useRoute();
    const id = ref(Number(route.params.workflowId));

    const store = new VStore(
      new BpmRuleStatRulesApi({
        params: {
          q: {
            workflow_id_eq: id.value,
          },
        },
      }),
      BpmRuleModel,
    );
    const workflowStore = new VStore(new BpmRuleStatWorkflowsApi());

    onMounted(() =>
      workflowStore.find(id.value).then(() => {
        updateTitle(workflowStore.record?.value?.name, route.fullPath);
      }),
    );
    return {
      store,
      workflow: workflowStore.record,
      id,
    };
  },
});

export default BpmRuleStatRulesIndex;
</script>

<template lang="pug">
.bpm-rule-stat-rules-index
  ComBpmRulesIndex(:store='store', :workflow='workflow',:id='id')
</template>

<style lang="stylus" scoped>
.bpm-rule-stat-rules-index
  width 100%
  height 100%
</style>
