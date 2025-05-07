<script lang="ts">
import { defineComponent, toRefs, computed, ref } from 'vue';

export default defineComponent({
  name: 'ComPermitTanentPicker',
  props: {
    value: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const localValue = computed({
      get: () => props.value,
      set: val => emit('update:value', val),
    });

    const tableItems = [
      {
        name: 'ID',
        type: 'string',
        search: true,
        data_index: 'id',
      },
      {
        name: '租户名称',
        type: 'string',
        search: true,
        data_index: 'name',
      },
      {
        name: '租户标识',
        type: 'string',
        search: true,
        data_index: 'code',
      },
    ];

    const onUpdateValue = (value: any) => {
      if (value) {
        localValue.value.resource_type = 'Tanent';
      } else {
        localValue.value.resource_type = null;
      }
    };

    return {
      ...toRefs(props),
      tableItems,
      localValue,
      onUpdateValue,
    };
  },
});
</script>

<template lang="pug">
.com-permit-tanent-picker
  TaApiSingleField(
    :disabled='disabled',
    v-model:value='localValue.resource_id',
    @update:value='onUpdateValue',
    path='/res/admin/tanents',
    :tableItems='tableItems',
  )
</template>
