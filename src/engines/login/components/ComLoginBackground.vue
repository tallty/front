<script lang="ts">
import { AuthSessionApi } from '@/engines/login/apis/auth/session.api';
import { SmsAuthRegistApi } from '@/engines/login/apis/sms_auth/regist_session.api';
import {
  QrcodeCheckApi,
  QrcodeCreateApi,
  QrcodeLoadApi,
  WechatLoginBindApi,
} from '@/engines/login/apis/wechat/index.api';
import { UPDATE_SESSION_ID } from '@/engines/login/store/user/actions';
import { VStore } from '@/lib/vails';
import store from '@/store';
import { message } from 'ant-design-vue';
import { PropType, computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VObject } from '../../../lib/vails/model/index';
import useAutoNavigate from '../../tofu/components/useAutoNavigate';
import { OauthAuthorizeApi } from '../apis/oauth/authorize.api';
import { AuthAppOptions } from '../types/model';
import ComLoginBackgroundSmsLogin from './ComLoginBackgroundSmsLogin.vue';

let ComDingScanLogin = null;
try {
  ComDingScanLogin = require('@/engines/dingtalk/components/dingtalk/ComDingScanLogin.vue').default;
} catch (e) {
  console.log(e);
}

interface BgConfigInterface {
  mainBg?: string;
  innerBg?: string;
  leftBg?: string;
  rightBg?: string;
}

interface IconConfigInterface {
  leftIcon?: string;
  lsize?: 'L' | 'M' | 'S';
}

interface SalutatoryConfigInterface {
  systemName?: string;
  ssize?: 'L' | 'M' | 'S';
  color?: string;
  title?: string;
}

