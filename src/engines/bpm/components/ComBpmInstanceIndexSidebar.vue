<script lang="ts">
import { VStore } from '@/lib/vails';
import { every, some } from 'lodash';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { BpmUserWorkflows } from '../bpm-core/apis/user/workflowl.api';

const ComBpmInstanceIndexSidebar = defineComponent({
  name: 'ComBpmInstanceIndexSidebar',
  props: {
    statistics: { type: Object, default: () => ({}) },
  },
  emits: ['onWorkflowIdsChange'],
  setup(props, { emit }) {
    const collapsed: any = ref({
      project: true,
      sidebar: false,
    });

    const toggleCollapse = (type: string) => {
      collapsed.value[type] = !collapsed.value[type];
    };

    const workflowCounts = computed(() => {
      return props.statistics.workflow_id_count || {};
    });

    const catalogs = ref<any>({});

    const workflowStore = new VStore(new BpmUserWorkflows());
    const fetchWorkflows = () => {
      let workflowIds = Object.keys(workflowCounts.value);
      if (workflowIds.length === 0) {
        workflowIds = ['0'];
      }
      workflowStore
        .index({
          q: { id_in: workflowIds },
          // 不区分状态的返回workflow
          without_state: true,
          per_page: 100,
        })
        .then(({ records }) => {
          const _catalogs: any = {};
          records.forEach((record: any) => {
            const catalogId = record.catalog_id ? record.catalog_id.toString() : '';

            const workflows = _catalogs[catalogId] || [];
            workflows.push({
              id: record.id,
              name: record.name,
              catalogId,
              num: props.statistics.workflow_id_count?.[record.id],
              selected: selectedWorkflowIds.value.has(record.id),
            });
            _catalogs[catalogId] = workflows;
          });

          catalogs.value = Object.keys(_catalogs).map(id => {
            return {
              id,
              name: props.statistics.catalog_id_name?.[id] || '其他',
              num: props.statistics.catalog_id_count?.[id],
              selected: selectedWorkflowIds.value.has(id),
              workflows: _catalogs[id],
            };
          });
        });
    };

    watch(
      () => props.statistics,
      () => {
        fetchWorkflows();
      },
      {
        deep: true,
      },
    );

    const selectedWorkflowIds = ref<any>(new Set());
    const selectedCataglogIds = ref<any>(new Set());

    const toggleSelectedWorkflow = (workflow: any, catalog: any) => {
      workflow.selected = !workflow.selected;
      catalog.selected = every(catalog.workflows, ['selected', true]);

      if (catalog.selected) {
        selectedCataglogIds.value.add(catalog.id);
      } else {
        selectedCataglogIds.value.delete(catalog.id);
      }

      if (workflow.selected) {
        selectedWorkflowIds.value.add(workflow.id);
      } else {
        selectedWorkflowIds.value.delete(workflow.id);
      }
    };

    const toggleSelectedCatalog = (catalog: any) => {
      catalog.selected = !catalog.selected;

      if (catalog.selected) {
        selectedCataglogIds.value.add(catalog.id);
        catalog.workflows.forEach((workflow: any) => {
          workflow.selected = true;
          selectedWorkflowIds.value.add(workflow.id);
        });
      } else {
        selectedCataglogIds.value.delete(catalog.id);
        catalog.workflows.forEach((workflow: any) => {
          workflow.selected = false;
          selectedWorkflowIds.value.delete(workflow.id);
        });
      }
    };

    const showClear = (catalog: any) => {
      return catalog.selected || some(catalog.workflows, ['selected', true]);
    };

    const onClear = (catalog: any) => {
      catalog.workflows.forEach((workflow: any) => {
        workflow.selected = false;
        selectedWorkflowIds.value.delete(workflow.id);
      });
      catalog.selected = false;
      selectedCataglogIds.value.delete(catalog);
    };

    const reset = () => {
      selectedWorkflowIds.value.clear();
      selectedCataglogIds.value.clear();
    };

    watch(
      () => selectedWorkflowIds.value,
      () => {
        emit('onWorkflowIdsChange', [...selectedWorkflowIds.value]);
      },
      {
        deep: true,
      },
    );

    const { t } = useI18n();

    return {
      ...toRefs(props),
      toggleCollapse,
      collapsed,

      catalogs,
      selectedWorkflowIds,
      toggleSelectedWorkflow,
      selectedCataglogIds,
      toggleSelectedCatalog,

      onClear,
      showClear,
      reset,

      t,
    };
  },
});

