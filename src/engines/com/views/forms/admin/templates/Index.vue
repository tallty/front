<script lang="ts">
import ComFormsAdminTemplatesIndex from '@/engines/com/components/forms/admin/templates/ComFormsAdminTemplatesIndex.vue';
import { defineComponent } from '@vue/runtime-core';

const FormsAdminTemplatesIndex = defineComponent({
  name: 'FormsAdminTemplatesIndex',
  components: {
    ComFormsAdminTemplatesIndex,
  },
  setup() {},
});

export default FormsAdminTemplatesIndex;
</script>

<template lang="pug">
.forms-admin-templates-index
  ComFormsAdminTemplatesIndex
</template>

<style lang="stylus" scoped>
.forms-admin-templates-index
  height 100%
  width 100%
</style>
