<script lang="ts">
  import ComPermitDataScopesShow from '@/engines/permit/components/permit/data_scopes/ComPermitDataScopesShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { PermitAdminDataScopesApi } from '@/engines/permit/apis/permit/admin/data_scopes.api';
  import { PermitDataScopeModel } from '@/engines/permit/models/permit/admin/data_scopes';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const PermitAdminDataScopesShow = defineComponent({
    name: 'PermitAdminDataScopesShow',
    components: {
    ComPermitDataScopesShow,
  },
    setup(props) {
      const route = useRoute();
    
    const store = new VStore(new PermitAdminDataScopesApi(), PermitDataScopeModel);
    
    const breadcrumbs = computed(() => [
      
    { label: '', route: '/permit/admin/data_scopes' },
          ]);

  onMounted(() => {
    store.find(Number(route.params.data_scopeId));
  });

  return {
    ...toRefs(props),
    store,
    record: store.record,
    breadcrumbs,
  };
  },
});

  export default PermitAdminDataScopesShow;
</script>

<template lang="pug">
.permit-admin-data-scopes-show
  ComPermitDataScopesShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.permit-admin-data-scopes-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
