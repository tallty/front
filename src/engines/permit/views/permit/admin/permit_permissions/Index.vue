<script lang="ts">
import ComPermitPermitPermissionsIndex from '@/engines/permit/components/permit/permit_permissions/ComPermitPermitPermissionsIndex.vue';
import { defineComponent } from 'vue';
import { PermitAdminPermitPermissionsApi } from '@/engines/permit/apis/permit/admin/permit_permissions.api';
import { PermitPermitPermissionModel } from '@/engines/permit/models/permit/admin/permit_permissions';
import { VStore } from '@/lib/vails';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';

const PermitAdminPermitPermissionsIndex = defineComponent({
  name: 'PermitAdminPermitPermissionsIndex',
  components: {
    ComPermitPermitPermissionsIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(new PermitAdminPermitPermissionsApi(), PermitPermitPermissionModel);

    return {
      store,
    };
  },
});

export default PermitAdminPermitPermissionsIndex;
</script>

<template lang="pug">
.permit-admin-permit-permissions-index
  ComPermitPermitPermissionsIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.permit-admin-permit-permissions-index
  height 100%
  width 100%
</style>
