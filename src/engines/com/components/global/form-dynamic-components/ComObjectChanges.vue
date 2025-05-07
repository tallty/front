<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';

export default defineComponent({
  name: 'ComObjectChanges',
  components: { VueJsonPretty },
  props: {
    item: { type: Object as PropType<TaTemplateFormItem>, required: true },
    value: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});
</script>

<template lang="pug">
.com-object-changes
  table.border-collapse.border.border-slate-400.table-auto.w-full
    thead
      tr
        th.border.border-slate-300.p-4 变更字段
        th.border.border-slate-300.p-4 变更前
        th.border.border-slate-300.p-4 变更后
    tbody
      tr(v-for='(val, key) in value')
        th.border.border-slate-300.p-4 {{ key }}
        td.border.border-slate-300.p-4.break-all
          vue-json-pretty(:data='val[0]' v-if='typeof val[0] === "object"')
          span(v-else) {{ val[0] }}
        td.border.border-slate-300.p-4.break-all
          vue-json-pretty(:data='val[1]' v-if='typeof val[1] === "object"')
          span(v-else) {{ val[1] }}
</template>
