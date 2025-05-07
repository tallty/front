<script lang="ts">
import { defineComponent, PropType, toRefs, computed } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';

export default defineComponent({
  name: 'ComPrettyJson',
  components: { VueJsonPretty },
  props: {
    item: { type: Object as PropType<TaTemplateFormItem>, required: true },
    value: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const localValue = computed({
      get: () => props.value,
      set: value => emit('update:value', value),
    });
    return {
      ...toRefs(props),
      localValue,
    };
  },
});
</script>

<template lang="pug">
.com-pretty-json
  vue-json-pretty(:data='value' v-if='disabled')
  vue-json-pretty(v-model:data='localValue', :editable='true' v-else)
</template>
