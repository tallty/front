<template lang="pug">
a-input(
  type='text',
  size='large',
  :value='localValue',
  :maxLength='maxLength',
  :placeholder='placeholder',
  @change='inputChange'
)
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

const ComLoginPhone = defineComponent({
  name: 'ComLoginPhone',
  components: {},
  props: {
    type: { type: String, default: () => 'normal' },
    value: { type: String, default: () => '' },
    maxLength: { type: Number, default: () => 11 },
    placeholder: { type: String, default: () => '' },
    onlyPhone: { type: Boolean, default: () => false },
    onlyEmail: { type: Boolean, default: () => false },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const localValue = computed({
      get: () => props.value,
      set: v => {
        emit('update:value', v);
      },
    });

    const inputChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
        .trim()
        .replace(/[\u4e00-\u9fa5]|(^\s+)|(\s+$)/gi, '')
        .replace(/[ ]/g, '');
      if (props.onlyPhone) {
        localValue.value = value.replace(/[^\d]/g, '');
      } else {
        localValue.value = value;
      }
    };

    return {
      ...toRefs(props),
      localValue,
      inputChange,
    };
  },
});
export default ComLoginPhone;
</script>
<style lang="stylus" scoped></style>
