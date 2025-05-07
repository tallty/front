<script lang='ts'>
import { ref, defineComponent, toRefs, computed } from 'vue';
import { VStore } from '../../../../lib/vails/store/index';
import { BpmAdminInstances } from '../../bpm-core/apis/admin/instance.api';
import { InstanceModel } from '../../bpm-core/apis/user/instance.api';
import dayjs from 'dayjs';
import ComTableCellBox from './ComTableCellBox.vue';
import { VObject } from '../../../../lib/vails/model/index';
import ComBpmInstanceDetailEasyDialogFromIndex from '../ComBpmInstanceDetailEasyDialogFromIndex.vue';
import ComBpmWorkflowNewEasyDialog from './ComBpmWorkflowNewEasyDialog.vue';

const ComBpmStatFlowIndex = defineComponent({
  name: 'ComBpmStatFlowIndex',
  components: { ComTableCellBox, ComBpmInstanceDetailEasyDialogFromIndex, ComBpmWorkflowNewEasyDialog },
  props: {
    record: { type: Object, required: true },
    start_at: { type: String, default: null },
    end_at: { type: String, default: null },
  },
  setup(props) {
    const instanceStore = new VStore(new BpmAdminInstances({
      parents: [{ type: 'workflows', id: props.record.id }]
    }), InstanceModel)
    const start_at = ref(dayjs(props.start_at))
    const end_at = ref(dayjs(props.end_at))
    const summary = ref<any>({});
    const config = computed(() => ({
      store: instanceStore,
      mode: 'table',
      params: { q: timeQuery.value },
      statCondition: {
        resource: {
          refs: [
            {
              relations: ['tokens'],
              item: {
                key: '节点统计',
                scopes: { between_times: [start_at.value.format('YYYY-MM-DD 00:00:00 Z'), end_at.value.format('YYYY-MM-DD 00:00:00 Z')] },
                caculator: {
                  type: 'caculation',
                  caculations: [
                    { name: '流程审核节点', scopes: "handleable", filter: { state_eq: 'completed' }, method: 'count', attr: 'place_id', distinct: true },
                    {
                      name: '流程回退数', filter: { state_in: ["failed", "rejected"] }, method: 'count'
                    },
                    { name: '平均审核时长', scopes: "handleable", filter: { state_eq: 'completed' }, method: 'average', attr: 'spent_time_in_second', distinct: true },
                  ],
                },
              },
            },
          ],
        }
      },
      table: {
        scroll: { y: 'auto' },
        columns: summaryColumns.value.length > 0 ? [
          {
            title: '序号',
            dataIndex: 'seq',
            width: 80,
            align: 'center',
          },
          {
            title: '名称',
            dataIndex: 'workflow_name',
            align: 'center'
          },
          {
            title: '流程发起人',
            dataIndex: 'creator_name',
            width: 80,
          },
          {
            title: '流程状态',
            dataIndex: 'state',
            width: 120,
            align: 'center'
          },
          {
            title: '当前处理人',
            dataIndex: 'current_token.operator_name',
            width: 120,
          },
          ...summaryColumns.value,

          {
            title: '流程审核节点',
            dataIndex: 'ta_statistics.节点统计.流程审核节点',
            width: 120,
            align: 'center'
          },
          {
            title: '回退数',
            dataIndex: 'ta_statistics.节点统计.流程回退数',
            width: 120,
            align: 'center'
          },
          {
            title: '平均审核时长',
            dataIndex: 'ta_statistics.节点统计.平均审核时长',
            render: (text: string, index: number, record: any, column: any) => {
              return formatDuring(Number(text) || 0)
            },
            align: 'center'
          },
          {
            title: '流程处理时长',
            dataIndex: 'spent_time_in_second',
          },
        ] : null
      },
      searcherSimpleOptions: [
        { label: '编号', key: 'seq', type: 'string' },
        // { label: '部门', key: 'creator_orgs_name', type: 'string' },
        { label: '发起人姓名', key: 'creator_name', type: 'string' },
        // { label: '发起人账号', key: 'creator_account', type: 'string' },
        { label: '其他信息', key: 'summary', type: 'string' },
        // { label: '节点状态', key: 'tokens_state', type: 'string' },
      ],
    }))
    const dealWorkflowTime = (text: string, record: any) => {
      if (Number(text) > 0) {
        return formatDuring(Number(text))
      } else {
        return formatDuring(Number(dayjs().diff(record.created_at, 'seconds')) || 0)
      }
    }
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

    const renderHandleFunction = (column: VObject) => {
      if (column.title === "流程状态") {
        return (text: string) => {
          switch (text) {
            case 'completed':
              return '已完成'
            case 'rejected':
              return '已驳回'
            default:
              return '进行中'
          }
        }
      }

      return void 0
    }

    const renderColor = (column: VObject, text: string) => {
      if (column.title === "流程审核节点") {
        return 'indigo'
      } else if (column.title === "回退数") {
        return 'red'
      } else {
        switch (text) {
          case 'completed':
            return 'green'
          case 'rejected':
            return 'red'
          default:
            return 'blue'
        }
      }
    }
    const summaryColumns = computed(() => {
      return Object.keys(summary.value).map((key) => {
        return {
          title: key,
          dataIndex: `summary.${key}`,
        }
      })
    })
    const visibleDialog = ref(false);
    const showDialog = ref(false);
    const instance = ref<any>({})
    const onIndex = (res: any, params: VObject, fn: any) => {
      summary.value = res.data.records?.[0]?.summary
    }
    const onShow = (record: any) => {
      instance.value = record
      visibleDialog.value = true
    }
    const handleClick = (record: VObject) => {
      instanceStore.find(record.id).then(() => {
        instance.value = instanceStore.record.value
      }).then(() => {
        showDialog.value = true
      })

    }
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
    return {
      ...toRefs(props),
      instanceStore,
      config,
      renderHandleFunction,
      renderColor,
      onIndex,
      visibleDialog,
      instance,
      onShow,
      dealWorkflowTime,
      handleClick,
      showDialog,
      start_at,
      end_at,
      onDateChange,
    };
  },
});
export default ComBpmStatFlowIndex;
</script>

<template lang="pug">
.com-bpm-stat-flow-index.h-full
  TaIndexView.ta-index-view(:config='config',@onIndex='onIndex',@onShow='onShow')
    template(#bodyCell='{text,record,index,column}')
      ComTableCellBox(
        v-if='["流程审核节点","回退数","流程状态"].includes(column.title)',
        :data='{text}',
        :handle='renderHandleFunction(column)',
        :color='renderColor(column,text)',
      )
      .text-sm.cursor-pointer(v-else-if='column.title=="流程处理时长"',@click.stop='handleClick(record)') {{ dealWorkflowTime(text, record) }}
    template(#right-actions)
      a-range-picker.date-item(@change='onDateChange', format='YYYY-MM-DD',:value='[start_at,end_at]')
  ComBpmInstanceDetailEasyDialogFromIndex(
    v-if='visibleDialog',
    v-model:visible='visibleDialog',
    :instance='instance',
    @close='onDialogClose'
  )
  ComBpmWorkflowNewEasyDialog(v-if='showDialog',v-model:visible='showDialog',:instance='instance')

</template>

<style lang="stylus" scoped>
.com-bpm-stat-flow-index
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
