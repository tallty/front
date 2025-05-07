<script lang='ts'>
import { defineComponent, toRefs } from 'vue';
const ComNewLoginLeft = defineComponent({
  name: 'ComNewLoginLeft',
  components: {},
  props: {
    appName: { type: String, default: "铁塔站房综合管理平台" },
    slogan: { type: String, default: "" },
  },
  setup(props) {
    const icon = process?.env.VUE_APP_ICON
    return {
      ...toRefs(props),
      icon,
    };
  },
});
export default ComNewLoginLeft;
</script>

<template lang="pug">
.com-new-login-left.p-12.flex.flex-col.justify-between.h-full.bg-cover.bg-center
  .welcome__text.text-color.text-xs.mb-10px.select-none Hi，欢迎来到{{ appName }}！
  .icon__and__name.flex.flex-col.items-center
    .app__icon.w-40.h-40.mb-6.bg-cover(:style='`background-image:${icon?`url(${icon})`:"var(--left-icon)"};`')
    .app__name.text-3xl.text-color.font-semibold(v-if='icon') {{ appName }}
  .slogan.flex.flex-col.items-center.select-none
    .text-xs.text-color.mb-1 数字化  |  智能化  |  生态化
    .sub-slogan.text-color {{ slogan }}
</template>

<style lang="stylus" scoped>
.com-new-login-left
  background-image var(--left-bg)
  .app__icon
    transition transform .5s
    transform scale(var(--icon-scale))
    &:hover
      transform scale(calc(var(--icon-scale,1) + 0.1))
  .text-color
    color var(--left-text-color,#000)
  .sub-slogan
    font-size 10px
    opacity 0.72
</style>
