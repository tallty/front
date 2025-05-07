<script lang="ts">
import { defineComponent, computed, toRefs, ref, Ref } from 'vue';
import { BpmAdminWorkflows, WorkflowModel } from '@/engines/bpm/bpm-core/apis/admin/workflow.api';
import { getWorkflowTemplate } from './template';
import ComBpmFlowTree from '../../../../components/designer/flowTree/ComBpmFlowTree.vue';
import { BpmAdminInstances } from '../../../../bpm-core/apis/admin/instance.api';
import { InstanceModel } from '@/engines/bpm/bpm-core/apis/user/instance.api';
import ComBpmInstanceCard from '../../../../components/ComBpmInstanceCard.vue';
import { VStore } from '@/lib/vails';
import { useRoute } from 'vue-router';
import { useInstanceActionAuthProvide } from '@/engines/bpm/components/useInstanceActionAuth';
import { TaIndexSearcherOptionInterface } from '@/components/global/ta-component/TaIndexView/types';

interface Menu {
  value: string;
  label: string;
}
const BpmAdminWorkflowsShow = defineComponent({
  name: 'BpmAdminWorkflowsShow',
  components: {
    ComBpmFlowTree,
    ComBpmInstanceCard,
  },
  props: {},
  setup(props) {
    const store = new VStore(new BpmAdminWorkflows(), WorkflowModel);
    const route = useRoute();
    const id = Number(route.params.id);

    store.find(id);
    const timeQuery: Ref<Record<string, any>> = ref({});
    const downloadQuery = ref();
    const tabs = [
      {
        key: 'info',
        label: '基本信息',
      },
      {
        key: 'form',
        label: '表单',
      },
      {
        key: 'flow',
        label: '流程',
      },
      {
        key: 'instances',
        label: '已发起',
      },
    ];

    const searcherOptions: TaIndexSearcherOptionInterface[] = [
      { label: '编号', key: 'seq', type: 'string' },
      { label: '部门', key: 'creator_orgs_name', type: 'string' },
      { label: '发起人姓名', key: 'creator_name', type: 'string' },
      { label: '发起人账号', key: 'creator_account', type: 'string' },
      { label: '其他信息', key: 'summary', type: 'string' },
      { label: '节点状态', key: 'tokens_state', type: 'string' },
    ];
    const dropDownMenus: Array<Menu> = [
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
    const instanceStore = new VStore(
      new BpmAdminInstances({ parents: [{ type: 'workflows', id }] }),
      InstanceModel,
    );
    const total_count = computed(() => {
      return instanceStore.totalCount.value || 0;
    });
    const instanceConfig = computed(() => ({
      recordName: `已发起流程 ${total_count.value} 条`,
      store: instanceStore,
      searcherSimpleOptions: searcherOptions,
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
    const onDateChange = (range: any) => {
      const [start, end] = range || [null,null];
      if (start && end) {
        timeQuery.value.created_at_gteq = start.format('YYYY-MM-DD 00:00:00 Z');
        timeQuery.value.created_at_lteq = end.format('YYYY-MM-DD 00:00:00 Z');
      } else {
        timeQuery.value.created_at_gteq = null;
        timeQuery.value.created_at_lteq = null;
      }
    };
    const stateChagne = (menu: Menu) => {
      state.value = menu;
    };
    const temporaryQuery = computed(() => ({
      state_eq: state.value.value,
      ...timeQuery.value,
    }));
    const auth = ref({
      instance: { edit: true },
      token: { edit: true },
    });
    useInstanceActionAuthProvide(auth);
    const downloadFilesLoading = ref(false);

    const onDownloadFiles = () => {
      downloadFilesLoading.value = true;

      instanceStore
        .sendCollectionAction({
          action: 'download_files',
          config: {
            responseType: 'arraybuffer',
            params: {
              ...downloadQuery.value,
            },
          },
        })
        .then((res: any) => {
          downloadFilesLoading.value = false;
          const url = window.URL.createObjectURL(
            new Blob([res.data as string], {
              type: 'octet/stream',
            }),
          );
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${store.record.value.name}文件导出.zip`;
          // a.download = `文件导出.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch((err: Error) => {
          downloadFilesLoading.value = false;
          throw err;
        });
    };
    const onIndex = (data: any, searcherQuery: any) => {
      downloadQuery.value = searcherQuery;
    };
    return {
      ...toRefs(props),
      store,
      record: store.record,
      getWorkflowTemplate,
      tabs,
      instanceConfig,
      onDateChange,
      temporaryQuery,
      dropDownMenus,
      state,
      stateChagne,
      onDownloadFiles,
      downloadFilesLoading,
      onIndex,
    };
  },
});

export default BpmAdminWorkflowsShow;
</script>

<template lang="pug">
.com-bpm-admin-workflows-show
  TaShowLayout(
    :tabs='tabs',
    :title='record.name',
    :store='store',
    :template='getWorkflowTemplate()'
  )
    template(#form_tab)
      TaTemplateFormViewer.viewer(:template='record.form', :modelValue='{}')
    template(#flow_tab)
      ComBpmFlowTree.flow(:core='record.core', :disabled='true')
    template(#instances_tab)
      TaIndexView.ta-index-view(
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
.com-bpm-admin-workflows-show
  width 100%
  height 100%
  .viewer
    padding 30px
  .flow
    position relative
    overflow scroll
    width 100%
    height 100%
  .ta-index-view
    max-height 100%
</style>
