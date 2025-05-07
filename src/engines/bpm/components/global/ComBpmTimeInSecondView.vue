<script lang="ts">
import { defineComponent, toRefs } from 'vue';

const ComBpmTimeInSecondView = defineComponent({
  name: 'ComBpmTimeInSecondView',
  components: {},
  props: {
    value: { type: Number, default: 0 },
    // disabled: { type: Boolean, default: false },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});
export default ComBpmTimeInSecondView;
</script>

<template lang="pug">
ComBpmTimeInSecond.com-bpm-time-in-second-view(:value='value', :disabled='true')
</template>

<style lang="stylus" scoped></style>
