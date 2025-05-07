<script lang="ts">
import ComComThemeIndex from '@/engines/com/components/com/themes/ComComThemeIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { ComAdminThemeApi } from '@/engines/com/apis/com/admin/theme.api';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';

const ComAdminThemeIndex = defineComponent({
  name: 'ComAdminThemeIndex',
  components: {
    ComComThemeIndex,
  },
  setup() {
    const routes = useRoute();
    const appId = Number(routes.params.appId);

    const store = new VStore(
      new ComAdminThemeApi({
        parents: [{ type: 'apps', id: appId }],
      }),
    );

    return {
      store,
      appId,
    };
  },
});

export default ComAdminThemeIndex;
</script>

<template lang="pug">
.com-admin-theme-index
  ComComThemeIndex(:store='store', :appId='appId' )
</template>

<style lang="stylus" scoped>
.com-admin-theme-index
  height 100%
  width 100%
</style>
