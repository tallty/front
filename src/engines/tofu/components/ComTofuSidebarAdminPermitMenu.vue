<script lang="ts">
import { defineComponent, computed } from 'vue';
import ComTofuSidebarMenu from './ComTofuSidebarMenu.vue';
import store from '@/store';
import useAdminTofu from './useAdminTofu';
import { useRouter } from 'vue-router';

const ComTofuSidebarAdminPermitMenu = defineComponent({
  name: 'ComTofuSidebarAdminPermitMenu',
  components: {
    ComTofuSidebarMenu,
  },
  props: {},
  setup() {
    const info = computed(() => store.state.user.currentUser);

    const { getPermittedEntries } = useAdminTofu();

    const menus = computed(() => getPermittedEntries(info.value.roles_name || []));

    const router = useRouter();

    const toHome = () => {
      router.push('/');
    };

    return {
      menus,
      toHome,
    };
  },
});

export default ComTofuSidebarAdminPermitMenu;
</script>

<template lang="pug">
.com-tofu-sidebar-admin-permit-menu
  ComTofuSidebarMenu(:needFetch='false', :menus='menus')
    template(#menu-icons)
      TaIcon(
        type='HomeFilled',
        size='32',
        @click='toHome'
      )
</template>

<style lang="stylus">
.com-tofu-sidebar-admin-permit-menu
  height auto
</style>
