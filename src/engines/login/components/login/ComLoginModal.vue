<template lang="pug">
.w-full.h-full.bg-cover.bg-center.rounded-lg.flex.flex-row.loginModalBG(:class='bgfilled ? "loginModalBG" : ""')
  .w-120.h-134.flex.flex-col.justify-between.p-8.bg-cover.bg-center.rounded-l-lg(:class='bgfilled ? "" : "loginModalBG"')
    .speech_color.text-xs {{ speech }} 
    .w-full.flex.justify-center.icon
      img(:src='icon' :style='{width: size}')
    .speech_color.flex.flex-col.items-center 
      .text-xs {{ footer }}
      .text-xs.mt-1.opacity-80.scale-90 {{ footer_subtitle }}

  .w-150.h-134.rounded-r-lg.px-18.pt-20.pb-12(:class='primaryBG')
    ComLoginModalInner(@onComplete='success' @cancel='cancel' :theme='theme')

</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import ComLoginModalInner from './ComLoginModalInner.vue';
import { useI18n } from 'vue-i18n';

const ComLoginModal = defineComponent({
  name: 'ComLoginModal',
  components: {
    ComLoginModalInner,
  },
  emits: ['onComplete', 'onCancel'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const bg = computed(() => {
      return `url(${process.env.VUE_APP_LOGIN_MODAL_BG})`;
    });

    const icon = computed(() => {
      return process.env.VUE_APP_LOGIN_ICON;
    });
    const size = computed(() => {
      return process?.env?.VUE_APP_LOGIN_ICON_SIZE || '50%';
    });
    const speech = computed(() => {
      if (process.env.VUE_APP_MENU_KEY === 'stte') {
        return t('login.stte.speech');
      }
      return process.env.VUE_APP_LOGIN_SPEECH;
    });
    const footer = computed(() => {
      return process.env.VUE_APP_LOGIN_FOOTER_TITLE;
    });
    const footer_subtitle = computed(() => {
      return process.env.VUE_APP_LOGIN_FOOTER_SUBTITLE;
    });
    const bgfilled = computed(() => {
      return process.env.VUE_APP_LOGIN_MODAL_BG_TYPE === 'FILL';
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
    const success = () => {
      emit('onComplete');
    };

    const cancel = () => {
      emit('onCancel');
    };

    return {
      ...toRefs(props),
      bg,
      speech,
      footer,
      footer_subtitle,
      icon,
      bgfilled,
      size,
      sppechColor,

      success,
      cancel,
      theme,
      primaryBG,
    };
  },
});
export default ComLoginModal;
</script>
<style lang="stylus" scoped>
.loginModalBG
  background-image v-bind(bg)
.speech_color
  color v-bind(sppechColor)
</style>
