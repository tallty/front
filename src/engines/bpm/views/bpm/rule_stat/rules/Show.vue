<script lang="ts">
  import ComBpmRulesShow from '@/engines/bpm/components/bpm/rules/ComBpmRulesShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { BpmRuleStatRulesApi } from '@/engines/bpm/apis/bpm/rule_stat/rules.api';
  import { BpmRuleModel } from '@/engines/bpm/models/bpm/rule_stat/rules';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const BpmRuleStatRulesShow = defineComponent({
    name: 'BpmRuleStatRulesShow',
    components: {
    ComBpmRulesShow,
  },
    setup(props) {
      const route = useRoute();
    
    const store = new VStore(new BpmRuleStatRulesApi(), BpmRuleModel);
    
    const breadcrumbs = computed(() => [
      
    { label: '', route: '/bpm/rule_stat/rules' },
          ]);

  onMounted(() => {
    store.find(Number(route.params.ruleId));
  });

  return {
    ...toRefs(props),
    store,
    record: store.record,
    breadcrumbs,
  };
  },
});

  export default BpmRuleStatRulesShow;
</script>

<template lang="pug">
.bpm-rule-stat-rules-show
  ComBpmRulesShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.bpm-rule-stat-rules-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
