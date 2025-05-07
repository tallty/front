<script lang="ts">
import { defineComponent } from 'vue';

const ComBpmInstanceIndexHeaderCard2 = defineComponent({
  name: 'ComBpmInstanceIndexHeaderCard2',
  props: {
    record: { type: Object, required: true },
    active: { type: Boolean },
  },
});

export default ComBpmInstanceIndexHeaderCard2;
</script>

<template lang="pug">
.apprival-card-box2(:style='active ? "border: 1px solid white" : ""')
  .content
    .flex.whitespace-nowrap
      .label {{ record.label }}
      .w-2.text-center(v-if='record.number') ·
      .label(v-if='record.number') {{ record.number }}
    .number.ml-2(:style='record.color ? `color:${record.color}` : ""') {{ record.undo_number }}

  .radius-box
    .radius.radius_0(:style='{ background: record.radiusColor[0] }')
    .radius.radius_1(:style='{ background: record.radiusColor[1] }')
    .radius_sm(v-if='record.radiusColor?.[2]', :style='{ background: record.radiusColor[2] }')
  .active-icon-box(v-show='active')
    .line
    TaIcon.down-icon(type='CaretDownOutlined')
</template>

<style lang="stylus" scoped>
.apprival-card-box2
  box-shadow 0px 0px 8px 0px rgba(0, 0, 0, 0.08)
.apprival-card-box2:hover
  border 1px solid $primary-color
  border-radius 2px
.apprival-card-box2
  background #fff
  height 48px
  cursor pointer
  position relative
  border-radius 4px
  .content
    height 100%
    display flex
    justify-content space-around
    align-items center
    .label
      font-size 14px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      z-index 2
    .number
      font-size 22px
      font-family PingFangSC-Semibold, PingFang SC
      font-weight 600
      z-index 2
  .radius-box
    position absolute
    width 100%
    height 100%
    z-index 1
    border-radius 4px
    top 0
    overflow hidden
    .radius
      width 60px
      height 60px
      position absolute
      right 0
      top 0
      border-radius 50%
    .radius_sm
      width 20px
      height 20px
      position absolute
      left 13px
      top 20px
      opacity 0.1
      border-radius 50%
    .radius_0
      top 5px
      right -28px
      opacity 0.3
    .radius_1
      top 27px
      right 15px
      opacity 0.15
  .active-icon-box
    display flex
    width 100%
    position absolute
    flex-direction column
    .line
      height 2px
      width calc(100% + 2px)
      background $primary-color
    .down-icon
      color $primary-color
      position relative
      top -4px
      font-size 10px
</style>
