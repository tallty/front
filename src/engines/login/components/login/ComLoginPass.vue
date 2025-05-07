<template lang="pug">
a-input-password(
  size='large',
  :value='localValue',
  :maxLength='maxLength',
  :placeholder= 'placeholder',
  @change='passChange'
)
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

const ComLoginPass = defineComponent({
  name: 'ComLoginPass',
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

    const passChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value.trim();
      localValue.value = value.replace(/[\u4e00-\u9fa5]|(^\s+)|(\s+$)/gi, '').replace(/[ ]/g, '');
    };
    return {
      ...toRefs(props),

      passChange,
      localValue,
    };
  },
});
export default ComLoginPass;
</script>
<style lang="stylus" scoped></style>
