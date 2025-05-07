<script lang="ts">
import ComComPrivatePoliciesIndex from '@/engines/com/components/com/private_policies/ComComPrivatePoliciesIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { ComAdminPrivatePoliciesApi } from '@/engines/com/apis/com/admin/private_policies.api';
import { ComPrivatePolicyModel } from '@/engines/com/models/com/admin/private_policies';
import { VStore } from '@/lib/vails';

const ComAdminPrivatePoliciesIndex = defineComponent({
  name: 'ComAdminPrivatePoliciesIndex',
  components: {
    ComComPrivatePoliciesIndex,
  },
  setup() {
    const store = new VStore(new ComAdminPrivatePoliciesApi(), ComPrivatePolicyModel);

    return {
      store,
    };
  },
});

export default ComAdminPrivatePoliciesIndex;
</script>

<template lang="pug">
.com-admin-private-policies-index
  ComComPrivatePoliciesIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.com-admin-private-policies-index
  height 100%
  width 100%
</style>
