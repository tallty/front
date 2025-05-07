<script lang="ts">
import ComPermitAdminUsersIndex from '@/engines/permit/components/permit/admin/users/ComPermitAdminUsersIndex.vue';
import { defineComponent } from '@vue/runtime-core';

const PermitAdminUsersIndex = defineComponent({
  name: 'PermitAdminUsersIndex',
  components: {
    ComPermitAdminUsersIndex,
  },
  setup() {},
});

export default PermitAdminUsersIndex;
</script>

<template lang="pug">
.permit-admin-users-index
  ComPermitAdminUsersIndex
</template>

<style lang="stylus" scoped>
.permit-admin-users-index
  height 100%
  width 100%
</style>
