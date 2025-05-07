<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VStore } from '@/lib/vails';
import ComTofuAdminEntriesIndex from '../../../../../components/tofu/admin/ComTofuAdminEntriesIndex.vue';
import { TofuAdminPcEntriesApi } from '../../../../../apis/tofu/admin/pc/entries.api';

const TofuAdminPcEntriesIndex = defineComponent({
  name: 'TofuAdminPcEntriesIndex',
  components: {
    ComTofuAdminEntriesIndex,
  },
  props: {},
  setup(props) {
    const store = new VStore(new TofuAdminPcEntriesApi());
    return {
      ...toRefs(props),
      store,
    };
  },
});

export default TofuAdminPcEntriesIndex;
</script>

<template lang="pug">
.tofu-admin-pc-entries-index
  ComTofuAdminEntriesIndex(:store='store')
</template>

<style lang="stylus" scoped>
.tofu-admin-pc-entries-index
  height 100%
  width 100%
</style>
