<script lang="ts">
import { defineComponent, computed } from 'vue';
import useAutoMenu, { useSubMenus, state } from '@/engines/tofu/components/useAutoMenu';
import store from '@/store';

const SimpleLayout = defineComponent({
  name: 'SimpleLayout',
  components: {},
  setup() {
    const { mainMenu, mainMenus, onSelectMenu } = useAutoMenu();
    const { subMenus, subMenuOpened } = useSubMenus();
    const selectedKeys = computed(() => state.menuChain.map(record => record.id));

    const current = computed(() => state.current);
    const selectedMainTofu = computed(() => state.menuChain[0]);
    const info = computed(() => store.state.user.currentUser);

    const onTabChange = (activeKey: number) => {
      const selectSubMenu = selectedMainTofu.value?.children?.find(item => item.id === activeKey);
      onSelectMenu(selectSubMenu!);
    };

    return {
      mainMenu,
      mainMenus,
      subMenus,
      subMenuOpened,
      selectedKeys,
      current,
      selectedMainTofu,
      onSelectMenu,
      info,
      onTabChange,
    };
  },
});
export default SimpleLayout;
</script>

<template lang="pug">
.simple-layout
  .sidebar
    //- img.logo(:src="require('@/assets/images/logo.svg')")
    a-menu.body(
      :selectedKeys='selectedKeys',
      mode='inline'
    )
      a-menu-item(
        v-for='record in mainMenus', :key='record.id'
        @click='onSelectMenu(record)'
      )
        | {{ record.name }}
  .main-container
    .head
      a-popover(placement='bottomRight')
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
          .user-info
            .user-name {{ info.name }}
            a-button.avatar-dropdown-btn(type='link')
              TaAvatar(:user='info')
    .body
      a-tabs.tabs(:default-active-key="current.id" @change='onTabChange')
        a-tab-pane.tab-pane(
          v-for="subMenu in selectedMainTofu?.children"
          :key='subMenu.id',
          :tab="subMenu.name"
        )
          .tab-block
      .router-view
        slot
</template>

<style lang="stylus" scoped>
.simple-layout
  height 100%
  width 100%
  display flex
 .sidebar
    width 260px
    height 100%
    background #4B5185
    z-index 200
    .logo
      margin 38px 0 38px 32px
      width 60px
      height 23px
    .ant-menu-root
      background #4B5185
      width 100%
      .ant-menu-item
        font-family: OPPOSans 2.0;
        font-style: normal;
        font-weight: 550;
        font-size: 14px;
        line-height: 20px;
        color: #FFFFFF;
        mix-blend-mode: normal;
        opacity: 0.6;
        width 100%
        height 54px
        display flex
        align-items center
        padding-left 28px
        margin 0
        transition unset
        &.ant-menu-item-selected
          border-left 4px solid #ffffff
          padding-left 24px
        &.ant-menu-item-selected
        &.ant-menu-item-active
          background-color #434978
          opacity 1
  .main-container
    position relative
    width calc(100% - 260px)
    height 100%
    background #f0f2f5
    .head
      width 100%
      height 66px
      background #ffffff
      .user-info
        font-family: OPPOSans 2.0;
        font-style: normal;
        font-weight: 550;
        font-size: 14px;
        line-height: 20px;
        color: #606266;
        height 100%
        display flex
        align-items center
        justify-content flex-end
        .user-name
          padding-right 20px
          border-right 1px solid #DCDFE5
        .user-img
          width 42px
          height 42px
          margin-left 20px
          margin-right 24px
          background #d8d8d8
          overflow hidden
          border-radius 50%
          cursor pointer
    .body
      margin 20px
      background #ffffff
      .tabs
        >>> .ant-tabs-bar
          margin 20px 40px 0
        .tab-pane
          .tab-block
            // 临时值
            width 100%
            height 0
  .router-view
    margin-top 20px
    display flex
    height calc(100% - 62px)
    width 100%
    overflow-y auto
</style>
