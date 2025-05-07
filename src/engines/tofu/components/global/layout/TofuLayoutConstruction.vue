<script lang="ts">
import { ref, defineComponent, toRefs } from 'vue';
import ComTofuSubMenu from '@/engines/tofu/components/ComTofuSubMenu.vue';

const TofuLayoutConstruction = defineComponent({
  name: 'TofuLayoutConstruction',
  components: {
    ComTofuSubMenu,
  },
  props: {
    needSubMenu: { type: Boolean, default: true },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});
export default TofuLayoutConstruction;
</script>

<template lang="pug">
.tofu-layout-construction.flex.flex-col.w-full
  .header.flex-shrink-0
    slot(name='header')
  .content.flex-grow.h-0.flex
    .sidebar.flex-shrink-0
      slot(name='sidebar')
    .body.flex-grow.w-0.flex-col.flex
      .tabs.flex-shrink-0
        slot(name='tabs')
      .content-sell.flex-grow.h-0.flex
        ComTofuSubMenu.sub-menus.flex-shrink-0(v-if='needSubMenu')
        .content.flex-grow.w-0.h-full.overflow-y-auto
          slot(name='body')
</template>

<style lang="stylus" scoped>
.tofu-layout-constructor
  @media print
    .header, .sidebar, .tabs, .sub-menus
      display none
</style>
