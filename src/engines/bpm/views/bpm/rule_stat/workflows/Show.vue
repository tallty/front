<script lang="ts">
  import ComBpmWorkflowsShow from '@/engines/bpm/components/bpm/workflows/ComBpmWorkflowsShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { BpmRuleStatWorkflowsApi } from '@/engines/bpm/apis/bpm/rule_stat/workflows.api';
  import { BpmWorkflowModel } from '@/engines/bpm/models/bpm/rule_stat/workflows';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const BpmRuleStatWorkflowsShow = defineComponent({
    name: 'BpmRuleStatWorkflowsShow',
    components: {
    ComBpmWorkflowsShow,
  },
    setup(props) {
      const route = useRoute();

    const store = new VStore(new BpmRuleStatWorkflowsApi(), BpmWorkflowModel);

    const breadcrumbs = computed(() => [

    { label: '', route: '/bpm/rule_stat/workflows' },
          ]);

  onMounted(() => {
    store.find(Number(route.params.workflowId));
  });

  return {
    ...toRefs(props),
    store,
    record: store.record,
    breadcrumbs,
  };
  },
});

  export default BpmRuleStatWorkflowsShow;
</script>

<template lang="pug">
.bpm-rule-stat-workflows-show
  ComBpmWorkflowsShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.bpm-rule-stat-workflows-show
  width 100%
  height 100%
  .breadcrumbs
    padding 0 24px
</style>
