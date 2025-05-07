<script lang="ts">
import { BpmAdminInstances } from '@/engines/bpm/bpm-core/apis/admin/instance.api';
import { BpmAdminWorkflows, WorkflowModel } from '@/engines/bpm/bpm-core/apis/admin/workflow.api';
import { InstanceModel } from '@/engines/bpm/bpm-core/apis/user/instance.api';
import ComBpmInstanceCard from '@/engines/bpm/components/ComBpmInstanceCard.vue';
import { VStore } from '@/lib/vails';
import { Ref, computed, defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import ComBpmWorkflowsShow from './ComBpmWorkflowsShow.vue';
const ComBpmWorkflowsIndex = defineComponent({
  name: 'ComBpmWorkflowsIndex',
  components: {
    ComBpmWorkflowsShow,
    ComBpmInstanceCard,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const visible = ref(false);
    const adminWorkflowStore = new VStore(new BpmAdminWorkflows(), WorkflowModel);

    const total_count = computed(() => {
      return instanceStore.totalCount.value || 0;
    });
    const instanceStore = new VStore(
      new BpmAdminInstances({ parents: [{ type: 'workflows', id: 1 }] }),
      InstanceModel,
    );
    const instanceConfig = computed(() => ({
      recordName: `已发起流程 ${total_count.value} 条`,
      store: instanceStore,
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
    const config = computed(() => ({
      recordName: '流速分析',
      store: props.store,
      mode: 'table',
      actions: [{ key: 'export', enabled: true }],
      table: {
        scroll: { y: 'auto' },
        columns: [
          { title: '流程名称', dataIndex: 'name' },
          { title: '发起数量', dataIndex: 'rule_statistic.all_count' },
          { title: '待提交', dataIndex: 'rule_statistic.created_count' },
          { title: '进行中', dataIndex: 'rule_statistic.processing_count' },
          { title: '已完成', dataIndex: 'rule_statistic.completed_count' },
          { title: '已终止', dataIndex: 'rule_statistic.terminated_count' },
          { title: '流速监测点', dataIndex: 'rule_statistic.rule_count' },
          { title: '逾期数量', dataIndex: 'rule_statistic.delay_count' },
          {
            title: '逾期占比',
            dataIndex: 'rule_statistic.delay_count',
            // render: (_: any, index: number,record:any) => `${(record.rule_statistic.delay_count / record.rule_statistic.all_count) || 0 }`
            // render: () => ''
          },
        ],
      },
      searcherSimpleOptions: [{ key: 'name', label: '名称', type: 'string' }],
    }));
    const dropDownMenus = [
      {
        value: '',
        label: '全部',
      },
      {
        value: 'created',
        label: '待提交',
      },
      {
        value: 'processing',
        label: '进行中',
      },
      {
        value: 'completed',
        label: '已完成',
      },
      {
        value: 'terminated',
        label: '已终止',
      },
    ];
    const state = ref(dropDownMenus[0]);
    const timeQuery: Ref<Record<string, any>> = ref({});
    const onDateChange = (range: any) => {
      const [start, end] = range || [null, null];
      if (start && end) {
        timeQuery.value.created_at_gteq = start.format('YYYY-MM-DD 00:00:00 Z');
        timeQuery.value.created_at_lteq = end.format('YYYY-MM-DD 00:00:00 Z');
      } else {
        timeQuery.value.created_at_gteq = null;
        timeQuery.value.created_at_lteq = null;
      }
    };
    const stateChagne = (menu: any) => {
      state.value = menu;
    };
    const temporaryQuery = computed(() => ({
      state_eq: state.value.value,
      ...timeQuery.value,
    }));

    const toLink = (id: number, title: string) => {
      // router.push(`/bpm/admin/workflows/${id}?tab=instances`);
      let position = dropDownMenus.findIndex(menu => menu.label === title);
      state.value.value = dropDownMenus[position]?.value;
      // console.log(dropDownMenus[position]?.value);
      instanceStore.api = new BpmAdminInstances({ parents: [{ type: 'workflows', id }] });
      adminWorkflowStore.find(id).then(() => (visible.value = true));
    };
    const toDetial = (id: number) => {
      router.push(`/bpm/rule_stat/workflows/${id}/rules`);
    };
    return {
      ...toRefs(props),
      config,
      toLink,
      toDetial,
      visible,
      instanceConfig,
      state,
      temporaryQuery,
      onDateChange,
      stateChagne,
    };
  },
});

export default ComBpmWorkflowsIndex;
</script>

<template lang="pug">
.com-bpm-rule-stat-workflows-index
  TaIndexView(:config='config', @onIndex='onIndex')
    template(#bodyCell='{ text, record, index, column }')
      .pink.bg-red-100.cursor-pointer(v-if='column.title === "逾期数量"', @click='toDetial(record.id)')
        .text-red-800.text-xs.leading-normal {{ text }}
      .flex.justify-center.cursor-pointer(
        v-else-if='column.title === "逾期占比"',
        @click='toDetial(record.id)'
      )
        a-progress.progress(
          :percent='(Number(record.rule_statistic.delay_count / record.rule_statistic.all_count || 0) * 100).toFixed(2)',
          size='small',
          strokeColor='#FF8A4C'
        )
      .cursor-pointer(
        v-else-if='column.title === "发起数量" || column.title === "待提交" || column.title === "进行中" || column.title === "已完成" || column.title === "已终止"',
        @click='toLink(record.id, column.title)'
      ) {{ text }}
      .cursor-pointer(v-else, @click='toDetial(record.id)') {{ text }}
  TaNoPaddingDrawer.px-4(
    v-model:visible='visible',
    v-if='visible',
    title='工作流',
    width='1100px',
    @ok='onCloseDialog'
  )
    TaIndexView.ta-index-view.p-4(
      :config='instanceConfig',
      :temporaryQuery='temporaryQuery',
      @onIndex='onIndex'
    )
      template(#card='{ record }')
        ComBpmInstanceCard(:record='record')
      template(#right-actions)
        .flex.items-center.space-x-4
          TaTextButton(
            icon='ExportOutlined',
            :loading='downloadFilesLoading',
            @click='onDownloadFiles'
          ) 导出附件
          a-range-picker.date-item(@change='onDateChange', format='YYYY-MM-DD')
          a-dropdown.dropdown(:trigger='["click"]')
            a.text-gray(@click.stop='e => e.preventDefault()')
              .text {{ state.label }}
            template(#overlay)
              a-menu
                a-menu-item(v-for='menu in dropDownMenus', @click='stateChagne(menu)')
                  .icon-text {{ menu.label }}
</template>

<style lang="stylus" scoped>
.com-bpm-rule-stat-workflows-index
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
