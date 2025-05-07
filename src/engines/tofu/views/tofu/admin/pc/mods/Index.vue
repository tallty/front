<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VStore } from '@/lib/vails';
import { TofuAdminPcModsApi } from '../../../../../apis/tofu/admin/pc/mods.api';
import ComTofuAdminModsIndex from '../../../../../components/tofu/admin/ComTofuAdminModsIndex.vue';

const TofuAdminPcModsIndex = defineComponent({
  name: 'TofuAdminPcModsIndex',
  components: {
    ComTofuAdminModsIndex,
  },
  props: {},
  setup(props) {
    const store = new VStore(new TofuAdminPcModsApi());
    return {
      ...toRefs(props),
      store,
    };
  },
});

export default TofuAdminPcModsIndex;
</script>

<template lang="pug">
.tofu-admin-pc-mod-index
  ComTofuAdminModsIndex(:store='store')
</template>

<style lang="stylus" scoped>
.tofu-admin-pc-mod-index
  height 100%
  width 100%
</style>
