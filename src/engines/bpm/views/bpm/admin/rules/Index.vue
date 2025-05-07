<script lang="ts">
import ComBpmAdminRulesIndex from '@/engines/bpm/components/bpm/rules/ComBpmAdminRulesIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { BpmAdminRulesApi } from '@/engines/bpm/bpm-core/apis/bpm/admin/rules.api';
import { BpmRuleModel } from '@/engines/bpm/bpm-core/models/bpm/admin/rules';
import { VStore } from '@/lib/vails';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';
import { useRoute } from 'vue-router';

const BpmAdminRulesIndex = defineComponent({
  name: 'BpmAdminRulesIndex',
  components: {
    ComBpmAdminRulesIndex,
  },
  setup() {
    usePolicy();

    const route = useRoute();
    const workflowId = Number(route.params.workflowId);

    const store = new VStore(
      new BpmAdminRulesApi({
        parents: [{ type: 'workflows', id: workflowId }],
      }),
      BpmRuleModel,
    );

    return {
      store,
    };
  },
});

export default BpmAdminRulesIndex;
</script>

<template lang="pug">
.bpm-admin-rules-index
  ComBpmAdminRulesIndex(:store='store')
</template>

<style lang="stylus" scoped>
.bpm-admin-rules-index
  height 100%
  width 100%
</style>
