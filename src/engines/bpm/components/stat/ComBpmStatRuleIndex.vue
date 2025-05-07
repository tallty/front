<script lang='ts'>
import { ref, defineComponent, toRefs, computed } from 'vue';
import { BpmAdminRulesApi } from '../../bpm-core/apis/bpm/admin/rules.api';
import { VStore } from '../../../../lib/vails/store/index';
import ComTableCellBox from './ComTableCellBox.vue';
import { VObject } from '../../../../lib/vails/model/index';
import { BpmAdminInstances } from '../../bpm-core/apis/admin/instance.api';
import { InstanceModel } from '../../bpm-core/apis/user/instance.api';
import { BpmAdminDelayInstancesApi } from '../../bpm-core/apis/bpm/admin/delay_instances.api';
import { BpmAdminRelateInstancesApi } from '../../bpm-core/apis/bpm/admin/relate_instances.api';
import ComBpmInstanceCard from '@/engines/bpm/components/ComBpmInstanceCard.vue';
import { merge } from 'lodash';
import dayjs from 'dayjs';

const ComBpmStatRuleIndex = defineComponent({
  name: 'ComBpmStatRuleIndex',
  components: { ComTableCellBox, ComBpmInstanceCard },
  props: {
    record: { type: Object, default: () => { } },
    start_at: { type: String, default: null },
    end_at: { type: String, default: null },
  },
  setup(props) {
    const ruleStore = new VStore(new BpmAdminRulesApi({
      parents: [{ type: 'workflows', id: props.record.id }]
    }))
    const start_at = ref(dayjs(props.start_at))
    const end_at = ref(dayjs(props.end_at))
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
    const config = computed(() => ({
      store: ruleStore,
      mode: 'table',
      params: { q: timeQuery.value },
      statCondition: {
        resource: {
          refs: [
            {
              relations: ['relate_instances'],
              item: {
                key: '相关流程',
                scopes: { between_times: [start_at.value.format('YYYY-MM-DD 00:00:00 Z'), end_at.value.format('YYYY-MM-DD 00:00:00 Z')] },
                caculator: {
                  type: 'caculation',
                  caculations: [
                    { name: '总流程数', method: 'count' },
                    { name: '待办流程数', filter: { state_eq: 'processing' }, method: 'count' },
                  ],
                },
              },
            },
            {
              relations: ['delay_instances'],
              item: {
                key: '超时流程',
                scopes: { between_times: [start_at.value.format('YYYY-MM-DD 00:00:00 Z'), end_at.value.format('YYYY-MM-DD 00:00:00 Z')] },
                caculator: {
                  type: 'caculation',
                  caculations: [
                    { name: '超时流程数', method: 'count' },
                  ],
                },
              },
            },
          ],
        }
      },
      table: {
        scroll: { y: 'auto' },
        columns: [{
          title: '序号',
          dataIndex: 'id',
          width: 80,
          align: 'center',
        },
        {
          title: '规则名称',
          dataIndex: 'name',
          width: 120,
          align: 'center'
        },
        {
          title: '规则时间',
          dataIndex: 'updated_at',
          width: 120,
          align: 'center'
        },
        {
          title: '规则要求时长',
          dataIndex: 'time_in_second',
          width: 120,
          align: 'center',
          render: (text: string, index: number, record: any, column: any) => {
            return formatDuring(Number(text) || 0)
          },
        },
        {
          title: '待办流程数',
          dataIndex: 'ta_statistics.相关流程.待办流程数',
          width: 120,
          align: 'center'
        },
        {
          title: '总流程数',
          dataIndex: 'ta_statistics.相关流程.总流程数',
          width: 120,
          align: 'center'
        },
        {
          title: '超时流程数',
          dataIndex: 'ta_statistics.超时流程.超时流程数',
          width: 120,
          align: 'center'
        },
        ]
      },
      searcherSimpleOptions: [
        { label: '序号', key: 'seq', type: 'string' },
        { label: '规则名称', key: 'name', type: 'string' },
      ],
    }))
    const renderColor = (column: VObject, text: string) => {
      if (column.title === "待办流程数") {
        return 'blue'
      } else if (column.title === "总流程数") {
        return 'indigo'
      } else if (column.title === "超时流程数") {
        return 'red'
      }
    }
    const ruleId = ref<any>(null)
    const isDelay = ref(false)
    const delayStore = computed(() => new VStore(new (BpmAdminDelayInstancesApi as any)({
      parents: [{ type: 'workflows', id: props.record.id }, { type: 'rules', id: ruleId.value }]
    }), InstanceModel))
    const relateStore = computed(() => new VStore(new (BpmAdminRelateInstancesApi as any)({
      parents: [{ type: 'workflows', id: props.record.id }, { type: 'rules', id: ruleId.value }]
    }), InstanceModel))
    const activeStore = computed(() => {
      return isDelay.value ? delayStore.value : relateStore.value
    })
    const total_count = computed(() => {
      return activeStore.value.totalCount.value || 0;
    });
    const temporaryQuery = ref<any>({})
    const timeQuery = ref<any>({
      created_at_gteq: props.start_at,
      created_at_lteq: props.end_at,
    })
    const onDateChange = (range: any) => {
      const [start, end] = range || [null, null];
      if (start && end) {
        start_at.value = start;
        end_at.value = end;
        timeQuery.value.created_at_gteq = start.format('YYYY-MM-DD 00:00:00 Z');
        timeQuery.value.created_at_lteq = end.format('YYYY-MM-DD 00:00:00 Z');
      } else {
        timeQuery.value.created_at_gteq = null;
        timeQuery.value.created_at_lteq = null;
      }
    };
    const instanceConfig = computed(() => ({
      recordName: `已发起流程 ${total_count.value} 条`,
      store: activeStore.value,
      searcherSimpleOptions: [
        { label: '编号', key: 'seq', type: 'string' },
        { label: '部门', key: 'creator_orgs_name', type: 'string' },
        { label: '发起人姓名', key: 'creator_name', type: 'string' },
        { label: '发起人账号', key: 'creator_account', type: 'string' },
        { label: '其他信息', key: 'summary', type: 'string' },
        { label: '节点状态', key: 'tokens_state', type: 'string' },
      ],
      list: {
        scroll: { y: '70vh' },
      },
      actions: [
        //  { key: 'create', enabled: true },
        //  { key: 'update', enabled: true },
        //  { key: 'delete', enabled: true },
        //  { key: 'import', enabled: true },
        { key: 'export', enabled: true },
      ],
    }));
    const visible = ref(false)
    const handleClick = (record: VObject, column: VObject) => {
      ruleId.value = record.id
      if (column.title === "超时流程数") {
        isDelay.value = true
      } else {
        isDelay.value = false
        column.title === "待办流程数" ?
          temporaryQuery.value = merge({}, timeQuery.value, { state_eq: 'processing' }) :
          temporaryQuery.value = merge({}, timeQuery.value)

      }

      visible.value = true
    }
    return {
      ...toRefs(props),
      config,
      renderColor,
      handleClick,
      instanceConfig,
      visible,
      temporaryQuery,
      onDateChange,
      start_at,
      end_at,
    };
  },
});
export default ComBpmStatRuleIndex;
</script>

