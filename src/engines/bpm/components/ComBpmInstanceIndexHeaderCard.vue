<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';

const ComBpmInstanceIndexHeaderCard = defineComponent({
  name: 'ComBpmInstanceIndexHeaderCard',
  props: {
    record: { type: Object as PropType<InstanceModel>, required: true },
    active: { type: Boolean, default: false },
  },
});

export default ComBpmInstanceIndexHeaderCard;
</script>

<template lang="pug">
.card-item.p-3.rounded-lg.text-gray-900.cursor-pointer.min-w-38(
  :style='record.style',
  :class='{"active": active }',
)
  .flex.justify-between.items-center
    .flex.items-center
      .p-1.bg-white.rounded-2xl.mr-2.relative
        TaIcon.w-3.h-3(:type='record.icon.type', :class='record.icon.class')
        .rounded.w-2.h-2.bg-red-600.absolute(v-if='record.key == "unread" && record.number > 0', :style='{ top: "-2px", right: "-2px" }')
      .text-sm {{ record.label }}
    .font-bold.text-xl {{ record.number  }}
</template>

<style lang="stylus" scoped>
.card-item.active
  background: $primary-color !important
  color: #fff !important
</style>
