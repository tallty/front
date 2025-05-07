<template lang="pug">
a-input(
  :value='localValue',
  :maxLength='maxLength',
  :placeholder= 'placeholder',
  @change='verifyChange'
)
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

const ComLoginCode = defineComponent({
  name: 'ComLoginCode',
  components: {},
  props: {
    value: { type: String, default: () => '' },
    placeholder: { type: String, default: () => '' },
    maxLength: { type: Number, default: () => 11 },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const localValue = computed({
      get: () => props.value,
      set: v => {
        emit('update:value', v);
      },
    });

    const verifyChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value.trim();
      localValue.value = value.replace(/\D/g, '');
    };
    return {
      ...toRefs(props),
      localValue,
      verifyChange,
    };
  },
});
export default ComLoginCode;
</script>
<style lang="stylus" scoped></style>