<template lang="pug">
.com-bpm-stat-rule-index.h-full
  TaIndexView.ta-index-view(:config='config',@onIndex='onIndex')
    template(#bodyCell='{text,record,index,column}')
      ComTableCellBox.cursor-pointer(
        v-if='["待办流程数","总流程数","超时流程数"].includes(column.title)',
        :data='{text}',
        :color='renderColor(column,text)',
        @click.stop='handleClick(record,column)'
      )
    template(#right-actions)
      a-range-picker.date-item(@change='onDateChange', format='YYYY-MM-DD',:value='[start_at,end_at]')
  TaNoPaddingDrawer.px-4(
    v-model:visible='visible',
    v-if='visible',
    title='工作流',
    width='1100px',
  )
    TaIndexView.ta-index-view2.p-4(
      :config='instanceConfig',
      :temporaryQuery='temporaryQuery',
    )
      template(#card='{ record }')
        ComBpmInstanceCard(:record='record')
</template>

<style lang="stylus" scoped>
.com-bpm-stat-rule-index
  .ta-index-view
    :deep(thead)
      tr
        background #f3f4f6
    :deep(.ta-index-view-header)
      background transparent
      height 0 !important
    :deep(.ta-index-view-actions)
      transform translateY(-40px)
    :deep(.ant-table-wrapper)
      padding 0 !important
</style>
