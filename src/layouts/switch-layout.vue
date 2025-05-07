<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import useAutoMenu, { state } from '@/engines/tofu/components/useAutoMenu';
import SimpleLayout from './switch-layout/simple-layout.vue';
import { MultiTabStoreConsumer } from '../components/multi-tab/multi-tab-store';
import TofuAdminLayout from '../engines/tofu/components/global/layout/TofuAdminLayout.vue';
import TofuSidebarLayout from '../engines/tofu/components/global/layout/TofuSidebarLayout.vue';

const SwitchLayout = defineComponent({
  name: 'SwitchLayout',
  components: {
    SimpleLayout,
    MultiTabStoreConsumer,
    TofuAdminLayout,
    TofuSidebarLayout,
  },
  setup() {
    const { fetchMenuTree } = useAutoMenu();

    onMounted(() => {
      fetchMenuTree();
    });

    const selectedMainTofu = computed(() => state.menuChain[0]);

    const layoutComponent = computed(() => {
      if (selectedMainTofu.value?.layout === 'simple') {
        return 'SimpleLayout';
      }

      if (selectedMainTofu.value?.layout === 'TofuAdminLayout') {
        return 'TofuAdminLayout';
      }

      return 'TofuSidebarLayout';
    });

    return {
      layoutComponent,
    };
  },
});

export default SwitchLayout;
</script>

<template lang="pug">
keep-alive
  component(:is='layoutComponent')
    router-view(v-slot='{ Component }')
      MultiTabStoreConsumer
        component.route-view__shell(v-if='Component', :is='Component')
        slot(v-else)

</template>

<style lang="stylus" scoped>
.route-view__shell
  padding 0 24px 20px 24px
  width 100%
  flex 1
</style>
