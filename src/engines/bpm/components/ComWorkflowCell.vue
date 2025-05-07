<script lang="ts">
import { toRefs } from '@vue/reactivity';
import dayjs from 'dayjs';
import { defineComponent } from 'vue';

const ComWorkflowCell = defineComponent({
  name: 'ComWorkflowCell',
  props: {
    workflow: { type: Object, required: true },
  },
  setup(props) {
    return {
      dayjs,
      ...toRefs(props),
    };
  },
});

export default ComWorkflowCell;
</script>

<template lang="pug">
.com-workflow-cell
  img.icon(src='@/engines/bpm/assets/images/app.svg')
  .title.text-ellipsis {{ workflow.name }}
  .date.text-ellipsis 最新更新 {{ dayjs(workflow.updated_at).format('YYYY-MM-DD HH:mm') }}
</template>

<style lang="stylus" scoped>
.com-workflow-cell
  position relative
  margin-bottom 12px
  padding 15px 16px
  padding-left 68px
  height 70px
  border-radius 3px
  background rgba(250, 250, 250, 1)
  &:hover
    background rgba(255, 255, 255, 1)
    box-shadow 0px 0px 4px 0px rgba(0, 0, 0, 0.1)
    cursor pointer
    .title
      color #3DA8F5
  .icon
    position absolute
    top 15px
    left 16px
    width 40px
    height 40px
    background $primary-color
  .title
    height 20px
    color rgba(56, 56, 56, 1)
    font-weight 500
    font-size 14px
    line-height 20px
  .date
    height 20px
    color rgba(166, 166, 166, 1)
    font-weight 400
    font-size 13px
    line-height 20px
</style>
