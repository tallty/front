<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VStore } from '@/lib/vails';
import ComTofuAdminEntriesIndex from '@/engines/tofu/components/tofu/admin/ComTofuAdminEntriesIndex.vue';
import { TofuAdminPcEntriesApi } from '@/engines/tofu/apis/tofu/admin/pc/entries.api';
import { useRoute } from 'vue-router';

const TofuAdminPcModsEntriesIndex = defineComponent({
  name: 'TofuAdminPcModsEntriesIndex',
  components: {
    ComTofuAdminEntriesIndex,
  },
  props: {},
  setup(props) {
    const route = useRoute();
    const store = new VStore(
      new TofuAdminPcEntriesApi({
        pathIndexKey: 'entries',
        parents: [{ type: 'pc/mods', id: +route.params.modId }],
      }),
    );
    return {
      ...toRefs(props),
      store,
    };
  },
});

export default TofuAdminPcModsEntriesIndex;
</script>

<template lang="pug">
.tofu-admin-pc-mod-entries-index
  ComTofuAdminEntriesIndex(:store='store')
</template>

<style lang="stylus" scoped>
.tofu-admin-pc-mod-entries-index
  height 100%
  width 100%
</style>
