<script lang='ts'>
import { ref, defineComponent, toRefs, computed, PropType } from 'vue';
import { StatisticsData } from '@/engines/bpm/components/stat/BpmStat';

const ComBpmStateStatistics = defineComponent({
  name: 'ComBpmStateStatistics',
  components: {},
  props: {
    name: { type: String, default: null },
    data: { type: Object as PropType<StatisticsData[]>, default: () => { } },
    splitPostion: { type: Number, default: 1 },
  },
  setup(props) {
    const _data = computed(() => {
      return props.data
    })
    return {
      ...toRefs(props),
      _data,
    };
  },
});
export default ComBpmStateStatistics;
</script>

<template lang="pug">
.com-bpm-state-statistics.w-full.bg-white.p-6
  .statistics__title.text-gray-900.mb-4(v-if='!!name') {{ name }}
  .statistics__board.flex.justify-around
    .board__item.flex.items-center.px-3(v-for='(item,index) in _data',:style='`order:${index*2}`')
      .circle.flex-center.mr-4(:class='$style[item?.bg]')
        TaIcon.w-6.h-6.text-gray-700(
          v-if='_data?.[0]?.icon',
          :type='`outline/${item.icon}`'
        )
      .item__data.flex-col
        .name.text-gray-400 {{ item.name }}
        .num {{ item.num }}
    .line.h-18(:style='`order:${splitPostion}`')
</template>


<style lang="stylus" module>
colors = {
  red: #FBD5D5,
  green: #BCF0DA,
  blue: #C3DDFD,
  indigo:#CDDBFE,
  gray:#E5E7EB,
}
for color, bg in colors
  .{color}
    background-color bg
</style>

<style lang="stylus" scoped>

.flex-center
  @apply flex justify-center items-center;
.com-bpm-state-statistics
  border-radius 8px
  box-shadow 0 1px 3px rgba(0, 0, 0, 0.1),
              0 1px 2px -1px rgba(0, 0, 0, 0.1)
  *
    line-height 150%
  .statistics__title
    font-size 20px
    font-weight 600
  .statistics__board
    .line
      border-right 1px solid #e5e7eb
    .board__item
      .circle
        width 44px
        height @width
        @apply rounded-full;
      .item__data
        font-size 12px
        .name
          font-size @font-size
        .num
          font-size 3 * @font-size
          font-weight bold
          color #374151
</style>
