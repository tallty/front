<script lang='ts'>
import { ref, defineComponent, toRefs, computed, PropType, ComputedRef } from 'vue';
import { TaIndexViewTabInterface } from '../../../../../components/global/ta-component/TaIndexView/ta-index-view-core/types';
import { TaBreadcrumbInterface } from '../../../../../components/global/ta-component/TaBreadcrumb.vue';
import ComBpmStateStatistics from '../../stat/ComBpmStateStatistics.vue';
import { StatisticsData } from '../../stat/BpmStat';
import ComBpmStatShowTabs from '../../stat/ComBpmStatShowTabs.vue';
import ComBpmEchartContainer from '../../stat/ComBpmEchartContainer.vue';
import ComBpmEchartBar from '../../stat/ComBpmEchartBar.vue';
import ComBpmStatVelocityIndex from '../../stat/ComBpmStatVelocityIndex.vue';
import ComBpmStatFlowIndex from '../../stat/ComBpmStatFlowIndex.vue';
import ComBpmStatRuleIndex from '../../stat/ComBpmStatRuleIndex.vue';
const ComBpmStatWorkflowsShow = defineComponent({
  name: 'ComBpmStatWorkflowsShow',
  components: {
    ComBpmStateStatistics,
    ComBpmStatShowTabs,
    ComBpmEchartContainer,
    ComBpmEchartBar,
    ComBpmStatVelocityIndex,
    ComBpmStatFlowIndex,
    ComBpmStatRuleIndex,
  },
  props: {
    store: { type: Object, required: true },
    extendRoute: { type: String, default: '' },
    editable: { type: Boolean, default: true },
    breadcrumbs: { type: Array as PropType<TaBreadcrumbInterface[]>, default: () => [] },
    statistics: { type: Object, default: () => { } },
    start_at: { type: String, default: null },
    end_at: { type: String, default: null },
  },
  setup(props) {
    const tabs = computed<TaIndexViewTabInterface[]>(() => [
      // {
      //   key: 'time',
      //   label: '耗时',
      // },
      {
        key: 'velocity',
        label: '流速度',
      },
      {
        key: 'workflow',
        label: '流程',
      },
      {
        key: 'rule',
        label: '超时规则统计',
      },
    ]);
    const data: ComputedRef<StatisticsData[]> = computed(() => [
      {
        name: '总发起数',
        icon: 'folder-open',
        num: props.statistics.总发起数,
        bg: 'blue',
      },
      {
        name: '进行中',
        icon: 'clipboard-list',
        num: props.statistics.进行中,
        bg: 'indigo',
      },
      {
        name: '已完成',
        icon: 'clipboard-check',
        num: props.statistics.已完成,
        bg: 'green',
      },
      {
        name: '已终止',
        icon: 'x',
        num: props.statistics.已终止,
        bg: 'red',
      },
      {
        name: '待提交',
        icon: 'clipboard',
        num: props.statistics.待提交,
        bg: 'gray',
      },
    ])

    const config = computed(() => ({
      store: props.store,
      mode: 'table',
    }))

    const xData1 = ["1天", "2天", "3天", "4天", "5天", "6天", "7天及以上"]
    const xData2 = ["5月", "6月", "7月", "8月", "9月", "10月"]
    return {
      ...toRefs(props),
      tabs,
      config,
      record: props.store?.record,
      data,
      xData1,
      xData2,
    };
  },
});
export default ComBpmStatWorkflowsShow;
</script>

<template lang="pug">
view.com-bpm-stat-workflows-show.flex.flex-col.bg-gray-50.p-4
  ComBpmStateStatistics(:data='data',style='min-width:670px')
  ComBpmStatShowTabs.my-4.flex-grow(:tabs='tabs')
    //- template(#time_tab)
    //-   .echart__wrapper.flex.w-full.gap-x-4
    //-     ComBpmEchartContainer.echart.flex-grow.h-377px(title='流程时长统计')
    //-       template(#top-right)
    //-         .text-base.font-semibold.leading-normal.text-green-500.pl-2 12.5%↑
    //-       template(#explain)
    //-         .text-gray-500.text-base.mb-6 平均时长：3天19小时25分钟
    //-       ComBpmEchartBar.flex-grow(:xData='xData1')
    //-       template(#bottom)
    //-         .bottom__wrapper.w-full
    //-           .line.w-full.h-1px.bg-gray-200.mt-6
    //-           .flex.justify-center.pt-4.gap-x-4
    //-             .item.flex.items-center.gap-x-2
    //-               .cir__label.bg-orange-300
    //-               .text-sm.font-medium.text-gray-500 已终止
    //-             .item.flex.items-center.gap-x-2
    //-               .cir__label.bg-teal-400
    //-               .text-sm.font-medium.text-gray-500 已完成
    //-     ComBpmEchartContainer.echart.flew-grow.h-377px(title='近六个月时长')
    //-       template(#top-right)
    //-         .text-base.font-semibold.leading-normal.text-green-500.pl-2 12.5%↑
    //-       template(#explain)
    //-         .text-gray-500.text-base.mb-6 平均时长：3天19小时25分钟
    //-       ComBpmEchartBar.flex-grow(:xData='xData2')
    //-       template(#bottom)
    //-         .bottom__wrapper.w-full
    //-           .line.w-full.h-1px.bg-gray-200.mt-6
    //-           .flex.justify-center.pt-4.gap-x-4
    //-             .item.flex.items-center.gap-x-2
    //-               .cir__label.bg-orange-300
    //-               .text-sm.font-medium.text-gray-500 已终止
    //-             .item.flex.items-center.gap-x-2
    //-               .cir__label.bg-teal-400
    //-               .text-sm.font-medium.text-gray-500 已完成
    template(#velocity_tab)
      ComBpmStatVelocityIndex(:record='record',:start_at='start_at',:end_at='end_at')
    template(#workflow_tab)
      ComBpmStatFlowIndex(:record='record',:start_at='start_at',:end_at='end_at')
    template(#rule_tab)
      ComBpmStatRuleIndex(:store='store',:record='record',:start_at='start_at',:end_at='end_at')

</template>

<style lang="stylus" scoped>
.com-bpm-stat-workflows-show
  height 100%
  .echart__wrapper
    >.echart
      width calc(50% - 8px)
    .bottom__wrapper
      .item
        .cir__label
          @apply w-3 h-3 rounded-full;
</style>
