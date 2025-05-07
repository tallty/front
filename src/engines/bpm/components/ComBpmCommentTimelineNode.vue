<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, toRefs } from 'vue';

const ComBpmCommentTimelineNode = defineComponent({
  name: 'ComBpmCommentTimelineNode',
  components: {},
  props: {
    comment: { type: Object, required: true },
  },
  setup(props) {
    return {
      ...toRefs(props),
      dayjs,
    };
  },
});
export default ComBpmCommentTimelineNode;
</script>

<template lang="pug">
a-timeline-item.com-bpm-comment-timeline-noe.mt-2
  .title.flex.w-full.justify-between.items-center
    .left.text-base.font-medium
      span.text-blue-500.pr-1 {{ comment.user?.name }}
      span.text-gray-500 发表了评论
    .right.time.text-xs.font-regular.text-gray-400 {{ comment.createdAtStr || dayjs(comment.created_at).format('YYYY-MM-DD HH:mm') }}
  TaRichEditor.bg-gray-50(:value='comment.body', :disabled='true')
</template>

<style lang="stylus" scoped>
// .com-bpm-comment-timeline-noe
</style>
