<script lang="ts">
import ComComAdminModelSettingsIndex from '@/engines/com/components/com/admin/model_settings/ComComAdminModelSettingsIndex.vue';
import { defineComponent } from '@vue/runtime-core';

const ComAdminModelSettingsIndex = defineComponent({
  name: 'ComAdminModelSettingsIndex',
  components: {
    ComComAdminModelSettingsIndex,
  },
  setup() {},
});

export default ComAdminModelSettingsIndex;
</script>

<template lang="pug">
.com-admin-model-settings-index
  ComComAdminModelSettingsIndex
</template>

<style lang="stylus" scoped>
.com-admin-model-settings-index
  height 100%
  width 100%
</style>
