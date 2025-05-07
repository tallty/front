<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
const ComBpmWorkflowShowStatistics = defineComponent({
  name: 'ComBpmWorkflowShowStatistics',
  components: {},
  props: {
    hasName: { type: Boolean, default: false },
    store: { type: Object, default: () => {} },
    record: { type: Object, default: () => {} },
  },
  setup(props) {
    const dashboard = computed(() => [
      {
        name: '总发起数',
        icon: 'folder-open',
        num: props.record.rule_statistic?.all_count || 0,
        bg: '#C3DDFD',
      },
      {
        name: '进行中',
        icon: 'clipboard-list',
        num: props.record.rule_statistic?.processing_count || 0,
        bg: '#CDDBFE',
      },
      {
        name: '已完成',
        icon: 'clipboard-check',
        num: props.record.rule_statistic?.completed_count || 0,
        bg: '#BCF0DA',
      },
      {
        name: '已终止',
        icon: 'x',
        num: props.record.rule_statistic?.terminated_count || 0,
        bg: '#FBD5D5',
      },
      {
        name: '待提交',
        icon: 'clipboard',
        num: props.record.rule_statistic?.created_count || 0,
        bg: '#E5E7EB',
      },
    ]);
    return {
      ...toRefs(props),
      dashboard,
    };
  },
});
export default ComBpmWorkflowShowStatistics;
</script>

<template lang="pug">
.com-oper-task-statistics.w-full.p-6
  .statistics__title.text-gray-900.mb-4(v-if='hasName') 工单汇总
  .statistics__board.flex.justify-around
    .board__item.flex.items-center.px-3
      .cicle.rounded-full.w-11.h-11.flex.items-center.justify-center.mr-4(
        :style='`background:${dashboard[0].bg}`'
      )
        TaIcon.w-6.h-6.text-gray-700(:type='`outline/${dashboard[0].icon}`')
      .item__data.flex-col
        .name.text-gray-400 {{ dashboard[0].name }}
        .num {{ dashboard[0].num }}
    .line.h-18
    .board__item.flex.items-center.px-3(v-for='(item, index) in dashboard.slice(1)')
      .cicle.rounded-full.w-11.h-11.flex.items-center.justify-center.mr-4(
        :style='`background:${item.bg}`'
      )
        TaIcon.w-6.h-6.text-gray-700(:type='`outline/${item.icon}`')
      .item__data.flex-col
        .name.text-gray-400 {{ item.name }}
        .num {{ item.num }}
</template>

<style lang="stylus" scoped>
.com-oper-task-statistics
  background #fff
  border-radius 8px
  box-shadow 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)
  .statistics__title
    font-size 20px
    line-height 150%
    font-weight 600
  .statistics__board
    .line
      border-right 1px solid #e5e7eb
    .board__item
      .item__data
        .name
          font-size 12px
          line-height 150%
        .num
          font-size 36px
          font-weight bold
          color #374151
          line-height 150%
</style>
