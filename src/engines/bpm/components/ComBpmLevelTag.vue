<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

const ComBpmLevelTag = defineComponent({
  name: 'ComBpmLevelTag',
  components: {},
  props: {
    value: { type: String, default: '' },
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const colorAry: string[] = [
      'rgb(239, 68, 68)',
      'rgb(245, 158, 11)',
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(107, 114, 128)',
    ];

    const color = computed(() => {
      const index = (props.options?.level_option_labels || ['A', 'B', 'C', 'D']).indexOf(
        props.value,
      );
      return colorAry[index] || colorAry[colorAry.length - 1];
    });

    return {
      ...toRefs(props),
      color,
    };
  },
});
export default ComBpmLevelTag;
</script>

<template lang="pug">
.com-bpm-level-tag.rounded.text-white.px-2.text-lg(
  v-if='value',
  :style='{ backgroundColor: color }'
) {{ value }}
</template>

<style lang="stylus" scoped></style>
