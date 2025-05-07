<script lang="ts">
import {
  TaIndexSearcherOptionInterface,
  TaIndexViewTabInterface,
} from '@/components/global/ta-component/TaIndexView/types';
import { VApi, VStore } from '@/lib/vails';
import { VObject } from '@/lib/vails/model';
import { PropType, Ref, computed, defineComponent, ref, toRefs, onMounted } from 'vue';
import { BpmUserApprovedInstances } from '../bpm-core/apis/user/approved/instance.api';
import { BpmUserApprovingInstances } from '../bpm-core/apis/user/approving/instance.api';
import { BpmUserCreatedInstances } from '../bpm-core/apis/user/created/instance.api';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { BpmUserNotifiedInstances } from '../bpm-core/apis/user/notified/instance.api';
import { BpmUserUnreadInstances } from '../bpm-core/apis/user/unread/instance.api';
import { Instance } from '../bpm-core/types';
import ComBpmInstanceCard from './ComBpmInstanceCardNew.vue';
import ComBpmInstanceIndexHeaderCard from './ComBpmInstanceIndexHeaderCard.vue';
import ComBpmInstanceIndexSidebar from './ComBpmInstanceIndexSidebar.vue';
import ComBpmInstanceIndexFlowChart from './ComBpmInstanceIndexFlowChart.vue';
import ComBpmInstanceIndexList from './ComBpmInstanceIndexList.vue';
import ComBpmInstanceIndexTable from './ComBpmInstanceIndexTable.vue';
import ComBpmInstanceFilters from './ComBpmInstanceFilters.vue';
import { merge } from 'lodash';
import { useI18n } from 'vue-i18n';

interface CardInterface {
  label: string;
  number: number;
  unread_count?: number;
  key: string;
  // color: string;
  api: VApi<Instance>;
  // radiusColor: string[];
  style: VObject;
  icon: VObject;
}

interface MenuInterface {
  key: string;
  label: string;
  number: number;
  color: string;
  query: VObject;
}

interface ThreeLevelStatInterface {
  instance_stat_count: { [key: string]: number };
  workflow_id_count: { [key: string]: number };
  workflow_id_name: { [key: string]: string };
  workflow_modul_count: { [key: string]: number };
  mod_id_name: { [key: number]: string };
  mod_id_count: { [key: number]: number };
}

