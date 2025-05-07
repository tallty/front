<script lang="ts">
import { defineComponent } from 'vue';
import { MultiTab } from '@/components/multi-tab';
import ComTofuSidebarMenu from '@/engines/tofu/components/ComTofuSidebarMenu.vue';
import ComTofuSubMenu from '@/engines/tofu/components/ComTofuSubMenu.vue';
import { toRefs } from '@vue/reactivity';

const TofuSidebarLayout = defineComponent({
  name: 'TofuSidebarLayout',
  components: {
    MultiTab,
    ComTofuSidebarMenu,
    ComTofuSubMenu,
  },
  props: {
    needSub: { type: Boolean, default: true },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});

export default TofuSidebarLayout;
</script>

<template lang="pug">
.tofu-sidebar-layout.w-full.flex(class='!h-full')
  .tofu-sidebar-layout__left
    slot(name='menu')
      ComTofuSidebarMenu(:needFetch='false')
        template(#extra-icons)
          slot(name='extra-icons')
  .tofu-sidebar-layout__right.px-6.flex.overflow-hidden.flex-col.flex-grow
    .tofu-sidebar-layout-tabs.flex-shrink-0
      MultiTab
    .tofu-sidebar-layout__route-view.flex.h-0.flex-grow.w-full.overflow-hidden
      ComTofuSubMenu.sub-menu(v-if='needSub')
      slot
</template>

<style lang="stylus" scoped>

@media print
  .tofu-sidebar-layout
    height auto
  .tofu-sidebar-layout__left, .tofu-sidebar-layout-tabs, .sub-menu
    display none
    .tofu-sidebar-layout__route-view
      padding 0
      width 100%
      height auto
</style>
