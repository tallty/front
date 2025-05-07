<script lang="ts">
import { defineComponent, ref, computed, toRefs } from 'vue';
import ComBpmInstanceFlowCard from './ComBpmInstanceFlowCard.vue';

const ComBpmInstanceFlowList = defineComponent({
  name: 'ComBpmInstanceFlowList',
  components: {
    ComBpmInstanceFlowCard,
  },
  props: {
    store: { type: Object, required: true },
    label: { type: String, default: '' },
    params: { type: Object, default: () => ({}) },
  },
  emits: ['silenceRefresh'],
  setup(props, { emit }) {
    // const number = ref(0);
    const config = computed(() => {
      return {
        recordName: props.label,
        store: props.store,
        mode: 'list',
        scrollLoading: true,
        params: props.params,
        list: {
          gap: 0,
          splitCount: 1,
          scroll: {
            y: 'auto',
          },
        },
      };
    });

    const number = computed(() => {
      return props.store.totalCount.value > 0 ? props.store.totalCount.value : 0;
    });

    const taIndexView = ref<any>(null);
    const onInstanceFresh = () => {
      silenceRefresh();
      emit('silenceRefresh');
    };
    const silenceRefresh = () => {
      taIndexView.value.silenceRefresh();
    };

    return {
      ...toRefs(props),
      config,
      number,

      taIndexView,
      onInstanceFresh,
    };
  },
});

export default ComBpmInstanceFlowList;
</script>

<template lang="pug">
.com-bpm-instance-flow-list.h-full
  TaIndexView(ref='taIndexView', :config='config')
    template(#header)
      .flex.items-center.w-full.px-4.py-3.bg-gray-50.rounded-t-lg
        .text-gray-900.font-medim.text-sm.mr-1 {{ label }}
        .primary-color.font-bold {{ number }}
    template(#card='{ record }')
      ComBpmInstanceFlowCard.w-full.mb-2(:record='record', @dialogClose='onInstanceFresh()')
</template>

<style lang="stylus" scoped>
.com-bpm-instance-flow-list
  >>>.ta-index-list .scroll-list
    padding: 0 8px
</style>