const ComLoginBackground = defineComponent({
  name: 'ComLoginBackground',
  components: { ComLoginBackgroundSmsLogin, ComDingScanLogin },
  props: {
    bgConfig: { type: Object as PropType<BgConfigInterface>, default: () => {} },
    iconConfig: { type: Object as PropType<IconConfigInterface>, default: () => {} },
    salutatoryConfig: { type: Object as PropType<SalutatoryConfigInterface>, default: () => {} },
    tabs: { type: Array, default: () => [] },
    appId: { type: String, default: null },
    type: { type: String, default: null }, // 'estate_wechat'
  },
  setup(props) {
    const img = ref('');
    const ticket = ref('');
    const openid = ref();
    const isLoading = ref(false);
    const router = useRouter();

    const iconSize = {
      L: 'width:256px',
      M: 'width:180px',
      S: 'width:120px',
      N: 'width:80px',
    };

    const user = reactive({
      app_id: props.appId, //
      account: '',
      verify_code: '',
      password: '',
    });
    const timer = ref();
    const timerCount = ref(0);
    const timerFc = () => {
      timer.value = setTimeout(async () => {
        timerCount.value++;
        if (timerCount.value > 60 || timerCount.value === 0) {
          openWechatLogin();
        } else {
          checkScran();
        }
      }, 1000);
    };

    const checkScran = async () => {
      const res = await CodeCheck.sendMemberAction({
        id: 1,
        action: 'qrcode_login',
        config: {
          data: {
            ticket: ticket.value,
            app_id: user.app_id,
            wechat_app_id: props.type,
          },
        },
      });
      // console.log(res?.data, '============>');
      if (res.data.apps) {
        await onSelectAppIdPromise(res.data.apps).then(async appId => {
          user.app_id = appId;
          await checkScran();
        });
      }

      if (res.data?.auth_account || res.data?.openid) {
        cancelWechatLogin();
        if (res.data?.auth_account) {
          new AuthSessionApi().setToken(res.data.auth_account.token as string);
          store.dispatch(`user/${UPDATE_SESSION_ID}`, res.data.auth_account.id);
          // props.actions.complete();
          // resetUser();
          onSuccess();

          resetScan();
          return;
        }
        if (res.data?.openid) {
          openid.value = res.data?.openid;
          cancelWechatLogin();
        }
      } else {
        clearTime();
        timerFc();
      }
    };
    const resetScan = () => {
      openid.value = '';
      img.value = '';
    };
    const clearTime = () => {
      clearTimeout(timer.value);
    };
    const cancelWechatLogin = async () => {
      clearTime();
      timer.value = null;
      timerCount.value = 0;
      return Promise.resolve();
    };
    const openWechatLogin = async () => {
      openid.value = null;
      await cancelWechatLogin();
      const codeRes = await CodeStore.sendMemberAction({
        id: 1,
        action: 'qrcode_create_scene',
        config: {
          data: {
            scene_id_or_str: 'login',
            expire_seconds: 60,
          },
        },
      });
      const res = await CodeLoadtore.sendMemberAction({
        id: 1,
        action: 'qrcode_download',
        config: {
          data: {
            ticket: codeRes.data.ticket,
          },
          responseType: 'arraybuffer',
        },
      });
      const str = String.fromCharCode(...new Uint8Array(res.data));
      ticket.value = codeRes.data.ticket;
      img.value = `data:image/jpeg;base64,${window.btoa(str)}`;
      timerFc();
    };
    const CodeStore = new VStore(
      new QrcodeCreateApi({
        parents: [{ type: props.type }],
      }),
    );
    const CodeLoadtore = new VStore(
      new QrcodeLoadApi({
        parents: [{ type: props.type }],
      }),
    );
    const CodeCheck = new VStore(new QrcodeCheckApi());
    const smsDisabled = computed(() => !user.account);
    const onBind = async (callback: () => void) => {
      try {
        isLoading.value = true;
        await new SmsAuthRegistApi().login(user, onSelectAppIdPromise);
        const token = AuthSessionApi.token();
        console.log(AuthSessionApi.token(), 'token');
        await new WechatLoginBindApi().create({
          openid: openid.value,
          oauth_app_id: props.type,
          app_id: props.appId,
          token,
        });
        new AuthSessionApi().setToken(token);
        await callback();
        resetScan();
      } catch {
        console.log('catch');
      }
    };

    const isNeedVerify = ref(false);
    const isNeedVerifyPassword = ref(false);
    const VerifyCodeLogin = async (user: VObject) => {
      try {
        isLoading.value = true;
        await new SmsAuthRegistApi().login(user, onSelectAppIdPromise);
        onSuccess();
      } catch (error) {
        message.error('登录失败');
      }
      isLoading.value = false;
    };
    const passwordLogin = async (user: VObject) => {
      try {
        isLoading.value = true;
        await new AuthSessionApi({ encrypt: true }).login(user, onSelectAppIdPromise).then(res => {
          if (res.status === 201) {
            isNeedVerify.value = res.data?.need_verify;
            isNeedVerifyPassword.value = verifyPassword(user.password);
            if (isNeedVerify.value) {
              return message.warning('请验证手机号');
            }
            onSuccess();
          }
        });
        // onSuccess();
      } catch (error) {
        message.error('账号或密码不正确');
      } finally {
        isLoading.value = false;
      }
    };
    const secVerify = () => {
      VerifyCodeLogin(user).then(() => {
        if (isNeedVerifyPassword.value) {
          message.error('您的密码过于简单，请重设密码', 10);
          router.replace('/res/user/info?login_again=true');
        }
      });
    };
    const onSubmit = async () => {
      if (activeTabKey.value === 'password') {
        passwordLogin(user);
      } else {
        VerifyCodeLogin(user);
      }
    };
    const defaultTabs = computed(() =>
      props.tabs
        ? props.tabs
        : [
            { key: 'verify', label: '快速登录' },
            { key: 'password', label: '密码登录' },
            { key: 'weixin', label: '扫码登录' },
          ],
    );
    const activeTabKey = ref((defaultTabs.value?.[0] as any)?.key);
    const changeTab = (key: string) => {
      activeTabKey.value = key;
      if (key !== 'weixin') {
        openid.value = null;
        cancelWechatLogin();
      } else {
        openWechatLogin();
      }
    };
    const isAgree = ref(false);
    const toAgree = () => {
      isAgree.value = !isAgree.value;
    };

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

    const { tofuAutoNavigate } = useAutoNavigate();
    const route = useRoute();

    const onSuccess = (showMessage = true) => {
      if (showMessage) {
        message.success('登录成功');
      }
      if (user.password && !verifyPassword(user.password)) {
        message.error('您的密码过于简单，请重设密码', 10);
        router.replace('/res/user/info?login_again=true');
      } else if (route.query.response_type) {
        new OauthAuthorizeApi().success(route.query);
      } else if (route.query?.redirect) {
        router.replace(decodeURIComponent(String(route.query.redirect || '')) || '/');
      } else {
        tofuAutoNavigate();
      }
    };

    onMounted(() => {
      if (AuthSessionApi.token()) {
        try {
          new AuthSessionApi().sendCollectionAction('check').then(() => {
            onSuccess(false);
          });
        } catch (e) {
          new AuthSessionApi().setToken('');
        }
      }
    });

    const verifyPassword = (password: string) => {
      const reg =
        /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{8,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\W]{8,}$))/;
      if (reg.test(password)) {
        return true;
      }
      return false;
    };

    return {
      ...toRefs(props),
      defaultTabs,
      changeTab,
      img,
      activeTabKey,
      user,
      toAgree,
      isAgree,
      onBind,
      onSubmit,
      smsDisabled,
      appOptions,
      visibleSelectAppId,
      onSelectAppIdPromise,
      onSelectAppIdPromiseResolve,
      onSelectAppIdPromiseReject,
      onSuccess,
      iconSize,
      isNeedVerify,
      VerifyCodeLogin,
      secVerify,
    };
  },
});
export default ComLoginBackground;
</script>

