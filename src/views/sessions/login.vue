<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import ComLoginBackground from '@/engines/login/components/ComLoginBackground.vue';
const Login = defineComponent({
  name: 'Login',
  components: { ComLoginBackground },
  props: {
    value: { type: String, default: 'copy' },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});
export default Login;
</script>

<template lang="pug">
.login-box
  ComLoginBackground(
    :background='`url(https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/plan-mobile/login/%E9%A1%B5%E9%9D%A2bg.png)`',
    :leftIcon='`none`',
    :tabs="[{key:'verify',label:'快速登录'},{key:'password',label:'密码登录'}]",
    :innerBg='`url(https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/plan-mobile/login/%E5%8D%A1%E7%89%87bg%20%281%29.png)`'
  )
</template>

<style lang="stylus" scoped>
.login-box
  width 100vw
  height 100vh
</style>
