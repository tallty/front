<script lang='ts'>
import { ref, defineComponent, toRefs, PropType, computed } from 'vue';
import { BpmTabs } from './BpmStat';
const ComBpmStatShowTabs = defineComponent({
  name: 'ComBpmStatShowTabs',
  components: {},
  props: {
    tabs: { type: Array as PropType<BpmTabs[]>, default: () => [] },
  },
  setup(props, { emit }) {
    const activeTabKey = ref(props.tabs[0].key)
    const current = ref(0)
    const cTabs = computed(() => props.tabs)

    const onChange = (tab: any, index: number) => {
      activeTabKey.value = tab.key
      current.value = index
      emit('change', tab)
    }
    return {
      ...toRefs(props),
      onChange,
      cTabs,
      current,
      activeTabKey,
    };
  },
});
export default ComBpmStatShowTabs;
</script>

<template lang="pug">
.com-bpm-stat-show-tabs.w-full
  .tabs__wrapper.flex.gap-x-4
    .tab.py-3.relative.text-center(
      v-for='(tab,index) in cTabs',
      @click='onChange(tab,index)',
      :style='`--d:${current};color:${current === index?"white":""};background:${current === index?"transparent":""}`'
    ) {{ tab.label }}
  .content__container.w-full.pt-4.h-full
    slot(:name='`${activeTabKey}_tab`')

</template>

<style lang="stylus" scoped>
.com-bpm-stat-show-tabs
  .tabs__wrapper
    .tab
      border-radius 6px
      width 120px
      z-index 2
      transition color .5s
      transition background .3s
      background white
    .tab:first-child::before
      content ''
      position absolute
      top 0;left 0;
      width 100%
      height @width
      background $primary-color
      z-index -1
      border-radius 6px
      transition all .5s
      transform translateX(calc(var(--d) * (100% + 16px)))
</style>

