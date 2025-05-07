<script lang='ts'>
import { ref, defineComponent, toRefs, toRaw, computed } from 'vue';
import { onMounted } from '@vue/runtime-core';
import * as echarts from 'echarts';
const ComBpmEchartBar = defineComponent({
  name: 'ComBpmEchartBar',
  components: {},
  props: {
    xData: {
      type: Array,
      default: () => []
    },
    y1Data: {
      type: Array,
      default: () => [1, 3, 4, 5, 7, 9, 10]
    },
    y2Data: {
      type: Array,
      default: () => [2, 4, 6, 8, 10, 12, 14]
    }
  },
  setup(props) {
    const echart = ref<any>(null);
    const chartRef = ref<any>(null);
    window.addEventListener('resize', () => {
      toRaw(echart.value).clear();
      toRaw(echart.value).resize();
      toRaw(echart.value).setOption(options.value);
    });
    const options = computed(() => ({
      grid: {
        top: '8%',
        bottom: '24px',
        left: '0%',
        right: '0%',
      },
      xAxis: {
        type: 'category',
        show: true,
        data: props.xData,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 0,
            opacity: 0,
          },
        },
        axisLabel: {
          color: '#9CA3AF',
        },
      },
      yAxis: {
        show: false,
        type: 'value',

        splitLine: {
          show: false,
        },
      },

      series: [
        {
          data: props.y1Data,
          type: 'bar',
          itemStyle: {
            color: '#16BDCA',
            borderRadius: [10, 10, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#111928',
          },
        },
        {
          data: props.y2Data,
          type: 'bar',
          itemStyle: {
            color: '#FDBA8C',
            borderRadius: [10, 10, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#111928',
          },
        },
      ],
    }));
    const createChart = () => {
      echart.value = echarts.init(chartRef.value);
      toRaw(echart.value).setOption(options.value);
    };
    onMounted(() => createChart());
    return {
      ...toRefs(props),
      options,
      chartRef,
    };
  },
});
export default ComBpmEchartBar;
</script>

<template lang="pug">
.com-bpm-echart-bar.w-full.h-full
  .echart-bar-main.w-full.h-full
    .echart-bar.w-full.h-full(ref='chartRef')
</template>

<style lang="stylus" scoped>
.com-bpm-echart-bar
  pointer-events auto
  .echart-bar-main
    pointer-events auto
    .echart-bar
      pointer-events auto
</style>
