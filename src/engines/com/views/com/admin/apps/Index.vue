<script lang="ts">
import ComComAppsIndex from '@/engines/com/components/com/apps/ComComAppsIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { ComAdminAppsApi } from '@/engines/com/apis/com/admin/apps.api';
import { ComAppModel } from '@/engines/com/models/com/admin/apps';
import { VStore } from '@/lib/vails';

const ComAdminAppsIndex = defineComponent({
  name: 'ComAdminAppsIndex',
  components: {
    ComComAppsIndex,
  },
  setup() {
    const store = new VStore(new ComAdminAppsApi(), ComAppModel);

    return {
      store,
    };
  },
});

export default ComAdminAppsIndex;
</script>

<template lang="pug">
.com-admin-apps-index
  ComComAppsIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.com-admin-apps-index
  height 100%
  width 100%
</style>
