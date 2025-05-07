<script lang="ts">
import ComComSearchItemsIndex from '@/engines/com/components/com/search_items/ComComSearchItemsIndex.vue';
import { defineComponent } from '@vue/runtime-core';
import { ComAdminSearchItemsApi } from '@/engines/com/apis/com/admin/search_items.api';
import { VStore } from '@/lib/vails';

const ComAdminSearchItemsIndex = defineComponent({
  name: 'ComAdminSearchItemsIndex',
  components: {
    ComComSearchItemsIndex,
  },
  setup() {
    const store = new VStore(new ComAdminSearchItemsApi());

    return {
      store,
    };
  },
});

export default ComAdminSearchItemsIndex;
</script>

<template lang="pug">
.com-admin-search-items-index
  ComComSearchItemsIndex(:store='store' )
</template>

<style lang="stylus" scoped>
.com-admin-search-items-index
  height 100%
  width 100%
</style>
