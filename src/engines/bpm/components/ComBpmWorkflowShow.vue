<script lang="ts">
import ComBpmInstanceCreator from '@/engines/bpm/components/ComBpmInstanceCreator.vue';
import { VApi, VModel, VStore } from '@/lib/vails';
import { PropType, computed, defineComponent, nextTick, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { TaTemplateFormColumnAttribute } from '../bpm-core/ta-template-form-core/types';
import { Instance } from '../bpm-core/types';
import { BpmMetaRecord } from '../types/model';
import ComBpmInstanceCard from './ComBpmInstanceCard.vue';

const ComBpmWorkflowShow = defineComponent({
  name: 'ComBpmWorkflowShow',
  components: {
    ComBpmInstanceCard,
    ComBpmInstanceCreator,
  },
  props: {
    workflowStore: { type: Object, required: true },
    instanceApi: { type: Object as PropType<VApi<Instance>>, required: true },
    instanceCreatedApi: { type: Object as PropType<VApi<Instance>>, required: true },
    instanceApprovingApi: { type: Object as PropType<VApi<Instance>>, required: true },
    instanceApprovedApi: { type: Object as PropType<VApi<Instance>>, required: true },
    instanceNotifiedApi: { type: Object as PropType<VApi<Instance>>, required: true },
    meteRecordApi: { type: Object as PropType<VApi<BpmMetaRecord>>, default: undefined },
  },
  setup(props) {
    const route = useRoute();
    const workflowId = Number(route.params.workflowId);

    props.workflowStore.find(workflowId);

    const instanceStore = new VStore(props.instanceCreatedApi, InstanceModel as any);
    const instanceDraftStore = new VStore(props.instanceCreatedApi, InstanceModel as any);
    const instanceCreatedStore = new VStore(props.instanceCreatedApi, InstanceModel as any);
    const instanceApprovingStore = new VStore(props.instanceApprovingApi, InstanceModel as any);
    const instanceApprovedStore = new VStore(props.instanceApprovedApi, InstanceModel as any);
    const instanceNotifiedStore = new VStore(props.instanceNotifiedApi, InstanceModel as any);

    const metaRecordStore = props.meteRecordApi ? new VStore(props.meteRecordApi as any) : null;

    const config = computed(() => ({
      store: instanceStore,
      recordName: '流程',
      mode: 'list',
      selection: {
        showByDefault: true,
      },
      list: {
        scroll: {
          y: '65vh',
        },
      },
      searcherSimpleOptions: [
        { label: '编号', key: 'seq', type: 'string' },
        { label: '发起人姓名', key: 'creator_name', type: 'string' },
        { label: '发起人账号', key: 'creator_account', type: 'string' },
        { label: '其他信息', key: 'summary', type: 'string' },
      ],
    }));

    const creator = ref<any>(null);

    const onCreateInstance = () => {
      nextTick(() => creator.value.onCreateInstance());
    };

    const metaRecordComplicatedSearcherOptions = computed(() =>
      (props.workflowStore.record.value.form?.column_attributes || []).map(
        (attr: TaTemplateFormColumnAttribute) => ({
          label: Array.isArray(attr.title) ? attr.title[0] : attr.title,
          key: attr.dataIndex,
          type: 'string',
        }),
      ),
    );

    const tabs = computed(() => [
      {
        key: 'draft',
        label: '草稿箱',
        query: {
          state_eq: 'created',
        },
        store: instanceDraftStore,
      },
      {
        key: 'approving',
        label: '待办事项',
        query: {},
        store: instanceApprovingStore,
      },
      {
        key: 'approved',
        label: '我已处理',
        query: {},
        store: instanceApprovedStore,
      },
      {
        key: 'created',
        label: '我发起的',
        query: {},
        store: instanceCreatedStore,
      },
      {
        key: 'notified',
        label: '抄送我的',
        query: {},
        store: instanceNotifiedStore,
      },
      {
        key: 'all',
        label: '全部数据',
        query: {},
        store: instanceStore,
        searcherSimpleOptions: [],
      },
      ...(metaRecordStore
        ? [
            {
              key: 'report',
              label: '统计报表',
              mode: 'table',
              query: {},
              template: props.workflowStore.record.value.form,
              recordName: '数据',
              store: metaRecordStore,
              searcherSimpleOptions: metaRecordComplicatedSearcherOptions.value,
              searcherComplicatedOptions: metaRecordComplicatedSearcherOptions.value,
            },
            {
              key: 'statistics',
              label: '数据统计',
              query: {},
              store: instanceStore,
            },
          ]
        : []),
    ]);

    const selectedInstances = ref<(Instance & VModel<Instance>)[]>([]);

    const taIndexView = ref<any>(null);
    const taExport = ref<any>(null);
    const taExportSelectedOnly = ref<any>(null);

    const exportStore = computed(() => taIndexView.value?.activeStore);
    const exportTemplate = computed(() => taIndexView.value?.localTemplate);

    const exportTemporaryQuery = computed(() => ({
      id_eq: selectedInstances.value.map((instance: Instance) => instance.id),
    }));

    const onExportAll = () => {
      taExport.value.onHeaders();
    };

    const onExportSelectedOnly = () => {
      taExportSelectedOnly.value.onHeaders();
    };

    const freshList = () => {
      taIndexView.value.silenceRefresh();
    };

    const visibleExport = computed(
      () => !['report', 'statistics'].includes(taIndexView.value?.activeTabKey),
    );

    return {
      ...toRefs(props),
      workflow: props.workflowStore.record,
      workflowId,
      config,
      tabs,
      creator,
      onCreateInstance,
      taExport,
      taExportSelectedOnly,
      taIndexView,
      exportStore,
      onExportAll,
      onExportSelectedOnly,
      exportTemplate,
      selectedInstances,
      exportTemporaryQuery,
      freshList,
      visibleExport,
    };
  },
});
export default ComBpmWorkflowShow;
</script>

<template lang="pug">
.com-bpm-workflow-show
  TaIndexView(
    v-model:selectedRecords='selectedInstances',
    ref='taIndexView',
    :config='config',
    :tabs='tabs'
  )
    template(#card='{ record }')
      ComBpmInstanceCard(:record='record', @dialogClose='freshList')
    template(#header)
      .flex
        TaTitleHeader(:title='workflow.name')
        TaIcon.like(:type='"HeartOutlined"')
    template(#tabs_left)
      .tab-left
        a-button.create(type='primary', @click='onCreateInstance') 发起流程
        a-popover(v-if='visibleExport', placement='bottom')
          a-button.export 导出
          template(#content)
            .export-content
              .export-selected(@click='onExportSelectedOnly')
                | 导出选中
                span
                  | （当前选择{{ selectedInstances.length }}数据）
              .export-all(@click='onExportAll')
                | 导出全部
                span
                  | （共{{ exportStore.totalCount.value }}条）

  TaExport.hidden(ref='taExport', :store='exportStore', :template='exportTemplate')
  TaExport.hidden(
    ref='taExportSelectedOnly',
    :store='exportStore',
    :template='exportTemplate',
    :temporaryQuery='exportTemporaryQuery'
  )
  ComBpmInstanceCreator(ref='creator', :workflowId='workflowId', @close='freshList')
</template>

<style lang="stylus" scoped>
.com-bpm-workflow-show
  .hidden
    display none
  .flex
    .like
      display flex
      justify-content center
      align-items center
      margin-left 18px
      color #A6A6A6
  .tab-left
    display flex
    align-items center
    margin-right 32px
    .export
      margin-left 12px
      border 1px solid $primary-color
      color $primary-color
    .export, .create
      width 100px
      height 36px
.export-content
  padding 6px
  .export-selected
    margin-bottom 12px
  .export-selected, .export-all
    font-size 14px
    font-weight 400
    color #494F57
    line-height 20px
    cursor pointer
    span
      font-size 14px
      font-weight 400
      color rgba(89, 89, 89, 0.65)
      line-height 20px
</style>
