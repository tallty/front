<template>
  <left-menu-layout key="leftmenu-layout" v-if="layout === 'left'">
    <slot />
  </left-menu-layout>
  <basic-layout key="basic-layout" v-else><slot /></basic-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BasicLayout from './basic-layout.vue';
import LeftMenuLayout from './leftmenu-layout.vue';
import { injectMenuState } from './use-menu-state';

export default defineComponent({
  name: 'GlobalLayout',
  setup() {
    return {
      ...injectMenuState(),
    };
  },
  components: {
    BasicLayout,
    LeftMenuLayout,
  },
});
</script>
