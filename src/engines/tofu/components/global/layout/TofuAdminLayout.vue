<script lang="ts">
import { defineComponent } from 'vue';
import TofuSidebarLayout from './TofuSidebarLayout.vue';
import ComTofuSidebarAdminPermitMenu from '../../ComTofuSidebarAdminPermitMenu.vue';
import { useRouter } from 'vue-router';

const TofuAdminLayout = defineComponent({
  name: 'TofuAdminLayout',
  components: {
    TofuSidebarLayout,
    ComTofuSidebarAdminPermitMenu,
  },
  setup() {},
});

export default TofuAdminLayout;
</script>

<template lang="pug">
.tofu-admin-layout.flex.flex-col.items-center
  TofuSidebarLayout.flex-grow.h-0(:needSub='false')
    template(#menu)
      ComTofuSidebarAdminPermitMenu.menu
    template(#default)
      slot

</template>

<style lang="stylus" scoped>
.tofu-admin-layout
  height 100%
  width 100%
  .menu
    height 100%
</style>
