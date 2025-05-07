<template lang="pug">
.app_login.bg-no-repeat.bg-cover.bg-center.flex.items-center.justify-center(:style='{backgroundImage:`url(${bg})`}')
  .app_login_inner.flex.items-center.justify-between 
    .login_left.flex.flex-col.justify-between 
      .text-2xl.speech_color {{ speech }}
      .w-full.flex.justify-center.icon 
        img(:src='icon')
      .flex.flex-col.items-center.speech_color
        .text-lg {{ footer }}
        .text-base.mt-1.opacity-80 {{ footer_subtitle }}

    .login_right.flex.items-center.px-10
      .login_right_inner.px-10.py-11(:class='primaryBG')
        ComLoginInner(:theme='theme')
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import ComLoginInner from '../../components/login/ComLoginInner.vue';

const LoginView = defineComponent({
  name: 'LoginView',
  components: {
    ComLoginInner,
  },
  setup(props) {
    const bg = computed(() => {
      return process.env.VUE_APP_LOGIN_REDIRECT_BG;
    });
    const icon = computed(() => {
      return process.env.VUE_APP_LOGIN_ICON;
    });
    const speech = computed(() => {
      return process.env.VUE_APP_LOGIN_SPEECH;
    });
    const footer = computed(() => {
      return process.env.VUE_APP_LOGIN_FOOTER_TITLE;
    });
    const footer_subtitle = computed(() => {
      return process.env.VUE_APP_LOGIN_FOOTER_SUBTITLE;
    });

    const sppechColor = computed(() => {
      return process.env?.VUE_APP_LOGIN_MODAL_SPEECH_COLOR || 'white';
    });

    const theme = computed(() => {
      return process.env.VUE_APP_LOGIN_THEME_MODE || 'LIGHT';
    });

    const primaryBG = computed(() => {
      return theme.value === 'LIGHT' ? 'bg-white' : 'bg-[#374151]';
    });

    return {
      ...toRefs(props),
      bg,
      speech,
      footer,
      footer_subtitle,
      icon,
      sppechColor,
      primaryBG,
      theme,
    };
  },
});
export default LoginView;
</script>
<style lang="stylus">
.app_login
  width 100vw
  height 100vh
  padding 160px
  .speech_color
    color v-bind(sppechColor)
  .app_login_inner
    width 100%
    min-width 1080px
    max-width 1600px
    height 800px
    min-height 800px
    .login_left,.login_right
      width 50%
      height 100%
    .login_left
      .icon
        img
          width 40%
    .login_right
      .login_right_inner
        width 100%
        height 752px
        border-radius 8px
</style>
