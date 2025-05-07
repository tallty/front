<script lang="ts">
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { BpmRuleStatInstancesApi } from '@/engines/bpm/apis/bpm/rule_stat/instances.api';
import ComBpmWorkflowShowStatistics from '@/engines/bpm/components/bpm/workflows/ComBpmWorkflowShowStatistics.vue';
import { VStore } from '@/lib/vails';
import { VObject } from '@/lib/vails/model';
import dayjs from 'dayjs';
import { computed, defineComponent, ref, toRefs } from 'vue';
import ComBpmInstanceDetailDialog from '../../ComBpmInstanceDetailDialog.vue';
import ComBpmRulesShow from './ComBpmRulesShow.vue';
const ComBpmRulesIndex = defineComponent({
  name: 'ComBpmRulesIndex',
  components: {
    ComBpmRulesShow,
    ComBpmWorkflowShowStatistics,
    ComBpmInstanceDetailDialog,
  },
  props: {
    store: { type: Object, required: true },
    workflow: { type: Object, required: true },
    id: { type: Number, default: 0 },
  },
  setup(props, { emit }) {
    const instanceId = ref(0);
    const visibleDialog = ref(false);
    const config = computed(() => ({
      recordName: '',
      store: props.store,

      mode: 'table',

      actions: [
        //  { key: 'create', enabled: true },
        //  { key: 'update', enabled: true },
        //  { key: 'delete', enabled: true },
        //  { key: 'import', enabled: true },
        { key: 'export', enabled: true },
      ],
      table: {
        scroll: { y: 'auto' },
        columns: [
          { title: '监控点', dataIndex: 'name' },
          { title: '要求多少时间', dataIndex: 'time_in_second' },
          { title: '平均处理时间', dataIndex: 'rule_statistic.avg_spent_time_in_second' },
          { title: '工作流节点数量', dataIndex: 'rule_statistic.places_count' },
          { title: '逾期数量', dataIndex: 'rule_statistic.instance_celay_count' },
          { title: '逾期占比', dataIndex: '' },
        ],
      },
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
      searcherSimpleOptions: [{ key: 'seq', label: '编号', type: 'string' }],
    }));

    const statistics = ref({
      key1: 0,
      key2: 0,
    });
    const instanceStore = new VStore(
      new BpmRuleStatInstancesApi({
        params: {
          q: {
            workflow_id_eq: props.id,
          },
        },
      }),
    );
    const tabs = computed<TaIndexViewTabInterface[]>(() => [
      {
        key: 'key1',
        label: '流速',
      },
      {
        key: 'key2',
        label: '未完结统计',
        store: instanceStore,
        mode: 'table',
        table: {
          scroll: { y: 'auto' },
          columns: [
            { title: '序号', dataIndex: 'seq' },
            // { title: '名称', dataIndex: 'workflow.name' },
            { title: '当前审批节点', dataIndex: 'processing_tokens[0].name' },
            { title: '当前审批人', dataIndex: 'processing_tokens[0].operator_name' },
            { title: '列表显示项', dataIndex: 'summaryAry' },
            { title: '当前节点耗时', dataIndex: '' },
            { title: '流程发起时间', dataIndex: 'created_at' },
            { title: '流程总耗时', dataIndex: '' },
          ],
        },
      },
    ]);
    const activeTabKey = ref('key1');
    const onShow = (record: any) => {
      if (activeTabKey.value === 'key1') return;
      instanceId.value = record.id;
      visibleDialog.value = true;
    };
    const changeTab = (tabKey: any) => {
      activeTabKey.value = tabKey.key;
    };
    const onIndex = (data: VObject) => {
      statistics.value = data.statistics;
    };
    const formatDuring = (millisecond: number) => {
      const days = millisecond / (60 * 60 * 24);
      const hours = (millisecond % (60 * 60 * 24)) / (60 * 60);
      const minutes = (millisecond % (60 * 60)) / 60;
      const seconds = millisecond % 60;
      let totalTime = '';
      if (days >= 1) {
        totalTime += Math.floor(days) + '天';
      }
      if (hours >= 1) {
        totalTime += Math.floor(hours) + '小时';
      }
      if (minutes >= 1 && days < 1) {
        totalTime += Math.floor(minutes) + '分';
      }
      if (seconds >= 1 && days < 1 && hours < 1) {
        totalTime += Math.floor(seconds) + '秒';
      }
      if (totalTime === '') {
        totalTime = '0';
      }
      return totalTime;
    };
    const summaryAry = (summaryObj: VObject) => {
      return Object.entries(summaryObj)
        .map(([key, value]) => `${key}：${value}`)
        .join(',');
    };
    return {
      ...toRefs(props),
      config,
      tabs,
      onIndex,
      dayjs,
      instanceId,
      visibleDialog,
      formatDuring,
      onShow,
      changeTab,
      summaryAry,
    };
  },
});

export default ComBpmRulesIndex;
</script>

<template lang="pug">
.com-bpm-rule-stat-rules-index.flex.flex-col
  ComBpmWorkflowShowStatistics.mb-2(:store='store', :record='workflow')
  TaIndexView.h-0.flex-grow(
    :config='config',
    @onIndex='onIndex',
    showHeader=false,
    :tabs='tabs',
    @onShow='onShow',
    @tabChange='changeTab'
  )
    template(#bodyCell='{ text, record, index, column }')
      div(v-if='column.title === "要求多少时间"')
        ComBpmTimeInSecondView(:value='text')
      div(v-else-if='column.title === "平均处理时间"')
        ComBpmTimeInSecondView(:value='text')
      div(v-else-if='column.title === "列表显示项"')
        span {{ summaryAry(record.summary) }}
      .pink.bg-red-100(v-else-if='column.title === "逾期数量"')
        .text-red-800.text-xs.leading-normal {{ text }}
      div(v-else-if='column.title === "当前节点耗时"')
        //- ComBpmTimeInSecondView(:value='Number(dayjs().diff(record.processing_tokens[0].created_at,"second"))')
        .text-sm.leading-normal {{ formatDuring(dayjs().diff(record.processing_tokens[0].created_at, 'second')) }}
      div(v-else-if='column.title === "流程总耗时"')
        .text-sm.leading-normal {{ formatDuring(dayjs().diff(record.created_at, 'second')) }}
      .flex.justify-center.pr-2(v-else-if='column.title === "逾期占比"')
        a-progress.progress(
          :percent='(Number(record.rule_statistic.delay_count / record.rule_statistic.all_count || 0) * 100).toFixed(2)',
          size='small',
          strokeColor='#FF8A4C'
        )
  ComBpmInstanceDetailDialog(
    v-if='visibleDialog',
    v-model:visible='visibleDialog',
    :instanceId='instanceId',
    @close='onDialogClose'
  )
    //- template(#card='{ record }')
    //- template(#table)
    //-    a-table-column(:autoHeight='true' title='名称' dataIndex='record')
    //- template(#detail='{ record, onClose }')
    //-   ComBpmRulesShow(
    //-     v-if='record.id'
    //-     :store='store'
    //-     :extendRoute='`/bpm/rule_stat/rules/${record.id}`'
    //-     :editable='editable'
    //-     @afterDelete='onClose'
    //-     @afterExtend='onClose'
    //-   )
</template>

<style lang="stylus" scoped>
.com-bpm-rule-stat-rules-index
  width 100%
  height 100%
  >>>.pink
    padding 2px 10px
    width fit-content
    border-radius 6px
  >>>.progress
    display flex
    flex-direction column-reverse
    align-items flex-end
    .ant-progress-outer
      margin-right 0
      padding-right 0
</style>
