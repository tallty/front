<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import ComBpmInstanceCard from './ComBpmInstanceCardNew.vue';
import { useI18n } from 'vue-i18n';

const ComBpmInstanceIndexList = defineComponent({
  name: 'ComBpmInstanceIndexList',
  components: {
    ComBpmInstanceCard,
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
        recordName: t('bpm.ComBpmInstanceIndexList.name'),
        store: props.store,
        showCount: true,
        params: props.params,
        list: {
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

    const exporter = ref<any>(null);
    const onExport = () => {
      exporter.value?.onHeaders();
    };

    return {
      config,
      taIndexView,
      onInstanceFresh,

      exporter,
      onExport,
    };
  },
});

export default ComBpmInstanceIndexList;
</script>

<template lang="pug">
.com-bpm-instance-index-list.h-full
  TaIndexView(
    ref='taIndexView',
    :config='config',
    :showHeader='false',
  )
    template(#card='{ record }')
      slot(name='card', :record='record', :fresh='onInstanceFresh')
        .bpm-card.py-2.border-b.border-gray-100
          ComBpmInstanceCard(:record='record', @dialogClose='onInstanceFresh')
  
  TaExport.export-button(
    ref='exporter',
    :store='store',
  )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-index-list
  .export-button
    display: none
  >>>.ta-index-list .item:first-child .bpm-card
    padding-top: 0
  >>>.ta-index-list .item:last-child .bpm-card
    padding-bottom: 0
    border-bottom: none;
</style>
