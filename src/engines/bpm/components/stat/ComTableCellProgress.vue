<script lang='ts'>
import { ref, defineComponent, toRefs, computed } from 'vue';

const ComTableCellProgress = defineComponent({
  name: 'ComTableCellProgress',
  components: {},
  props: {
    data: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const percent = computed(() => {
      if (Number(props.data.text) === Infinity) {
        return 0
      }
      return Number(props.data.text) ? (Number(props.data.text) * 100).toFixed(1) : 0
    })
    return {
      ...toRefs(props),
      percent,
    };
  },
});
export default ComTableCellProgress;
</script>

<template lang="pug">
.com-table-cell-progress
  a-progress(
    :percent='percent',
    size='small',
    strokeColor='#FF8A4C',
    :status='`${percent>=100?"exception":""}`',
  )
</template>

<style lang="stylus" scoped></style>
