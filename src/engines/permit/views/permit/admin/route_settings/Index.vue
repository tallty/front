<script lang="ts">
import ComComRouteSettingsIndex from '@/engines/permit/components/permit/route_settings/ComComRouteSettingsIndex.vue';
import { defineComponent } from 'vue';
import { ComAdminRouteSettingsApi } from '@/engines/permit/apis/permit/admin/route_settings.api';
import { ComRouteSettingModel } from '@/engines/permit/models/permit/admin/route_settings';
import { VStore } from '@/lib/vails';

import usePolicy from '@/components/global/ta-component/ta-template-form-core/usePolicy';

const ComAdminRouteSettingsIndex = defineComponent({
  name: 'ComAdminRouteSettingsIndex',
  components: {
    ComComRouteSettingsIndex,
  },
  setup() {
    usePolicy();

    const store = new VStore(new ComAdminRouteSettingsApi(), ComRouteSettingModel);
    return {
      store,
    };
  },
});

export default ComAdminRouteSettingsIndex;
</script>

<template lang="pug">
.com-admin-route-settings-index
  ComComRouteSettingsIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.com-admin-route-settings-index
  height 100%
  width 100%
</style>
