<script lang="ts">
import { defineComponent, computed, ref, Ref, toRefs, reactive } from 'vue';
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { VObject } from '@/lib/vails/model';
import ComComRouteSettingsShow from './ComComRouteSettingsShow.vue';

const ComComRouteActionsIndex = defineComponent({
  name: 'ComComRouteActionsIndex',
  components: {
    ComComRouteSettingsShow,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const editable = ref(false);
    const loading = ref(false);

    const onEditRole = () => {
      editable.value = true;
    };

    const config = computed(() => ({
      recordName: '',
      store: props.store,
      pagination: {
        perPage: 15,
        showPageSizeChanger: false,
        hideOnSinglePage: false,
        showSizeChanger: false,
      },
      template: 'route_setting',
      detail: {
        mode: 'auto',
        width: '1100px',
      },
      mode: 'table',
      // editApi:
      // showCount: true,
      // actions: [
      //  { key: 'create', enabled: true },
      //  { key: 'update', enabled: true },
      //  { key: 'delete', enabled: true },
      //  { key: 'import', enabled: true },
      //  { key: 'export', enabled: true },
      // ],
      table: {
        scroll: { y: 'auto' },
        // columns: [{ dataIndex: 'id', title: 'ID' }],
      },
      list: {
        scroll: { y: 'auto' },
      },
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
      // searcherSimpleOptions: [{key: 'title', label: '标题', type: 'string' }],
    }));

    const statistics = ref({
      key1: 0,
      key2: 0,
    });

    const onIndex = (data: VObject) => {
      statistics.value = data.statistics;
    };

    const fetchRecord = async (id: number) => {
      await props.store.find(id, {});
    };

    const localVisible = ref(false);
    const onShow = (record: VObject) => {
      fetchRecord(record.id);
      localVisible.value = true;
    };

    const columns = [
      {
        title: '模块',
        dataIndex: 'mname',
        key: 'mname',
        align: 'center',
      },
      {
        title: '控制器',
        dataIndex: 'cname',
        key: 'cname',
        align: 'center',
      },
      {
        title: '动作',
        dataIndex: 'aname',
        key: 'aname',
        align: 'center',
      },
      {
        title: 'class',
        dataIndex: 'controller',
        key: 'klass',
        align: 'center',
      },
      {
        title: 'action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
      },
    ];

    const importActions = () => {
      // props.store.update(record.)
    };

    const dataSource = computed(() =>
      props.store.record.value.conf?.actions.map((item: VObject) => ({
        key: item?.controller + item?.action,
        ...item,
      })),
    );

    return {
      ...toRefs(props),
      config,
      onIndex,
      columns,
      onShow,
      onEditRole,
      editable,
      loading,
      dataSource,
      localVisible,
      importActions,
    };
  },
});

export default ComComRouteActionsIndex;
</script>

<template lang="pug">
.com-com-admin-route-settings-index
  TaIndexView(:config='config' @onIndex='onIndex' @onShow='onShow')
  TaNoPaddingModal.model(
    v-model:visible='localVisible',
    :footer='null',
    :closable='false',
    :bodyStyle='{ overflow: "auto", height: "90vh" }',
    :modalContentStyle='{ "border-radius": "12px" }',
    :headerStyle='{ display: "none" }',
    width='90vw',
  )
    .modal__wrapper.w-full.overflow-hidden
      .content.px-8.py-6
        .flex.justify-end.mb-3
          div(v-if='editable')
            a-button.save-button(type='text' @click='importActions()' :disabled='loading')
              .flex.items-center.text-blue-700
                TaIcon.w-4.h-4.mr-3(type='solid/check')
                .text-xs.font-medium 保存
            a-button.cancel-button(type='text' @click="() => (editable = false)")
              .flex.items-center.text-gray-900
                TaIcon.w-4.h-4.mr-3(type='solid/x')
                .text-xs.font-medium 取消
          a-button.edit-button(type='text' @click="onEditRole()" v-else)
            .flex.items-center.text-gray-900
              TaIcon.w-4.h-4.mr-3(type='solid/pencil-alt')
              .text-xs.font-medium 编辑
        a-table(:dataSource='dataSource', :columns='columns')

</template>

<style lang="stylus" scoped>
.com-com-admin-route-settings-index
  height 100%
  width 100%
</style>
