<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

const ComFlowTreeZoomBox = defineComponent({
  name: 'ComFlowTreeZoomBox',
  setup() {
    const rate = ref(100);
    const min = 30;

    const scale = computed(() => rate.value / 100);

    const zoomOut = () => {
      if (rate.value > min) {
        rate.value -= 10;
      }
    };

    const zoomIn = () => {
      rate.value += 10;
    };

    return {
      rate,
      scale,
      zoomOut,
      zoomIn,
    };
  },
});

export default ComFlowTreeZoomBox;
</script>

<template lang="pug">
.com-flow-tree-zoom-box
  .zoom
    .zoom-btn.zoom-out(@click='zoomOut')
    span.rate {{ rate }}%
    .zoom-btn.zoom-in(@click='zoomIn')
  .scale-box-wrapper
    .scale-box(:style='{ transform: `scale(${scale})` }')
      slot
</template>

<style lang="stylus" scoped>
.com-flow-tree-zoom-box
  // position absolute
  // top 0
  // right 0
  // bottom 0
  // left 0
  height 100%
  width 100%
  position relative
  .zoom
    position absolute
    top 20px
    right 40px
    z-index 10
    display flex
    justify-content space-between
    align-items center
    width 125px
    height 40px
    background #f5f5f7
    .zoom-btn
      width 30px
      height 30px
      background #fff
      background-size 100%
      background-repeat no-repeat
      color #c1c1cd
      cursor pointer
    .zoom-in
      background-image url('~@/engines/bpm/assets/images/plus.png')
    .zoom-out
      background-image url('~@/engines/bpm/assets/images/minus.png')
    .rate
      color #191f25
      font-size 12px
  .scale-box-wrapper
    height 100%
    width 100%
    overflow auto
    background-color #f5f5f7
    .scale-box
      position relative
      display flex
      flex-wrap wrap
      justify-content center
      align-items flex-start
      padding 60px 0
      min-width min-content
      width 100%
      background-color #f5f5f7
      transform scale(1)
      transform-origin 0px 0px 0px
</style>