export default ComBpmInstanceIndexSidebar;
</script>

<template lang="pug">
.com-bpm-instance-index-sidebar.px-4.rounded-lg.text-gray-900.bg-white.h-0.flex-grow
  .collapsed.flex.flex-col.items-center.overflow-hidden.transition-all.duration-200.h-full(
    :class='collapsed.sidebar ? "w-10" : "w-0 !h-0"'
  )
    TaIcon.w-5.h-5.text-gray-500.mt-4.cursor-pointer(
      type='outline/expand-right',
      @click='toggleCollapse("sidebar")'
    )
    .primary-color.font-medium.text-center.mt-4
      span {{ t('bpm.ComBpmInstanceIndexSidebar.process') }}
      br
      span {{ selectedWorkflowIds.size }}

  .expended.flex.flex-col.items-center.transition-all.duration-200.h-full(
    :class='collapsed.sidebar ? "w-0 h-0 overflow-hidden" : "w-53 overflow-y-auto"'
  )
    .flex.justify-between.items-center.pt-4.sticky.top-0.z-10.bg-white.w-full
      .font-medium.text-lg {{ t('bpm.ComBpmInstanceIndexSidebar.classification') }}
      TaIcon.w-5.h-5.text-gray-500.cursor-pointer(
        type='outline/expand-left',
        @click='toggleCollapse("sidebar")'
      )
    .mt-2.w-full(v-for='catalog in catalogs')
      .flex.justify-between.items-center.px-2.cursor-pointer(class='py-2.5')
        .flex.items-center.font-medium.text-gray-900.text-base.gap-x-2(
          @click='toggleSelectedCatalog(catalog)'
        )
          TaIcon.w-4.h-4.mr-1.primary-color(type='solid/check', v-if='catalog.selected')
          .truncate(:class='{ "primary-color": catalog.selected }') {{ catalog.name }} {{ catalog.num }}
        .flex.items-center
          .text-sm.primary-color.cursor-pointer(
            v-if='showClear(catalog)',
            @click='onClear(catalog)'
          ) {{ t('bpm.ComBpmInstanceIndexSidebar.clear') }}
          TaIcon.ml-4.w-4.h-4.cursor-pointer(
            :type='collapsed[catalog.id] ? "CaretDownOutlined" : "CaretUpOutlined"',
            color='#9CA3AF',
            @click='toggleCollapse(catalog.id)'
          )
      .workflows(:class='{ collapsed: collapsed[catalog.id] }')
        .flex.justify-between.items-center.px-2.cursor-pointer(
          class='py-2.5',
          v-for='workflow in catalog.workflows',
          @click='toggleSelectedWorkflow(workflow, catalog)'
        )
          .flex.items-center.text-sm.text-gray-900(class='w-9/12')
            TaIcon.w-4.h-4.mr-1.primary-color(type='solid/check', v-if='workflow.selected')
            .truncate(:class='{ "primary-color": workflow.selected }') {{ workflow.name }}
          .text-sm {{ workflow.num }}
</template>

<style lang="stylus" scoped>
.primary-color
  color $primary-color
.expended
  &::-webkit-scrollbar
    display none
  -ms-overflow-style none
  scrollbar-width none
.workflows.collapsed
  max-height 0
  overflow hidden
</style>