const ComBpmInstancesIndex = defineComponent({
  name: 'ComBpmInstancesIndex',
  components: {
    ComBpmInstanceCard,
    ComBpmInstanceIndexHeaderCard,
    ComBpmInstanceIndexSidebar,
    ComBpmInstanceIndexFlowChart,
    ComBpmInstanceIndexList,
    ComBpmInstanceIndexTable,
    ComBpmInstanceFilters,
  },
  props: {
    title: { type: String, default: '动态' },
    moduls: { type: Array as PropType<string[]>, default: null },
    params: { type: Object, default: () => ({}) },
    indexMode: { type: String, default: 'list' },
  },
  setup(props) {
    const createdApi = new BpmUserCreatedInstances();
    const approvingApi = new BpmUserApprovingInstances();
    const approvedApi = new BpmUserApprovedInstances();
    const notifiedApi = new BpmUserNotifiedInstances();

    const unreadApi = new BpmUserUnreadInstances();

    const { t } = useI18n();

    const cards: Ref<CardInterface[]> = ref([
      {
        label: t('bpm.ComBpmInstancesIndex.card.unred'),
        number: 0,
        api: unreadApi,
        key: 'unread',
        style: {
          backgroundColor: '#FDF2F2',
          color: '#E02424',
        },
        icon: {
          type: 'solid/mail',
          class: 'text-red-600',
        },
      },
      {
        label: t('bpm.ComBpmInstancesIndex.card.wait'),
        number: 0,
        api: approvingApi,
        key: 'approving',
        style: {
          backgroundColor: '#F0F5FE',
        },
        icon: {
          type: 'solid/document-text',
          class: 'text-blue-600',
        },
      },
      {
        label: t('bpm.ComBpmInstancesIndex.card.initiated'),
        number: 0,
        api: createdApi,
        key: 'created',
        style: {
          backgroundColor: '#FFF5EF',
        },
        icon: {
          type: 'solid/users',
          class: 'text-orange-400',
        },
      },
      {
        label: t('bpm.ComBpmInstancesIndex.card.processed'),
        number: 0,
        api: approvedApi,
        key: 'approved',
        style: {
          backgroundColor: '#EBF9FA',
        },
        icon: {
          type: 'solid/archive',
          class: 'text-teal-400',
        },
      },
      {
        label: t('bpm.ComBpmInstancesIndex.card.carbon'),
        number: 0,
        api: notifiedApi,
        key: 'notified',
        style: {
          backgroundColor: '#F0EFFB',
        },
        icon: {
          type: 'solid/save',
          class: 'text-indigo-600',
        },
      },
    ]);

    const activeCard = ref<any>(cards.value[1]);

    const store = computed(() => {
      return new VStore(activeCard.value.api, InstanceModel as any, { extra: { t } });
    });

    const statistics = ref<any>({});
    const fetchStatistic = () => {
      activeCard.value.api
        .sendCollectionAction('statistic', { params: props.params })
        .then((res: VObject) => {
          const { data } = res;
          cardAssignment(data);
          statistics.value = data;
        });
    };

    const cardAssignment = (data: ThreeLevelStatInterface) => {
      cards.value[0].number = data.instance_stat_count.unread;
      cards.value[1].number = data.instance_stat_count.approving;
      cards.value[2].number = data.instance_stat_count.created;
      cards.value[3].number = data.instance_stat_count.approved;
      cards.value[4].number = data.instance_stat_count.notified;

      cards.value[1].unread_count = data.instance_stat_count.approving_unread_count;
      cards.value[4].unread_count = data.instance_stat_count.notified_unread_count;
    };

    const searcherQuery = ref<VObject>({});
    const workflowIds = ref<any>([]);
    const onWorkflowIdsChange = (ids: any) => {
      workflowIds.value = ids;
    };

    const filterQuery = ref<VObject>({});
    const onFilterChange = (value: VObject) => {
      filterQuery.value = value;
    };

    const temporaryQuery = computed(() =>
      merge({}, props.params, {
        q: {
          workflow_modul_in: props.moduls,
          workflow_id_in: workflowIds.value,
          ...searcherQuery.value,
        },
        sub_q: {
          ...filterQuery.value,
          s: [currentSortKey.value],
        },
      }),
    );

    const sidebarRef = ref<any>(null);
    const filterRef = ref<any>(null);

    const onCardClick = async (item: CardInterface) => {
      activeCard.value = item;
      sidebarRef.value?.reset();
      filterRef.value?.clearFilters();
      fetchStatistic();
    };

    const indexModes = [
      {
        icon: 'outline/table',
        label: t('bpm.ComBpmInstancesIndex.modes.talbe'),
        key: 'table',
        component: 'ComBpmInstanceIndexTable',
        export: true,
      },
      {
        icon: 'solid/menu',
        label: t('bpm.ComBpmInstancesIndex.modes.list'),
        key: 'list',
        component: 'ComBpmInstanceIndexList',
        export: true,
      },
      {
        icon: 'solid/template',
        label: t('bpm.ComBpmInstancesIndex.modes.card'),
        key: 'flowchart',
        component: 'ComBpmInstanceIndexFlowChart',
        export: false,
      },
    ];

    const activeIndexModeKey = ref(props.indexMode || 'table');
    const activeIndexMode = computed(() => {
      return indexModes.find((mode: { key: string }) => mode.key === activeIndexModeKey.value);
    });

    const radioStyle = {
      display: 'flex',
      padding: '8px 12px',
      color: '#111928',
    };

    fetchStatistic();

    const filterFields = [
      {
        key: 'state',
        label: t('bpm.ComBpmInstancesIndex.filterfileds.status'),
        type: 'select',
        mode: 'multiple',
        options: [
          { label: t('bpm.ComBpmInstancesIndex.filterfileds.inprogress'), value: 'processing' },
          { label: t('bpm.ComBpmInstancesIndex.filterfileds.waitsubmitted'), value: 'created' },
          { label: t('bpm.ComBpmInstancesIndex.filterfileds.completed'), value: 'completed' },
          { label: t('bpm.ComBpmInstancesIndex.filterfileds.terminated'), value: 'terminated' },
        ],
      },
      {
        key: 'creator_name_or_creator_account',
        label: t('bpm.ComBpmInstancesIndex.filterfileds.initiator'),
        type: 'text',
      },
      {
        key: 'last_token_attr.name',
        label: t('bpm.ComBpmInstancesIndex.filterfileds.currentstate'),
        type: 'text',
      },
      {
        key: 'created_at',
        label: t('bpm.ComBpmInstancesIndex.filterfileds.initiationtime'),
        type: 'datetime',
      },
    ];

    const componentRef = ref<any>(null);
    const onExport = () => {
      componentRef.value?.onExport();
    };

    const currentSortKey = ref('level asc');
    const currentSort = computed(() => {
      return sortFilters.find((sort: any) => sort.key === currentSortKey.value) || {};
    });
    const sortFilters = [
      {
        label: t('bpm.ComBpmInstancesIndex.sortfilter.levelformtoptobottom'),
        key: 'level asc',
      },
      {
        label: t('bpm.ComBpmInstancesIndex.sortfilter.initiationfromtoold'),
        key: 'created_at desc',
      },
      {
        label: t('bpm.ComBpmInstancesIndex.sortfilter.initiationoldtofrom'),
        key: 'created_at asc',
      },
      {
        label: t('bpm.ComBpmInstancesIndex.sortfilter.lasttimefromtoold'),
        key: 'action_at desc',
      },
      {
        label: t('bpm.ComBpmInstancesIndex.sortfilter.lastimeoldtofrom'),
        key: 'action_at asc',
      },
    ];

    return {
      ...toRefs(props),
      cards,
      activeCard,

      onCardClick,
      onWorkflowIdsChange,
      onFilterChange,
      store,

      indexModes,
      activeIndexModeKey,
      activeIndexMode,
      radioStyle,

      searcherQuery,
      temporaryQuery,

      statistics,
      filterFields,
      sidebarRef,
      filterRef,
      componentRef,
      onExport,

      sortFilters,
      currentSortKey,
      currentSort,

      fetchStatistic,
      t,
    };
  },
});

