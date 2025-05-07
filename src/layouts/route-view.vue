<template lang="pug">
.route-view
  ComTofuSubMenu
  router-view(v-slot='{ Component }')
    multi-tab-store-consumer
      component.shell(v-if='Component', :is='Component')
      slot(v-else)

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MultiTabStoreConsumer } from '@/components/multi-tab';
import ComTofuSubMenu from '../engines/tofu/components/ComTofuSubMenu.vue';

export default defineComponent({
  name: 'RouteView',
  components: {
    ComTofuSubMenu,
    MultiTabStoreConsumer,
  },
});
</script>

<style lang="stylus" scoped>
.route-view
  display flex
  height calc(100% - 62px)
  width 100%
.shell
  padding 0 24px 0 24px
  width 100%
  flex 1
  // border 1px solid red
</style>
