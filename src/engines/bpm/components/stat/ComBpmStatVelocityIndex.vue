<script lang='ts'>
import { ref, defineComponent, toRefs, computed } from 'vue';
import { VStore } from '../../../../lib/vails/store/index';
import { BpmAdminPlacesApi } from '../../bpm-core/apis/bpm/admin/places.api';
import { VObject } from '../../../../lib/vails/model/index';
import ComTableCellBox from './ComTableCellBox.vue';
import ComTableCellProgress from './ComTableCellProgress.vue';
import { BpmAdminInstances } from '../../bpm-core/apis/admin/instance.api';
import { InstanceModel } from '../../bpm-core/apis/user/instance.api';
import ComBpmInstanceCard from '@/engines/bpm/components/ComBpmInstanceCard.vue';
import dayjs from 'dayjs';
import { merge } from 'lodash';
const ComBpmStatVelocityIndex = defineComponent({
  name: 'ComBpmStatVelocityIndex',
  components: { ComTableCellBox, ComTableCellProgress, ComBpmInstanceCard },
  props: {
    record: { type: Object, required: true },
    start_at: { type: String, default: null },
    end_at: { type: String, default: null },
  },
  setup(props) {
    const start_at = ref(dayjs(props.start_at))
    const end_at = ref(dayjs(props.end_at))
    const placesStore = new VStore(new BpmAdminPlacesApi({
      parents: [{ type: 'workflows', id: props.record.id }]
    }));
    const instanceStore = computed(() => new VStore(
      new BpmAdminInstances({
        parents: [{
          type: 'workflows', id: props.record.id,
        }],
      }),
      InstanceModel,
    ));
    const config = computed(() => ({
      store: placesStore,
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
                    { name: '处理总数', filter: { state_in: ["completed", "failed", "rejected"] }, method: 'count' },
                    { name: '待处理数量', filter: { state_eq: 'processing' }, method: 'count' },
                    { name: '回退数量', filter: { state_in: ["been_failed", "been_rejected"] }, method: 'count' },
                    { name: '平均审核时长', scopes: "handleable", filter: { instance_state_eq: 'completed' }, method: 'average', attr: 'spent_time_in_second', distinct: true },
                  ],
                },
              },
            },
          ],
        }
      },
      table: {
        scroll: { y: 'auto' },
        columns: [
          {
            title: '监控点',
            dataIndex: 'name',
            align: 'center',
          },
          {
            title: '平均审核时长',
            dataIndex: 'ta_statistics.节点统计.平均审核时长',
            align: 'center',
            render: (text: string) => {
              return Number(text) > 0 ? formatDuring(Number(text)) : 0
            }

          },
          {
            title: '处理总数',
            dataIndex: 'ta_statistics.节点统计.处理总数',
            align: 'center'
          },
          {
            title: '回退数量',
            dataIndex: 'ta_statistics.节点统计.回退数量',
            align: 'center'
          },
          {
            title: '待处理数量',
            dataIndex: 'ta_statistics.节点统计.待处理数量',
            align: 'center'
          },
          // {
          //   title: '要求处理时间',
          //   dataIndex: 'name'
          // },

          {
            title: '回退率',
            dataIndex: 'ta_statistics.节点统计.回退数量/ta_statistics.节点统计.处理总数',

          },
          // {
          //   title: '时长达标率',
          //   dataIndex: 'name'
          // },
        ]
      },
      searcherSimpleOptions: [
        { label: '监控点', key: 'name', type: 'string' },
      ],
    }))

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

    const renderColor = (column: any) => {
      if (column.title === "处理总数") {
        return 'blue'
      } else if (column.title === "回退总数") {
        return 'red'
      } else {
        return 'yellow'
      }
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
    const query = ref<any>({})
    const temporaryQuery = computed(() => {
      return merge({}, query.value, timeQuery.value)
    })
    const total_count = computed(() => {
      return instanceStore.value.totalCount.value || 0;
    });
    const instanceConfig = computed(() => ({
      recordName: `已发起流程 ${total_count.value} 条`,
      store: instanceStore.value,
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
    const visible = ref(false);
    const handleClick = (record: VObject, column: VObject) => {

      if (column.title === "待处理数量") {
        query.value = {
          tokens_state_eq: "processing",
          tokens_place_id_eq: record.id
        }
      } else if (column.title === "回退数量") {
        query.value = {
          tokens_state_in: ["failed", "rejected"],
          tokens_place_id_eq: record.id
        }
      } else {
        query.value = {
          tokens_state_in: ["failed", "rejected", "completed"],
          tokens_place_id_eq: record.id
        }
      }
      visible.value = true
    }
    return {
      ...toRefs(props),
      config,
      renderColor,
      handleClick,
      instanceConfig,
      temporaryQuery,
      visible,
      onDateChange,
      start_at,
      end_at,
    };
  },
});
export default ComBpmStatVelocityIndex;
</script>

<template lang="pug">
.com-bpm-stat-velocity-index.h-full
  TaIndexView.ta-index-view(:config='config',@onIndex='onIndex',@onShow='onShow')
    template(#bodyCell='{text,index,record,column}')
      ComTableCellBox(
        v-if='["处理总数","回退数量","待处理数量"].includes(column.title)',
        :data='{text}',
        :color='renderColor(column)',
        @click.stop='handleClick(record,column)'
      )
      ComTableCellProgress(v-else-if='column.title === "回退率"',:data='{text}')
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
.com-bpm-stat-velocity-index
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
