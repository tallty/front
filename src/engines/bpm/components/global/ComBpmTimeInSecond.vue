<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';

const ComBpmTimeInSecond = defineComponent({
  name: 'ComBpmTimeInSecond',
  components: {},
  props: {
    value: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const localValue = computed({
      get(): number {
        const result = ratio.value ? Number(props.value) / ratio.value : 0;
        return Number(result.toFixed(2));
      },
      set(value: number) {
        emit('update:value', Math.round(value * ratio.value));
      },
    });

    const mode = ref<'day' | 'hour' | 'week' | 'month'>('day');

    const ratio = computed(() => {
      switch (mode.value) {
        case 'hour':
          return 60 * 60;
        case 'day':
          return 24 * 60 * 60;
        case 'week':
          return 24 * 60 * 60 * 7;
        case 'month':
          return 24 * 60 * 60 * 30;
        default:
          return 1;
      }
    });

    return {
      ...toRefs(props),
      localValue,
      mode,
    };
  },
});
export default ComBpmTimeInSecond;
</script>

<template lang="pug">
.com-bpm-time-in-second.flex.items-center
  template(v-if='!disabled')
    a-input-number(v-model:value='localValue')
  template(v-else)
    .mr-1 {{ localValue }}
  .w-20
    a-select(v-model:value='mode')
      a-select-option(value='hour') 小时
      a-select-option(value='day') 天
      a-select-option(value='week') 周
      a-select-option(value='month') 月
</template>

<style lang="stylus" scoped></style>
