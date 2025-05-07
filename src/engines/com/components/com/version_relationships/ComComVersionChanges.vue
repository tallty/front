<script lang="ts">
import { defineComponent, toRefs } from 'vue';

const ComComVersionChanges = defineComponent({
  name: 'ComComVersionChanges',
  props: {
    changes: { type: Object, required: true, default: () => {} },
    fieldsMap: { type: Object, required: false, default: () => {} },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});

export default ComComVersionChanges;
</script>

<template lang="pug">
.com-com-version-changes
  table.border-collapse.border.border-slate-400.table-auto.w-full
    thead
      tr
        th.border.border-slate-300.p-4 变更字段
        th.border.border-slate-300.p-4 变更前
        th.border.border-slate-300.p-4 变更后
    tbody
      tr(v-for='(value, key) in changes')
        th.border.border-slate-300.p-4 {{ fieldsMap[key]?.label || key }}
        td.border.border-slate-300.p-4.break-all
          span(v-if='fieldsMap[key]?.type == "text"', v-html='value[0]')
          span(v-else) {{ value[0] }}
        td.border.border-slate-300.p-4.break-all
          span(v-if='fieldsMap[key]?.type == "text"', v-html='value[1]')
          span(v-else) {{ value[1] }}
</template>

<style lang="stylus" scoped></style>