<template lang="pug">
.com-login-background.bg-cover.flex.flex-col.items-center.justify-center(
  :style='`--bg:${bgConfig?.mainBg || "rgba(0, 0, 0, 0)"}`'
)
  slot(name='main-title', v-if='salutatoryConfig?.title')
    .main-title {{ salutatoryConfig.title }}
  .inner__bg.flex.bg-white.bg-cover(
    :style='`width:1080px;height:535px;background:${bgConfig?.innerBg};background-size:cover`'
  )
    .login__left.flex.items-center.bg-cover(
      :style='`--leftBg:${bgConfig?.leftBg};background-size:cover`'
    )
      slot(name='left')
        .box.bg-cover.w-full.h-full.p-12.text-white
          .welcome-text.text-sm.font-normal(class='mb-24.125', :style='`color:${salutatoryConfig?.color}`') Hi,欢迎来到{{ salutatoryConfig?.systemName }}!
          .flex.flex-col.items-center.justify-center.space-y-6
            .icon.bg-cover.border-radius.rounded-xl(
              :style='`background-image:${iconConfig?.leftIcon};${iconSize[iconConfig?.lsize || "S"]};aspect-ratio:1`'
            )
            slot(name='bottom-name')
              .text-3xl.font-semibold {{ salutatoryConfig?.systemName }}
            slot(name='bottom-text')
              .bottom-text.mx-auto(class='pt-24.125') 数字化 | 智能化 | 生态化
    .login__right.flex.items-center.bg-cover(:style='`background:${bgConfig?.rightBg}`')
      slot(name='right')
        .login__block.flex.flex-col.w-full.h-full
          slot(name='right-title')
          slot(name='tabs')
            .tabs.flex.gap-x-4.mb-8
              .tab.text-sm.font-semibold.text-gray-500.cursor-pointer.flex.items-center(
                v-for='tab in defaultTabs',
                @click='changeTab(tab.key)',
                :class='{ activeTab: activeTabKey === tab.key }'
              ) {{ tab.label }}
          slot(name='content')
            .verify.flex-grow(v-if='activeTabKey === "verify"')
              ComLoginBackgroundSmsLogin(
                v-model:user='user',
                :loading='isLoading',
                @submit='onSubmit'
              )
            .dingtalk.flex-grow(v-else-if='activeTabKey === "dingtalk"')
              ComDingScanLogin.mt-30(:user='user', @success='onSuccess')
            .password(v-else-if='activeTabKey === "password" && isNeedVerify')
              ComLoginBackgroundSmsLogin(
                v-model:user='user',
                :loading='isLoading',
                @submit='secVerify'
              )
            .password(v-else-if='activeTabKey === "password" && !isNeedVerify')
              a-form.login-form(:model='user', style='position: relative')
                a-form-item.form-item.bg-gray-100.rounded
                  a-input.form-item-input.h-11(
                    type='text',
                    size='large',
                    v-model:value='user.account',
                    :maxLength='30',
                    placeholder='请输入登录账号',
                    @pressEnter='onSubmit'
                  )
                a-form-item.form-item.bg-gray-100.rounded
                  a-input-password.form-item-password.h-11(
                    size='large',
                    v-model:value='user.password',
                    placeholder='密码',
                    @pressEnter='onSubmit'
                  )
                a-form-item.button-form-item
                  a-button.login-button.h-11(
                    type='primary',
                    @click='onSubmit',
                    @pressEnter='onSubmit',
                    :loading='isLoading'
                  )
                    | 登录
            .weiXin.flex-grow.flex.flex-col.items-center(v-else-if='activeTabKey === "weixin"')
              img.h-45.w-45(:src='img')
              .text-xs.text-gray-600.mt-1 打开微信扫一扫
                //- .last-form-item.mt-2
                //-   .agreement__rule.flex
                //-     .checkBox.mr-2(@click='toAgree',:class='{checked:isAgree}')
                //-     .text-xs.text-gray-400 我已阅读并同意
                //-     .text-xs.text-blue-500 《隐私条款》
                //- .text-white 我已阅读并同意《隐私条款》
                //- .text-white 没有账号，点击这里注册
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
.com-login-background
  width 100vw
  height 100vh
  background-image var(--bg)
  .main-title
    margin-bottom 56px
    color #fff
    font-size 68px
    line-height 55px
    text-align center
  .login__left
    width 50vw
    background var(--leftBg)
    .left__icon
      width 256px
      height @width
      background-image var(--lI)
  .login__right
    width 50vw
    .login__block
      padding 77.5px 40.5px
      .tabs
        .tab
          transition all 0.3s
          height 22px
        .activeTab
          @apply text-base font-medium text-gray-900
          line-height 22px
      .verify, .password
        .login-form
          height 100%
          .form-item:first-child
            margin-bottom 16px
          .form-item
            margin 0
            padding 0
            .form-item-input
              border-radius 4px
              font-size 14px !important
              border 1px solid #f3f4f6
              background transparent
              &:focus
                outline 1px solid #40a9ff
            >>>.sms-button
              right 0
              top 0
              bottom 0
              margin auto
              height fit-content
              .ant-btn-primary
                background transparent !important
                border none
                color #1890ff
                text-shadow none
                box-shadow none
            .form-item-password
              background transparent
              border 1px solid #f3f4f6
              &:focus
                outline 1px solid #40a9ff !important
              >>>.ant-input-lg
                font-size 14px !important
                background transparent
            .item__container
              .form-item-password
                width 100%
                height 36px !important
                background #f3f4f6
                border-radius 4px
                padding 0 12px
                transition all 0.3s
                &:focus
                  outline 1px solid #40a9ff
          .button-form-item
            margin-bottom 0 !important
            margin-top 69px
            .login-button
              background-color $primary-color
              border-color $primary-color
              border-radius 4px !important
              width 100%
              height 36px !important
</style>