export default ComBpmInstancesIndex;
</script>

<template lang="pug">
.com-bpm-instance-index.h-full.w-full.flex.flex-col
  .text-gray-900.font-medium.text-lg {{ title }}
  .mb-2.mt-3.mb-4.grid.grid-cols-5.gap-4.w-full.min-w-200
    ComBpmInstanceIndexHeaderCard(
      @click.native='onCardClick(item)',
      :active='item.label === activeCard.label',
      :record='item'
      v-for='item in cards'
    )
  .content.h-0.flex.flex-grow.bg-gray-50.p-4.gap-x-4
    .left.flex-shrink-0.flex.flex-col
      ComBpmInstanceIndexSidebar(ref='sidebarRef', :statistics='statistics', @onWorkflowIdsChange='onWorkflowIdsChange')
    .center.h-full.bg-white.rounded-lg.px-4.py-3.flex.flex-col.flex-grow.w-0
      .flex.flex-end.mb-4
        TaSearcher.mr-6(
          v-model:value='searcherQuery',
          :variables='["seq", "creator_orgs_name", "creator_name", "creator_account", "summary"]',
          :tips="t('bpm.ComBpmInstancesIndex.search')",
          :placeholder="t('bpm.ComBpmInstancesIndex.placeholder')",
        )
        a-tooltip(color='white', placement='bottom', :open='true')
          .flex.items-center.bg-white.rounded-lg.border.border-gray-200.text-gray-900.py-2.px-4.cursor-pointer.mr-2(:class='{ "primary-color": currentSort.key }')
            TaIcon.w-5.h-5.mr-2(type='outline/menu-alt-2')
            .text-sm {{ currentSort.label || t('bpm.ComBpmInstancesIndex.sort') }}
          template(#title)
            a-radio-group(v-model:value='currentSortKey')
              a-radio(v-for='sort in sortFilters', :style='radioStyle' :value='sort.key') {{ sort.label }}
        ComBpmInstanceFilters(ref='filterRef', :fields='filterFields', @filtersChanged='onFilterChange')
        .flex.items-center.bg-white.rounded-lg.border.border-gray-200.text-gray-900.py-2.px-4.ml-2.cursor-pointer(
          v-if='activeIndexMode.export'
          @click='onExport()'
        )
          TaIcon.w-4.h-4(type='outline/dots-horizontal')
          .ml-2 {{t('bpm.ComBpmInstancesIndex.expert')}}
        a-tooltip(color='white', placement='bottom', :open='true')
          .flex.items-center.primary-color.cursor-pointer.ml-6
            TaIcon.w-5.h-5.mr-1(:type='activeIndexMode.icon')
            .font-sm {{ activeIndexMode.label }}
          template(#title)
            a-radio-group(v-model:value='activeIndexModeKey')
              a-radio(v-for='mode in indexModes', :style='radioStyle' :value='mode.key') {{ mode.label }}
      component(
        ref='componentRef',
        :is='activeIndexMode.component',
        :store='store',
        :params='temporaryQuery'
        @silenceRefresh='fetchStatistic()'
      )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-index
  >>>.searcher
    height: 40px
    border: 1px solid #E5E7EB
    border-radius: 8px
    &.focus
      background: transparent
      .prefix-icon
        margin-left: 0
  .primary-color
    color: $primary-color
  >>>.ta-index-list .pagination-list .list-view__pagination
    margin-bottom: 0px
</style>
