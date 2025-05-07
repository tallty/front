<script lang="ts">
import { defineComponent, computed, ref, nextTick, toRefs } from 'vue';
import ComBpmInstanceDetailEasyDialogFromIndex from './ComBpmInstanceDetailEasyDialogFromIndex.vue';
import ComBpmInstanceCreator from '@/engines/bpm/components/ComBpmInstanceCreator.vue';
import { VObject } from '@/lib/vails';
import { useI18n } from 'vue-i18n';

const ComBpmInstanceIndexTable = defineComponent({
  name: 'ComBpmInstanceIndexTable',
  components: {
    ComBpmInstanceDetailEasyDialogFromIndex,
    ComBpmInstanceCreator,
  },
  props: {
    store: { type: Object, required: true },
    params: { type: Object, default: () => ({}) },
  },
  emits: ['silenceRefresh'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const config = computed(() => {
      return {
        recordName: t('bpm.ComBpmInstanceIndexTable.name'),
        store: props.store,
        showCount: true,
        params: props.params,
        mode: 'table',
        table: {
          scroll: { y: 'auto' },
        },
      };
    });

    const taIndexView = ref<any>(null);
    const onInstanceFresh = () => {
      silenceRefresh();
      emit('silenceRefresh');
    };
    const silenceRefresh = () => {
      taIndexView.value.silenceRefresh();
    };

    const record = ref({});
    const visibleDialog = ref(false);
    const onShow = (_record: VObject) => {
      record.value = _record;
      visibleDialog.value = true;
    };
    const creator = ref<any>(null);
    const onRebuild = () => {
      nextTick(() => creator.value.onCreateInstance());
    };

    const exporter = ref<any>(null);
    const onExport = () => {
      exporter.value?.onHeaders();
    };

    return {
      ...toRefs(props),
      config,
      taIndexView,
      onInstanceFresh,

      record,
      visibleDialog,
      onShow,
      creator,
      onRebuild,

      exporter,
      onExport,
      t,
    };
  },
});

export default ComBpmInstanceIndexTable;
</script>

<template lang="pug">
.com-bpm-instance-index-table.h-full
  TaIndexView( ref='taIndexView', :config='config',:showHeader='false', @onShow='onShow')
    template(#table)
      a-table-column(:autoHeight='true' dataIndex='workflow_name', :title='t("bpm.ComBpmInstanceIndexTable.title")')
        template(#default='{ record }')
          .flex.items-center
            .w-2.h-2.bg-red-500.mr-2.rounded(v-if='record.unread')
            .truncate {{ record.workflow_name }}
      a-table-column(:autoHeight='true' dataIndex='createdStr', :title='t("bpm.ComBpmInstanceIndexTable.time")')
      a-table-column(:autoHeight='true' :title='t("bpm.ComBpmInstanceIndexTable.lasttoken")')
        template(#default='{ record }') {{ record.last_token?.name }}
      a-table-column(:autoHeight='true' :title='t("bpm.ComBpmInstanceIndexTable.operator")')
        template(#default='{ record }') {{ record.last_token?.operator_name }}
      a-table-column(:autoHeight='true' :title='t("bpm.ComBpmInstanceIndexTable.lastProcessAt")')
        template(#default='{ record }') {{ record.lastProcessAt }}
      a-table-column(:autoHeight='true' :title='t("bpm.ComBpmInstanceIndexTable.other")')
        template(#default='{ record }')
          a-tooltip
            template(#title v-if='record.summaryAry?.[0]')
              .item(v-for='item in record.summaryAry') {{ item }}
            .truncate.max-w-30 {{ record.summaryAry?.[0] || '-' }}
      a-table-column(:autoHeight='true' :title='t("bpm.ComBpmInstanceIndexTable.state")')
        template(#default='{ record }')
          a-tag.state(:style='record.stateInfo?.style') {{ record.stateInfo?.label }}

  ComBpmInstanceDetailEasyDialogFromIndex(
    v-if='visibleDialog',
    v-model:visible='visibleDialog',
    :instance='record',
    @close='onInstanceFresh'
  )

  ComBpmInstanceCreator(
    ref='creator',
    :workflowId='record.workflow_id',
    :initFormData='record.payload'
  )

  TaExport.export-button(
    ref='exporter',
    :store='store',
  )
</template>

<style lang="stylus" scoped>
.export-button
  display: none;
.com-bpm-instance-index-table
  .state
    border: none
  >>>.ta-table-component .ta-table-component__table
    padding: 0
  >>>table .ant-table-row td:first-child, table .ant-table-thead th:first-child
    padding-left: 8px
  >>>.ant-table-tbody > tr > td
    border-color: #F3F4F6
    color: #111928
  >>>.ant-table-thead>tr>th
    color: #374151 !important
    border-color: #F3F4F6
</style>
