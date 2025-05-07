<script lang="ts">
import { VStore } from '@/lib/vails';
import { cloneDeep, merge } from 'lodash';
import { defineComponent, computed, toRefs } from 'vue';
import ComBpmInstanceFlowList from './ComBpmInstanceFlowList.vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import { useI18n } from 'vue-i18n';

const ComBpmInstanceIndexFlowChart = defineComponent({
  name: 'ComBpmInstanceIndexFlowChart',
  components: {
    ComBpmInstanceFlowList,
  },
  props: {
    store: { type: Object, required: true },
    params: { type: Object, default: () => ({}) },
  },
  emits: ['silenceRefresh'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const storeArr = computed(() => [
      {
        label: t('bpm.ComBpmInstanceIndexFlowChart.processing'),
        number: 0,
        key: 'processing',
        store: new VStore(cloneDeep(props.store.api), InstanceModel),
        params: merge({ q: { state_eq: 'processing' } }, props.params),
      },
      {
        label: t('bpm.ComBpmInstanceIndexFlowChart.completed'),
        number: 0,
        key: 'completed',
        store: new VStore(cloneDeep(props.store.api), InstanceModel),
        params: merge({ q: { state_eq: 'completed' } }, props.params),
      },
      {
        label: t('bpm.ComBpmInstanceIndexFlowChart.terminated'),
        number: 0,
        key: 'terminated',
        store: new VStore(cloneDeep(props.store.api), InstanceModel),
        params: merge({ q: { state_eq: 'terminated' } }, props.params),
      },
      {
        label: t('bpm.ComBpmInstanceIndexFlowChart.created'),
        number: 0,
        key: 'created',
        store: new VStore(cloneDeep(props.store.api), InstanceModel),
        params: merge({ q: { state_eq: 'created' } }, props.params),
      },
    ]);

    const onSilenceRefresh = () => {
      emit('silenceRefresh');
    };

    return {
      ...toRefs(props),
      storeArr,
      onSilenceRefresh,
    };
  },
});

export default ComBpmInstanceIndexFlowChart;
</script>

<template lang="pug">
.com-bpm-instance-index-flow-chart.h-full.w-full
  .grid.grid-cols-4.gap-x-4.h-full
    .bg-gray-50.rounded-lg(v-for='(item, index) in storeArr')
      ComBpmInstanceFlowList(
        :store='item.store',
        :label='item.label',
        :params='item.params',
        @silenceRefresh='onSilenceRefresh()'
      )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-index-flow-chart
  >>> .empty-placeholder
    display none
  >>>.ta-index-view .ta-index-view-actions
    display: none !important
>>>.ta-index-list .scroll-list
  &::-webkit-scrollbar
    display: none
  -ms-overflow-style: none;
  scrollbar-width: none;
</style>
