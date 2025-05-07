<script lang="ts">
  import ComPermitPermitPermissionsShow from '@/engines/permit/components/permit/permit_permissions/ComPermitPermitPermissionsShow.vue';
  import { defineComponent, toRefs, onMounted, computed } from 'vue';
  import { PermitAdminPermitPermissionsApi } from '@/engines/permit/apis/permit/admin/permit_permissions.api';
  import { PermitPermitPermissionModel } from '@/engines/permit/models/permit/admin/permit_permissions';
  import { VStore } from '@/lib/vails';
  import { useRoute } from 'vue-router';

  const PermitAdminPermitPermissionsShow = defineComponent({
    name: 'PermitAdminPermitPermissionsShow',
    components: {
    ComPermitPermitPermissionsShow,
  },
    setup(props) {
      const route = useRoute();
    
    const store = new VStore(new PermitAdminPermitPermissionsApi(), PermitPermitPermissionModel);
    
    const breadcrumbs = computed(() => [
      
    { label: '', route: '/permit/admin/permit_permissions' },
          ]);

  onMounted(() => {
    store.find(Number(route.params.permit_permissionId));
  });

  return {
    ...toRefs(props),
    store,
    record: store.record,
    breadcrumbs,
  };
  },
});

  export default PermitAdminPermitPermissionsShow;
</script>

<template lang="pug">
.permit-admin-permit-permissions-show
  ComPermitPermitPermissionsShow(v-if='record.id', :store='store', :breadcrumbs='breadcrumbs')
</template>

<style lang="stylus" scoped>
.permit-admin-permit-permissions-show
  height 100%
  width 100%
  .breadcrumbs
    padding 0 24px
</style>
