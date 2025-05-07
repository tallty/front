<script lang="ts">
import { defineComponent, toRefs } from 'vue';

const ComBpmFlowTreePoint = defineComponent({
  name: 'ComBpmFlowTreePoint',
  props: {
    type: {
      type: String,
      default: 'end',
      validator(val: string) {
        return ['start', 'end'].includes(val);
      },
    },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});

export default ComBpmFlowTreePoint;
</script>

<template lang="pug">
.flow-tree-point
  .flow-tree-point-text(v-if='type === "start"')
    | 开始
  .flow-tree-point-circle
  .flow-tree-point-text(v-if='type === "end"')
    | 结束
</template>

<style lang="stylus" scoped>
.flow-tree-point
  flex-shrink 0
  width 100%
  color rgba(25, 31, 37, 0.4)
  text-align left
  font-size 14px
  .flow-tree-point-circle
    margin auto
    width 10px
    height 10px
    border-radius 50%
    background #dbdcdc
  .flow-tree-point-text
    margin-top 5px
    text-align center
</style>
