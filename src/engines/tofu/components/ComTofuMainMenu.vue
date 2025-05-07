<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { useAutoMenuHelper } from './useAutoMenu';
import { TofuEntry } from '../model';

const ComTofuMainMenu = defineComponent({
  name: 'ComTofuMainMenu',
  components: {},
  props: {
    menu: { type: Object as PropType<TofuEntry>, required: true },
    url: { type: String, default: '' },
    active: { type: Boolean, default: false },
  },
  setup(props) {
    const { isExternalLink, openExternalLink } = useAutoMenuHelper();

    return {
      ...toRefs(props),
      isExternalLink,
      openExternalLink,
    };
  },
});
export default ComTofuMainMenu;
</script>

<template lang="pug">
.com-tofu-main-menu
  template(
    v-if='!(url || menu.url) || isExternalLink(url || menu.url)',
    @click='openExternalLink(url || menu.url)'
  )
    .tofu
      .group
        a-tooltip(:mouseEnterDelay='0.5')
          template(#title)
            .text {{ menu.name }}
          TaIcon.icon.w-6.h-6(:type='menu.icon', theme='filled', :size='``')
          div {{ menu.name }}
  router-link(v-else, :to='url || menu.url')
    .tofu.py-2(:class='{ "tofu-active": active }')
      .group
        a-tooltip(:mouseEnterDelay='0.5')
          template(#title)
            .text {{ menu.name }}
          TaIcon.icon.w-6.h-6(:type='menu.icon', theme='filled', :size='``')
          div {{ menu.name }}
</template>

<style lang="stylus" scoped>
.com-tofu-main-menu
  display flex
  justify-content center
  align-items center
  cursor pointer
  .tofu
    width 60px
    background white
    border-radius 4px
    display flex
    justify-content center
    align-items center
    color #808080
    .group
      text-align center
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 3
      -webkit-box-orient vertical
      .icon
        font-size 20px
  .tofu-active
    background rgba($primary-color, 0.1)
    color $primary-color
    .icon
      color $primary-color
</style>
