<script lang="ts">
  import ComComPrivatePoliciesShow from '@/engines/com/components/com/private_policies/ComComPrivatePoliciesShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { ComAdminPrivatePoliciesApi } from '@/engines/com/apis/com/admin/private_policies.api';
  import { ComPrivatePolicyModel } from '@/engines/com/models/com/admin/private_policies';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const ComAdminPrivatePoliciesShow = defineComponent({
    name: 'ComAdminPrivatePoliciesShow',
    components: {
    ComComPrivatePoliciesShow,
  },
    setup(props) {
      const route = useRoute();
    
    const store = new VStore(new ComAdminPrivatePoliciesApi(), ComPrivatePolicyModel);
    
    const breadcrumbs = computed(() => [
      
    { label: '', route: '/com/admin/private_policies' },
          ]);

  onMounted(() => {
    store.find(Number(route.params.private_policyId));
  });

  return {
    ...toRefs(props),
    store,
    record: store.record,
    breadcrumbs,
  };
  },
});

  export default ComAdminPrivatePoliciesShow;
</script>

<template lang="pug">
.com-admin-private-policies-show
  ComComPrivatePoliciesShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.com-admin-private-policies-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
