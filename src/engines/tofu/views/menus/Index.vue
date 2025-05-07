<script lang="ts">
import { defineComponent } from 'vue';
import ComSettingCard from '@/engines/com/components/com/ComSettingCard.vue';
import { useDashboardMenu } from '../../components/useAutoMenu';

const MenusIndex = defineComponent({
  name: 'MenusIndex',
  components: {
    ComSettingCard,
  },
  setup() {
    const { onSelectMenu, dashboardMenus } = useDashboardMenu();

    return {
      dashboardMenus,
      onSelectMenu,
    };
  },
});

export default MenusIndex;
</script>

<template lang="pug">
.menus-index
  .group(v-for='groupMenu in dashboardMenus')
    TaTitleHeader(:title='groupMenu.name')
    .cards
      ComSettingCard.card(
        v-for='cardMenu in groupMenu.children',
        :name='cardMenu.name',
        :img='cardMenu.icon || undefined',
        @click.native='onSelectMenu(cardMenu)'
      )
</template>

<style lang="stylus">
.menus-index
  width 100%
  height 100%
  .cards
    display flex
    .card
      margin-right 20px
</style>
