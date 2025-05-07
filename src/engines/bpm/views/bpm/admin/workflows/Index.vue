<script lang="ts">
import { BpmAdminCatalogsApi } from '@/engines/bpm/apis/bpm/admin/catalogs.api';
import { BpmAdminWorkflows, WorkflowModel } from '@/engines/bpm/bpm-core/apis/admin/workflow.api';
import { BpmCatalog } from '@/engines/bpm/types/model';
import { VModel, VObject, VStore } from '@/lib/vails';
import { message } from 'ant-design-vue';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { Workflow } from '../../../../bpm-core/types';

const BpmAdminWorkflowsIndex = defineComponent({
  name: 'BpmAdminWorkflowsIndex',
  components: {},
  props: {},
  setup(props) {
    const draggable = ref(false);
    const store = new VStore(
      new BpmAdminWorkflows({
        params: {
          q: {
            s: ['position asc'],
          },
        },
      }),
      WorkflowModel,
    );
    const catalogStore = new VStore(new BpmAdminCatalogsApi());
    const router = useRouter();

    catalogStore.index({ per_page: 999999, q: { s: ['position asc'] } });

    const tags = [
      {
        key: 'all',
        label: '全部',
        query: {},
      },
      {
        key: 'done',
        label: '已发布',
        query: { state_eq: 'done' },
      },
      {
        key: 'todo',
        label: '未发布',
        query: { state_eq: 'todo' },
      },
    ];
    const tabs = computed(() => [
      {
        key: 'all',
        label: '全部',
        // num: 0,
        query: {
          state_not_eq: 'archived',
        },
        tags,
      },
      ...catalogStore.records.value.map((catalog: BpmCatalog) => ({
        key: catalog.id,
        label: catalog.name,
        query: { catalog_id_eq: catalog.id, state_not_eq: 'archived' },
        draggable: true,
        tags,
      })),
      {
        key: 'other',
        label: '其他',
        query: { catalog_id_null: true, state_not_eq: 'archived' },
        tags,
      },
      {
        key: 'archived',
        label: '已归档',
        query: { state_eq: 'archived' },
      },
    ]);

    const config = computed(() => ({
      recordName: '工作流',
      store: store,
      mode: 'table',
      table: { scroll: { y: '70vh' } },
      detail: {
        mode: 'route',
      },
      draggable: draggable.value,
      searcherSimpleOptions: [{ key: 'name', label: '名称', type: 'string' }],
    }));

    const onCreate = () => {
      router.push('/bpm/admin/workflows/new');
    };

    const onEdit = (record: Workflow) => {
      router.push(`/bpm/admin/workflows/${record.id}/edit`);
    };

    const onDelete = (record: VModel<Workflow>) => {
      return record
        .delete()
        .then(() => {
          message.success('删除成功');
        })
        .catch(err => {
          message.error('删除失败');
          throw err;
        });
    };

    const onCopy = (record: Workflow) => {
      return store
        .sendMemberAction({
          id: record.id,
          action: 'clone',
        })
        .then(() => {
          store.index().then(() => {
            message.success('复制成功');
          });
        })
        .catch(err => {
          message.error('复制失败');
          throw err;
        });
    };

    const stateOptions = Object.keys(WorkflowModel.stateZhMapping).map(key => ({
      value: key,
      label: WorkflowModel.stateZhMapping[key],
    }));

    const taIndexView = ref<any>(null);

    const saveRecord = (record: VModel) => {
      record.save();
    };

    const onRule = (record: Workflow) => {
      router.push(`/bpm/admin/workflows/${record.id}/rules`);
    };
    const tabChange = (tab: VObject) => {
      if (tab.key == 'all') {
        draggable.value = false;
      } else {
        draggable.value = true;
      }
    };
    return {
      ...toRefs(props),
      tabs,
      config,
      onCreate,
      onEdit,
      onDelete,
      onCopy,
      stateZhMapping: WorkflowModel.stateZhMapping,
      stateOptions,
      saveRecord,
      taIndexView,
      onRule,
      tabChange,
    };
  },
});

export default BpmAdminWorkflowsIndex;
</script>

<template lang="pug">
.com-bpm-admin-workflows-index
  TaIndexView(
    ref='taIndexView',
    :config='config',
    :tabs='tabs',
    :authFetch='false',
    @tabChange='tabChange'
  )
    template(#right-actions)
      TaTextButton.button(icon='PlusCircleOutlined', @click='onCreate') 创建工作流
    template(#table)
      a-table-column(:autoHeight='true' title='序号', dataIndex='position', :width='50')
      a-table-column(:autoHeight='true' title='ID', dataIndex='id', :width='50')
      a-table-column(:autoHeight='true' title='流程分类', dataIndex='catalog_name')
      a-table-column(:autoHeight='true' title='工作流类型', dataIndex='classify')
      a-table-column(:autoHeight='true' title='名称', dataIndex='name')
      a-table-column(:autoHeight='true' title='状态')
        template(#default='{ record }')
          TaSelect(
            v-model:value='record.formData.state',
            :options='stateOptions',
            @update:value='saveRecord(record)',
            @click.stop=''
          )
      a-table-column(:autoHeight='true' title='创建时间', dataIndex='createdAtStr')
      a-table-column(:autoHeight='true' title='修改时间', dataIndex='updatedAtStr')
      a-table-column(:autoHeight='true' :width='150')
        template(#default='{ record }')
          .actions
            TaIconTooltip.icon(icon='SlidersOutlined', tips='流速规则', @click='onRule(record)')
            TaIconTooltip.icon(icon='EditOutlined', tips='编辑', @click='onEdit(record)')
            TaPopoverConfirm(title='复制', :content='`确认复制该流程`', @confirm='onCopy(record)')
              TaIconTooltip.icon(@click.stop='', icon='CopyOutlined', tips='复制')
            TaPopoverConfirm(title='删除', :content='`确认删除该流程`', @confirm='onDelete(record)')
              TaIconTooltip.icon(@click.stop='', icon='DeleteOutlined', tips='删除')
</template>

<style lang="stylus" scoped>
.com-bpm-admin-workflows-index
  width 100%
  height 100%
  .button
    margin-top 4px
  .icon
    margin-right 10px
  .actions
    display flex
</style>
