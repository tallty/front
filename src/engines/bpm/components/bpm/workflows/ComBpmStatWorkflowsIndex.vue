<script lang='ts'>
import { ref, defineComponent, toRefs, computed, h, Ref } from 'vue';
import ComTableCellBox from '../../stat/ComTableCellBox.vue';
import ComTableCellProgress from '../../stat/ComTableCellProgress.vue';
import { VObject } from '../../../../../lib/vails/model/index';
import { VStore } from '../../../../../lib/vails/store/index';
import { BpmAdminInstances } from '../../../bpm-core/apis/admin/instance.api';
import { InstanceModel } from '../../../bpm-core/apis/user/instance.api';
import ComBpmInstanceCard from '@/engines/bpm/components/ComBpmInstanceCard.vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
const ComBpmStatWorkflowsIndex = defineComponent({
  name: 'ComBpmStatWorkflowsIndex',
  components: { ComTableCellBox, ComTableCellProgress, ComBpmInstanceCard },
  props: {
    store: { type: Object, default: () => {} },
  },
  setup(props) {
    const { t } = useI18n();

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
      recordName: t('bpm.stat.workflow.recordName'),
      store: props.store,
      mode: 'table',
      actions: [{ key: 'export', enabled: true }],
      // params: {
      //   q: timeQuery.value
      // },
      statCondition: {
        resource: {
          refs: [
            {
              relations: ['instances'],
              item: {
                key: '流程统计',
                scopes: {
                  between_times: [
                    start_at.value.format('YYYY-MM-DD 00:00:00 Z'),
                    end_at.value.format('YYYY-MM-DD 00:00:00 Z'),
                  ],
                },
                caculator: {
                  type: 'caculation',
                  caculations: [
                    { name: '发起数量', method: 'count' },
                    { name: '待提交', filter: { state_eq: 'created' }, method: 'count' },
                    { name: '进行中', filter: { state_eq: 'processing' }, method: 'count' },
                    { name: '已完成', filter: { state_eq: 'completed' }, method: 'count' },
                    { name: '已终止', filter: { state_eq: 'terminated' }, method: 'count' },
                    {
                      name: '回退流程数量',
                      filter: { tokens_state_in: ['rejected', 'failed'] },
                      method: 'count',
                      distinct: true,
                    },
                    {
                      name: '完成流程平均时长',
                      filter: { state_eq: 'completed' },
                      method: 'average',
                      attr: 'spent_time_in_second',
                    },
                  ],
                },
              },
            },
            {
              relations: ['tokens'],
              item: {
                key: '节点统计',
                scopes: {
                  between_times: [
                    start_at.value.format('YYYY-MM-DD 00:00:00 Z'),
                    end_at.value.format('YYYY-MM-DD 00:00:00 Z'),
                  ],
                },
                caculator: {
                  type: 'caculation',
                  caculations: [
                    {
                      name: '回退数量',
                      filter: { state_in: ['failed', 'rejected'] },
                      method: 'count',
                    },
                    {
                      name: '完结审核步骤',
                      scopes: 'handleable',
                      filter: { instance_state_eq: 'completed' },
                      method: 'count',
                      attr: 'place_id',
                      distinct: true,
                    },
                    {
                      name: '平均审核时长',
                      scopes: 'handleable',
                      filter: { instance_state_eq: 'completed' },
                      method: 'average',
                      attr: 'spent_time_in_second',
                      distinct: true,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      table: {
        scroll: { y: 'auto', x: '1300px' },
        columns: [
          { title: '流程名称', dataIndex: 'name', fixed: 'left', width: 140, align: 'center' },
          {
            title: '发起数量',
            dataIndex: 'ta_statistics.流程统计.发起数量',
            fixed: 'left',
            width: 80,
            align: 'center',
          },
          {
            title: '待提交',
            dataIndex: 'ta_statistics.流程统计.待提交',
            width: 100,
            align: 'center',
          },
          {
            title: '进行中',
            dataIndex: 'ta_statistics.流程统计.进行中',
            width: 100,
            align: 'center',
          },
          {
            title: '已完成',
            dataIndex: 'ta_statistics.流程统计.已完成',
            width: 100,
            align: 'center',
          },
          {
            title: '已终止',
            dataIndex: 'ta_statistics.流程统计.已终止',
            width: 100,
            align: 'center',
          },
          {
            title: '完结流程平均时长',
            dataIndex: 'ta_statistics.流程统计.完成流程平均时长',
            width: 120,
            align: 'center',
            render: (text: string, index: number, record: any, column: any) => {
              return formatDuring(Number(text) || 0);
            },
          },
          {
            title: '平均审核时长',
            width: 100,
            align: 'center',
            dataIndex: 'ta_statistics.节点统计.平均审核时长',
            render: (text: string, index: number, record: any, column: any) => {
              return formatDuring(Number(text) || 0);
            },
          },
          {
            title: '平均完结审核步骤数量',
            width: 130,
            align: 'center',
            dataIndex: 'ta_statistics.节点统计.完结审核步骤',
          },
          { title: '回退流程数量', dataIndex: 'ta_statistics.流程统计.回退流程数量', width: 100 },
          {
            title: '平均回退数量',
            width: 100,
            align: 'center',
            dataIndex: 'ta_statistics.节点统计.回退数量/ta_statistics.流程统计.已完成',
          },
          {
            title: '回退率',
            align: 'center',
            dataIndex: 'ta_statistics.流程统计.回退流程数量/ta_statistics.流程统计.已完成',
          },
        ],
      },
      searcherSimpleOptions: [{ key: 'name', label: '名称', type: 'string' }],
    }));

    const renderContent = (column: any) => {
      if (column.title === '回退率') {
        return 'ComTableCellProgress';
      } else {
        return 'ComTableCellBox';
      }
    };

    const renderHandleFunction = (column: any) => {
      if (['平均回退数量'].includes(column.title)) {
        return (s: string | number) => {
          if (Number(s) === Infinity) {
            return 0;
          }
          return Number(s || 0).toFixed(1);
        };
      }

      return void 0;
    };

    const renderColor = (column: any) => {
      if (['发起数量', '进行中'].includes(column.title)) {
        return 'blue';
      } else if (['已终止', '回退流程数量', '平均回退数量'].includes(column.title)) {
        return 'red';
      } else if (column.title === '已完成') {
        return 'green';
      } else if (column.title === '平均完结审核步骤数量') {
        return 'yellow';
      } else {
        return 'gray';
      }
    };

    const visible = ref(false);
    const state = ref<any>(null);
    const workflowId = ref<any>(null);
    const stateMap = () => {
      switch (state.value) {
        case '待提交':
          return 'created';
        case '进行中':
          return 'processing';
        case '已完成':
          return 'completed';
        case '已终止':
          return 'terminated';
      }
    };
    const start_at = ref<any>(dayjs().startOf('year'));
    const end_at = ref<any>(dayjs().endOf('year'));
    const timeQuery = ref<any>({
      created_at_gteq: dayjs(start_at.value),
      created_at_lteq: dayjs(end_at.value),
    });
    const stateQuery = ref<any>({});
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
    const temporaryQuery = computed(() => ({
      ...stateQuery.value,
      ...timeQuery.value,
    }));
    const handleClick = (record: VObject, column: any) => {
      if (['待提交', '进行中', '已完成', '已终止'].includes(column.title)) {
        state.value = column.title;
        stateQuery.value = {
          state_eq: stateMap(),
        };
        workflowId.value = record.id;
        visible.value = true;
      } else if (column.title === '发起数量') {
        state.value = null;
        stateQuery.value = {};
        workflowId.value = record.id;
        visible.value = true;
      } else if (column.title === '回退流程数量') {
        state.value = null;
        stateQuery.value = {
          tokens_state_in: ['rejected', 'failed'],
        };
        workflowId.value = record.id;
        visible.value = true;
      }
    };

    const instanceStore = computed(
      () =>
        new VStore(
          new BpmAdminInstances({
            parents: [
              {
                type: 'workflows',
                id: workflowId.value,
              },
            ],
          }),
          InstanceModel,
        ),
    );
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
    const router = useRouter();
    const onShow = (record: any) => {
      router.push({
        path: `/bpm/stat/workflows/${record.id}`,
        query: {
          start_at: start_at.value.format('YYYY-MM-DD 00:00:00 Z'),
          end_at: end_at.value.format('YYYY-MM-DD 00:00:00 Z'),
        },
      });
    };
    return {
      ...toRefs(props),
      config,
      renderContent,
      renderHandleFunction,
      renderColor,
      visible,
      temporaryQuery,
      handleClick,
      instanceConfig,
      onShow,
      onDateChange,
      start_at,
      end_at,
    };
  },
});
export default ComBpmStatWorkflowsIndex;
</script>

<template lang="pug">
.com-bpm-stat-workflows-index
  TaIndexView.ta-index-view1(:config='config', @onIndex='onIndex', @onShow='onShow')
    template(#bodyCell='{ text, record, index, column }')
      component.cursor-pointer(
        :is='renderContent(column)',
        :data='{ text, record, index, column }',
        :handle='renderHandleFunction(column)',
        :color='renderColor(column)',
        @click.stop='handleClick(record, column)',
        v-if='column.title !== "流程名称" && !column.title.includes("时长")'
      )
    template(#right-actions)
      a-range-picker.date-item(
        @change='onDateChange',
        format='YYYY-MM-DD',
        :value='[start_at, end_at]'
      )
  TaNoPaddingDrawer.px-4(v-model:visible='visible', v-if='visible', title='工作流', width='1100px')
    TaIndexView.ta-index-view2.p-4(:config='instanceConfig', :temporaryQuery='temporaryQuery')
      template(#card='{ record }')
        ComBpmInstanceCard(:record='record')
      //- template(#right-actions)
      //-   .flex.items-center.space-x-4
      //-     //- TaTextButton(
      //-     //-   icon='ExportOutlined',
      //-     //-   :loading='downloadFilesLoading',
      //-     //-   @click='onDownloadFiles'
      //-     //- ) 导出附件
      //-     a-range-picker.date-item(@change='onDateChange', format='YYYY-MM-DD')
      //-     a-dropdown.dropdown(:trigger='["click"]')
      //-       a.text-gray(@click.stop='e => e.preventDefault()')
      //-         .text {{ state.label }}
      //-       template(#overlay)
      //-         a-menu
      //-           a-menu-item(v-for='menu in dropDownMenus', @click='stateChagne(menu)')
      //-             .icon-text {{ menu.label }}
</template>

<style lang="stylus" scoped>
.com-bpm-stat-workflows-index
  height 100%
  .ta-index-view1
    :deep(.ta-table-component__table)
      padding 0
    :deep(.table-body-cell)
      @apply text-sm text-gray-900
    :deep(thead)
      background #f3f4f6
      tr
        th:nth-child(-n+2)
          background @background !important
        th:nth-child(7), th:nth-child(8), th:nth-child(9)
          padding 12px 28px !important
        th
          >.table-header-cell
            white-space normal
:root
  .ta-index-view2
    :deep(.ta-index-view-layout)
      .tags-flex
        .ta-index-view-layout-content
          .content
            .ta-index-list
              .ant-spin-nested-loading
                height 100%
</style>
