<script lang="ts">
import ComPermitDataScopesIndex from '@/engines/permit/components/permit/data_scopes/ComPermitDataScopesIndex.vue';
import { defineComponent } from 'vue';
import { PermitAdminDataScopesApi } from '@/engines/permit/apis/permit/admin/data_scopes.api';
import { PermitDataScopeModel } from '@/engines/permit/models/permit/admin/data_scopes';
import { VStore } from '@/lib/vails';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';

const PermitAdminDataScopesIndex = defineComponent({
  name: 'PermitAdminDataScopesIndex',
  components: {
    ComPermitDataScopesIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(new PermitAdminDataScopesApi(), PermitDataScopeModel);

    return {
      store,
    };
  },
});

export default PermitAdminDataScopesIndex;
</script>

<template lang="pug">
.permit-admin-data-scopes-index
  ComPermitDataScopesIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.permit-admin-data-scopes-index
  height 100%
  width 100%
</style>
