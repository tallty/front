<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useSubMenus, state } from './useAutoMenu';
import ComTofuNestedMenu from './ComTofuNestedMenu.vue';
import ComTofuMenuCell from './ComTofuMenuCell.vue';
import { TofuEntry } from '../model';

const ComTofuSubMenu = defineComponent({
  name: 'ComTofuSubMenu',
  components: {
    ComTofuNestedMenu,
    ComTofuMenuCell,
  },
  setup() {
    const { onSelectMenu, subMenus, subMenuOpened } = useSubMenus();
    const selectedKeys = computed(() => state.menuChain.map((record: TofuEntry) => record.id));

    return {
      onSelectMenu,
      subMenus,
      subMenuOpened,
      selectedKeys,
    };
  },
});

export default ComTofuSubMenu;
</script>

<template lang="pug">
.com-tofu-sub-menu(:class='{ "sub-menu-active": subMenuOpened }')
  .sub-menu
    a-menu.body(:selectedKeys='selectedKeys', mode='inline')
      template(v-for='record in subMenus')
        a-menu-item(v-if='record.children.length === 0', :key='record.id')
          ComTofuMenuCell(:record='record', :showIcon='true')
        ComTofuNestedMenu(v-else, :record='record')
</template>

<style lang="stylus" scoped>
.com-tofu-sub-menu
  width 0
  overflow hidden
  flex-shrink 0
  .sub-menu
    >>> .ant-menu-inline,
      border-right 0 solid #e8e8e8
    background white
    transition all 0.2s ease-in-out
    padding 14px 0
    width 0
    overflow hidden
    position relative
    .body
      overflow hidden
    .group
      width 200px
      color #8C8C8C
    >>> .ant-menu-item-selected
      .group
        color $primary-color
.sub-menu-active
  width 200px
</style>
