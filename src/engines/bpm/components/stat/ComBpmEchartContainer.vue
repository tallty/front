<script lang='ts'>
import { ref, defineComponent, toRefs } from 'vue';

const ComBpmEchartContainer = defineComponent({
  name: 'ComBpmEchartContainer',
  components: {},
  props: {
    title: { type: String, default: '年龄分布' },
    iTitle: { type: String, default: 'tip:' },
    hasTip: { type: Boolean, default: false },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});
export default ComBpmEchartContainer;
</script>

<template lang="pug">
.com-bpm-echart-container.p-5.bg-white.flex.flex-col
  .hr__flex.flex.mb-2.items-center
    .container__title.text-gray-900.font-bold.relative {{title}}
      .absolute.-right-5(v-if='hasTip',style='top:2px;')
        a-tooltip(:title='iTitle')
          TaIcon.text-gray-400(type='solid/information-circle',style='width:18px;height:18px')
    slot(name='top-right')
  slot(name='explain')
  .echart.w-full
    slot
  slot(name='bottom')
</template>

<style lang="stylus" scoped>
.com-bpm-echart-container
  box-shadow 0 1px 3px rgba(0, 0, 0, 0.1),
              0 1px 2px -1px rgba(0, 0, 0, 0.1)
  border-radius 8px
  .hr__flex
    .container__title
      font-size 30px
      line-height 100%
  .echart
    height calc(100% - 40px)
</style>
