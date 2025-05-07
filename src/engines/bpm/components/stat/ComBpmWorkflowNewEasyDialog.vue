<script lang='ts'>
import { ref, defineComponent, toRefs, computed, PropType } from 'vue';
import { Instance } from '../../bpm-core/types';
import dayjs from 'dayjs';
import ComTableCellBox from './ComTableCellBox.vue';
const ComBpmWorkflowNewEasyDialog = defineComponent({
  name: 'ComBpmWorkflowNewEasyDialog',
  components: { ComTableCellBox },
  props: {
    instance: { type: Object as PropType<Instance>, required: true }, // instance from index
    visible: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const localVisible = computed({
      get: () => props.visible,
      set: val => emit('update:visible', val),
    });
    const onClose = () => {
      emit('close')
      localVisible.value = false
    };
    const onPrint = () => {
      emit('print')
      localVisible.value = false
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

    const handleText = (state: string) => {
      switch (state) {
        case 'created':
          return '待提交'
        case 'processing':
          return '进行中'
        case 'completed':
          return '已完成'
        case 'failed':
          return '已退回'
        case 'rejected':
          return '已驳回'
        case 'canceled':
          return '已取消'
        case 'terminated':
          return '已终止'
        default:
          return '已送达'
      }
    }
    const handleColor = (state: string) => {
      switch (state) {
        case 'created':
          return 'yellow'
        case 'processing':
          return 'blue'
        case 'completed':
          return 'green'
        case 'failed':
          return 'red'
        case 'rejected':
          return 'red'
        case 'canceled':
          return 'red'
        case 'terminated':
          return 'red'
        default:
          return 'gray'
      }
    }
    const dealWorkflowTime = (text: string, record: any) => {
      if (Number(text) > 0) {
        return formatDuring(Number(text))
      } else {
        return formatDuring(Number(dayjs().diff(record.created_at, 'seconds')) || 0)
      }
    }

    const places = computed(() =>
      (props.instance as any).placeTokensFormatted
    )
    console.log(places.value)

    //不知道为什么dataIndex失效
    const columns = computed(() => [
      {
        title: '节点名称',
        dataIndex: ''
      },
      {
        title: '审批状态',
        dataIndex: 'token_state',
        align: 'center'
      },
      {
        title: '操作者',
        dataIndex: '',
        align: 'center'
      },
      {
        title: '审批描述',
        dataIndex: '',
      },
      {
        title: '审核时长',
        dataIndex: ''
      },
      {
        title: '审核时间',
        dataIndex: ''
      },
    ])
    return {
      ...toRefs(props),
      onClose,
      localVisible,
      onPrint,
      dayjs,
      handleColor,
      handleText,
      formatDuring,
      dealWorkflowTime,
      places,
      columns,
    };
  },
});
export default ComBpmWorkflowNewEasyDialog;
</script>

<template lang="pug">
TaNoPaddingModal.ta-no-padding-modal(
  v-model:visible='localVisible',
  :footer='null',
  :closable='false',
  :bodyStyle='{ overflow: "auto", height: "90vh" }',
  :modalContentStyle='{ "border-radius": "12px" }',
  :headerStyle='{ display: "none" }',
  width='90vw',
  @cancel='onClose'
)
  .instance__detail__container.p-6
    .instance__part.p-4.mb-6
      .instance__header.flex.justify-between.items-center.mb-4
        .left.gap-x-2.flex.items-center
          .icon.w-6.h-6.rounded-lg.flex.items-center.justify-center
            TaIcon.w-4.h-4.text-white(type='solid/speakerphone')
          .text-gray-900.text-base.font-semibold {{ instance.workflow_name }}
          .text-xs-900 {{ dayjs(instance.created_at).format('YYYY-MM-DD HH:mm') }}
        .right.gap-x-10px.flex.items-center
          .text-xs-900.whitespace-nowrap 编号：{{ instance.seq }}
          ComTableCellBox(:data='{text:handleText(instance.state)}',:color='handleColor(instance.state)')
      .instance__body
        .info.flex.gap-x-4.mb-4
          .text-sm-500 申请人：{{ instance.creator_name }}
          .text-sm-500 当前阶段：{{ instance.current_token?.name }}
          .text-sm-500 操作者：{{ instance.last_token.operator_name }}
        .workflow__data.flex.gap-x-4.mb-4(v-if='!!instance.ta_statistics')
          .places.flex.items-center.gap-x-2
            .text-sm-500 流程审核节点
            ComTableCellBox.com-table-cell-box(
              :data='{text:instance.ta_statistics?.节点统计?.流程审核节点}',
              color='blue'
            )
          .rejected__workflow.flex.items-center.gap-x-2
            .text-sm-500 回退流程数
            ComTableCellBox.com-table-cell-box(
              :data='{text:instance.ta_statistics?.节点统计?.流程回退数}',
              color='red'
            )
        .avg__time.flex.justify-between.items-center.mb-4
          .flex.items-center.gap-x-2
            .text-sm-500 流程平均审核时长
            .text-gray-900.text-sm {{ formatDuring(instance.ta_statistics?.节点统计?.平均审核时长) }}
          .flex.items-center.gap-x-2
            .text-sm-500 流程处理时长
            .text-gray-900.text-sm {{ dealWorkflowTime(instance.spent_time_in_second,instance) }}
        .line.h-1px.bg-gray-200.w-full.mb-4
        .summary.grid.grid-cols-2(v-if='!!instance.summary')
          .item.flex.gap-x-2(v-for='(i,k) in instance.summary')
            .text-sm-500 {{ k }}
            .text-gray-900.text-sm.leading-normal {{ i }}
    .place__part
      a-table(:dataSource='places',:columns='columns')
        template(#bodyCell='{text,index,record,column}')
          .text-sm(v-if='column.title === "节点名称"') {{ record.place.name }}
          ComTableCellBox(
            v-else-if='column.title === "审批状态"'
            :data='{text:handleText(record.token_state)}',
            :color='handleColor(record.token_state)'
          )
          ComTableCellBox(
            v-else-if='column.title === "操作者"',
            :data='{text:record.tokens?.[0]?.operator_name||""}',
            color='blue'
          )
          .text-sm(v-else-if='column.title === "审批描述"') {{ record.tokens?.[0]?.comment }}
          .text-sm(v-else-if='column.title === "审核时长"') {{ dealWorkflowTime(record.tokens?.[0]?.spent_time_in_second,record.tokens?.[0]) }}
          .text-sm(v-else-if='column.title === "审核时间"') {{ dayjs(record.tokens?.[0]?.updated_at).format('YYYY-MM-DD HH:mm') }}

</template>

<style lang="stylus" scoped>
.text-xs-900
  @apply text-gray-900 text-xs leading-normal;
.text-sm-500
  @apply text-gray-500 text-sm leading-normal;
.ta-no-padding-modal
  .instance__detail__container
    .instance__part
      border-radius var(--rounded-lg, 8px)
      border 1px solid var(--gray-200, #E5E7EB)
      background var(--gray-50, #F9FAFB)
      .left
        .icon
          background $primary-color
      .instance__body
        .workflow__data
          .com-table-cell-box
            width fit-content

</style>
