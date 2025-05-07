<script lang="ts">
import { VObject } from '@/lib/vails';
import { computed, defineComponent, toRefs } from 'vue';

const ComBpmPlaceTokenTimelineDeliverNode = defineComponent({
  name: 'ComBpmPlaceTokenTimelineDeliverNode',
  components: {},
  props: {
    token: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const delivered = computed(() => props.token.state === 'completed');
    const deliver = computed(() => {
      const logs = props.token.operate_logs?.logs?.filter(
        (log: VObject) => log.action === 'complete',
      );
      return logs?.pop()?.user_name;
    });
    return {
      ...toRefs(props),
      delivered,
      deliver,
    };
  },
});
export default ComBpmPlaceTokenTimelineDeliverNode;
</script>

<template lang="pug">
.com-bpm-place-token-timeline-deliver-node.w-full.bg-gray-50.py-3.flex-col.flex.items-center.rounded
  .from-to.flex.items-center.flex-around.mb-5.w-full
    .from.text-base.font-medium.text-blue-gray-700 {{ token.operator_name || '暂无' }}
    .line
      template(v-if='delivered')
        img.h-2.w-10.mb-1(
          src='https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/public/%E7%AE%AD%E5%A4%B4%EF%BC%88%E7%BB%BF%EF%BC%89.png'
        )
        .text-xs.font-regular.text-blue-gray-500 已签收
      template(v-else)
        img.h-2.w-10.mb-1(
          src='https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/public/%E7%AE%AD%E5%A4%B4%EF%BC%88%E7%81%B0%EF%BC%89.png'
        )
        .text-xs.font-regular.text-blue-gray-500 送件中
    .to.text-base.font-medium.text-blue-gray-700 {{ token.extra_token_info?.activate_user?.name || '暂无' }}
  .info
    template(v-if='delivered')
      .text-xs.font-regular.text-gray-400.mb-3
        | 签收人：
        span.text-gray-700 {{ deliver || '暂无' }}
        span.text-gray-700(v-if='token.spendTimeStr') （耗时 {{ token.spendTimeStr.value }}）
      .text-xs.font-regular.text-gray-400
        | 送达时间：
        span.text-gray-700 {{ token.updatedStr.value }}
    template(v-else)
      .text-xs.font-regular.text-gray-400
        | 派件时间：
        span.text-gray-700 {{ token.createdStr.value }}
</template>

<style lang="stylus" scoped></style>
