<script lang="ts">
import ComBpmCatalogsIndex from '@/engines/bpm/components/bpm/catalogs/ComBpmCatalogsIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { BpmAdminCatalogsApi } from '@/engines/bpm/apis/bpm/admin/catalogs.api';
import { VStore } from '@/lib/vails';

const BpmAdminCatalogsIndex = defineComponent({
  name: 'BpmAdminCatalogsIndex',
  components: {
    ComBpmCatalogsIndex,
  },
  setup() {
    const store = new VStore(new BpmAdminCatalogsApi());

    return {
      store,
    };
  },
});

export default BpmAdminCatalogsIndex;
</script>

<template lang="pug">
.bpm-admin-catalogs-index
  ComBpmCatalogsIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.bpm-admin-catalogs-index
  height 100%
  width 100%
</style>
