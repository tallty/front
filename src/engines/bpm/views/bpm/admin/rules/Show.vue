<script lang="ts">
  import ComBpmRulesShow from '@/engines/bpm/components/bpm/rules/ComBpmRulesShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { BpmAdminRulesApi } from '@/engines/bpm/bpm-core/apis/bpm/admin/rules.api';
  import { BpmRuleModel } from '@/engines/bpm/bpm-core/models/bpm/admin/rules';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const BpmAdminRulesShow = defineComponent({
    name: 'BpmAdminRulesShow',
    components: {
    ComBpmRulesShow,
  },
    setup(props) {
      const route = useRoute();
    
    const store = new VStore(new BpmAdminRulesApi(), BpmRuleModel);
    
    const breadcrumbs = computed(() => [
      
    { label: '', route: '/bpm/admin/rules' },
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

  export default BpmAdminRulesShow;
</script>

<template lang="pug">
.bpm-admin-rules-show
  ComBpmRulesShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.bpm-admin-rules-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
