<script lang="ts">
import useAutoNavigate from '@/engines/tofu/components/useAutoNavigate';
import { VObject } from '@/lib/vails';
import { message } from 'ant-design-vue';
import {
  PropType,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { OauthAuthorizeApi } from '../../apis/oauth/authorize.api';
import { AuthAppOptions } from '../../types/model';
import ComLoginInput from './ComLoginInput.vue';
import ComNewLoginLeft from './ComNewLoginLeft.vue';
import {
  NewLoginTab,
  TabKey,
  User,
  alreadyLogin,
  convertToCssVariable,
  passwordLogin,
  qrcodeUtils,
  verifyLogin,
  verifyPassword,
} from './useLoginCfg';

const ComNewLogin = defineComponent({
  name: 'ComNewLogin',
  components: { ComLoginInput, ComNewLoginLeft },
  props: {
    appId: { type: String, default: null },
    appName: { type: String, default: '铁塔站房综合管理系统' },
    slogan: { type: String, default: '' },
    loginBgConfig: { type: Object, required: true },
    hasPrivate: { type: Boolean, default: false }, //是否有隐私协议
    tabs: {
      type: Array as PropType<NewLoginTab[]>,
      default: () => [
        {
          name: '密码登录',
          key: 'password',
        },
      ],
    },
    wechatAppId: { type: String, default: null },
    needOnSuccess: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const isLoading = ref(false);
    //路由相关
    const router = useRouter();
    const route = useRoute();
    const { tofuAutoNavigate } = useAutoNavigate();
    //tab部分
    const activeTabKey = ref<TabKey>(props.tabs[0].key);
    const changeTab = (key: TabKey) => {
      activeTabKey.value = key;
      if (key === TabKey.QRCODE) {
        loginStrategy[TabKey.QRCODE]();
      } else {
        openid.value = null;
        clearQrcodeLogin();
      }
    };

    //多App
    const apps = ref<AuthAppOptions[]>([]);
    const appOptions = computed(() =>
      apps.value.map((app: AuthAppOptions) => ({ label: app.name, value: app.app_id })),
    );

    let onSelectAppIdPromiseResolve = ref();
    let onSelectAppIdPromiseReject = ref();
    const visibleSelectAppId = ref(false);

    const onSelectAppIdPromise = (options: AuthAppOptions[]) => {
      apps.value = options;
      return new Promise<string>((resolve, reject) => {
        onSelectAppIdPromiseResolve.value = resolve;
        onSelectAppIdPromiseReject.value = reject;

        visibleSelectAppId.value = true;
      });
    };

    //登录逻辑
    const user: User = reactive({
      app_id: props.appId,
      account: '',
      verify_code: '',
      password: '',
    });

    const onSuccess = (showMessage = true) => {
      if (showMessage) {
        message.success('登录成功');
      }
      if (props.needOnSuccess) {
        emit('onSuccess', tofuAutoNavigate)
        return;
      }
      if (user.password && !verifyPassword(user.password)) {
        message.error('您的密码过于简单，请重设密码', 10);
        router.replace('/res/user/info?login_again=true');
      } else if (route.query.response_type) {
        new OauthAuthorizeApi().success(route.query);
      } else if (route.query.redirect) {
        router.replace(decodeURIComponent(String(route.query.redirect || '')) || '/');
      } else {
        tofuAutoNavigate();
      }
    };
    const { openid, img, qrcodeLogin, clearQrcodeLogin } = qrcodeUtils(
      user,
      props.wechatAppId,
      onSelectAppIdPromise,
      onSuccess,
    );
    const loginStrategy: VObject = {
      [TabKey.VERIFY]: verifyLogin,
      [TabKey.PASSWORD]: passwordLogin,
      [TabKey.QRCODE]: qrcodeLogin,
    };
    const onSubmit = async () => {
      isLoading.value = true;
      loginStrategy[activeTabKey.value](user, onSelectAppIdPromise, onSuccess).finally(() => {
        isLoading.value = false;
      });
    };

    //config
    const bgConfigFormat = computed(() => {
      const cssVariableArr = Object.keys(props.loginBgConfig).map((cfg: string) => {
        return `${[convertToCssVariable(cfg)]}: ${props.loginBgConfig[cfg]}`;
      });
      return cssVariableArr.join(';');
    });
    //页面滚动禁止
    const handleScroll = (event: Event) => {
      event.preventDefault();
    };
    onMounted(() => {
      alreadyLogin(onSuccess);
      document.addEventListener('wheel', handleScroll, { passive: false });
    });
    onUnmounted(() => {
      document.removeEventListener('wheel', handleScroll);
    });
    return {
      ...toRefs(props),
      activeTabKey,
      changeTab,
      user,
      bgConfigFormat,
      appOptions,
      visibleSelectAppId,
      onSelectAppIdPromise,
      onSelectAppIdPromiseResolve,
      onSelectAppIdPromiseReject,
      onSubmit,
      isLoading,
      img,
      onSuccess,
    };
  },
});
export default ComNewLogin;
</script>

<template lang="pug">
.com-new-login.flex.items-center.justify-center(:style ='`${bgConfigFormat}`')
  .inner__wrapper.w-full.h-full.bg-white.min-h-535px.flex.overflow-hidden
    .inner__left.h-full
      slot(name='left')
        ComNewLoginLeft(:appName='appName',:slogan='slogan')
    .inner__right.py-16.px-10
      .login__tabs.flex.h-22px.items-center.mb-8
        .tab.text-sm.text-gray-500.mr-3.font-normal.select-none(
          v-for='tab in tabs',
          @click='changeTab(tab.key)',
          :class='{activeTab:tab.key === activeTabKey}'
        ) {{ tab.name }}
      .login__content.mb-17
        .password(v-if='activeTabKey === "password"')
          ComLoginInput.mb-3(v-model:value='user.account',:autofocus='true')
          ComLoginInput(
            v-model:value='user.password',
            :forId='2',
            placeholder="密码",
            :type='"password"'
          )
        .verify(v-else-if='activeTabKey === "verify"')
          ComLoginInput.mb-3(v-model:value='user.account',:autofocus='true')
          ComLoginInput(
            v-model:value='user.verify_code',
            :forId='2',
            :user='user',
            placeholder="验证码",
            :type='"verify"'
          )
        .qrcode.w-full.flex.flex-col.items-center(v-else-if='activeTabKey === "qrcode"')
          img.h-45.w-45(:src='img')
          .text-xs.text-gray-600.mt-1 打开微信扫一扫
      .login__submit.w-full
        .login__btn.w-full.h-11.flex.items-center.justify-center.mb-2.cursor-pointer(
          @click='onSubmit',
          v-if='activeTabKey !== "qrcode"'
        )
          .btn__text 登录
        .login__private.flex(v-if='hasPrivate')
          input.w-4.h-4(type='checkbox')
          .private__label.text-xs.select-none 我已阅读并同意《隐私条款》

  TaNoPaddingModal(
    v-if='visibleSelectAppId',
    v-model:visible='visibleSelectAppId',
    title='请选择',
    :bodyStyle='{ overflow: "auto", height: "fit-content" }',
    :modalContentStyle='{ "border-radius": "0.75rem", overflow: "hidden" }',
    @ok='() => onSelectAppIdPromiseResolve(user.app_id)',
    @cancel='onSelectAppIdPromiseReject'
  )
    .p-8
      a-radio-group(v-model:value='user.app_id', :options='appOptions')
</template>

<style lang="stylus" scoped>
.com-new-login
  width 100vw
  height 100vh
  padding 18vh 10vw
  background var(--main-bg)
  background-size cover
  .inner__wrapper
    border-radius 6px
    background var(--inner-bg)
    background-filter blur(10px)
    background-size cover
    .inner__left,.inner__right
      width 50%
    .inner__left
      @media (max-width:768px){
        display none
      }
    .inner__right
      @media (max-width:768px){
        width 100%
      }
      .login__tabs
        .tab
          line-height 22px
          transition font-size .3s
          cursor pointer
        .activeTab
          @apply font-medium text-base;
      .login__submit
        .login__btn
          border-radius .25rem
          background var(--btn-color,$primary-color)
          &:hover
            opacity .9
          .btn__text
            color white
        .login__private
          [type="checkbox"]
            margin-right 8px
            accent-color $primary-color
</style>
