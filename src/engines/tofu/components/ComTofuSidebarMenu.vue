<script lang="ts">
import store from '@/store';
import { computed, defineComponent, onMounted, PropType } from 'vue';
import { AuthSessionApi } from '../../login/apis/auth/session.api';
import { TofuEntry } from '../model';
import ComTofuMainMenu from './ComTofuMainMenu.vue';
import useAdminTofu from './useAdminTofu';
import useAutoMenu from './useAutoMenu';
import { NotificationOutlined } from '@ant-design/icons-vue';

const ComTofuSidebarMenu = defineComponent({
  name: 'ComTofuSidebarMenu',
  components: {
    ComTofuMainMenu,
    NotificationOutlined,
  },
  props: {
    needFetch: { type: Boolean, default: true },
    needBottom: { type: Boolean, default: true },
    menus: { type: Array as PropType<TofuEntry[]>, default: undefined },
  },
  setup(props) {
    const { fetchMenuTree, mainMenu, mainMenus, onSelectMenu } = useAutoMenu();
    // const homeMenu = { id: -1, url: '/menus', icon: '', name: '主页' };

    onMounted(() => {
      if (props.needFetch) fetchMenuTree();
    });

    const info = computed(() => store.state.user.currentUser);

    const logout = async () => {
      await new AuthSessionApi().logout();
      // 使用 location 跳转来彻底清空所有 store
      window.location.href = process.env.VUE_APP_LOGIN_HREF || '/login';
    };

    const { haveAnyAdminPermit, toSetting } = useAdminTofu();

    return {
      info,
      logout,
      // homeMenu,
      mainMenu,
      mainMenus,
      onSelectMenu,
      haveAnyAdminPermit,
      toSetting,
    };
  },
});

export default ComTofuSidebarMenu;
</script>

<template lang="pug">
.com-tofu-sidebar-menu
  .main-menu
    .top.pt-2
      .navigation(v-for='menu in (menus || mainMenus.filter(menu => menu.depth >= 0))')
        ComTofuMainMenu(
          :menu='menu',
          :active='mainMenu?.id === menu.id',
          @click.native='onSelectMenu(menu)'
        )
    .bottom(v-if='needBottom')
      .setting.space-y-4
        slot(name='menu-icons')
          .w-full.flex.justify-center
            img.w-6.h-6.cursor-pointer(v-if='haveAnyAdminPermit' src='https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/plan-mobile/plan_setting_icon.png' @click='toSetting')
          slot(name='extra-icons')
      .avatar
        .menu-item.avatar-box
          a-popover(placement='right')
            template(#content)
              .templatex
                .line
                  span.title 账号:
                  span.text {{ info.name }}
                .but-set
                  span.but
                    router-link(to='/res/user/info') 个人设置
                  span.but(@click='logout') 退出登录
            a-dropdown
              a-button.avatar-dropdown-btn(type='link')
                TaAvatar(:user='info')
</template>

<style lang="stylus">
.com-tofu-sidebar-menu
  display flex
  height 100%
  .main-menu
    display flex
    overflow-y auto
    flex-direction column
    justify-content space-between
    align-items center
    z-index 999
    background white
    width 80px
    box-shadow 2px 0px 8px 0px rgba(0, 0, 0, 0.08)
    >>> .ant-menu-vertical-left
      border-right 0px solid #fff
    .icon-shell
      height 64px
      display flex
      justify-content center
      align-items center
      .icon
        height 30px
        width 30px
    .bottom
      margin-bottom 23px
      .setting
        display flex
        justify-content center
        flex-direction column
        margin-bottom 12px
.templatex
  padding 20px
  width 180px
  nav
    display flex
    align-items center
    .nav-user
      margin-left 16px
      .name
        color rgba(0, 0, 0, 0.85)
        font-size 16px
      .type
        color rgba(0, 0, 0, 0.45)
        font-size 14px
  .line
    margin 8px 0px
    color rgba(0, 0, 0, 0.45)
    font-size 14px
    .text
      margin-left 16px
      color rgba(0, 0, 0, 0.85)
  .but-set
    display flex
    justify-content space-between
    align-items center
    .but:hover
      cursor pointer
</style>
