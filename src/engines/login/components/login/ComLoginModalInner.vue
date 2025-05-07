<template lang="pug">
.w-full.h-full.relative
  .flex.items-center
    template(v-if='showFlist')
      .mr-4.cursor-pointer(
        v-for='item in firstList'
        :key='item'
        :class='choosed === item ? TabCss.active : TabCss.unActive'
        @click='checkChoose(item)'
      ) {{ getTypeName(item) }}
    template(v-if='showReg')
      .mr-4.cursor-pointer(
        v-for='item in registerList'
        :key='item'
        :class='choosed === item ? TabCss.active : TabCss.unActive'
        @click='checkChoose(item)'
      ) {{ getTypeName(item) }}
  .w-full.mt-8.login_form.flex.flex-col(v-if='choosed !== "WECHAT"' :class='theme === "DARK" ? "login_form_dark" : ""')
    template(v-if='choosed === "CODE"')
      .w-full
        .form-item-input
          ComLoginPhone(
            v-model:value='user.account',
            :maxLength='320',
            :placeholder= 't("login.placeholder.account")',
          )

        .form-item-input.mt-4.relative
          ComLoginCode(
            v-model:value='user.verify_code',
            :maxLength='6',
            :placeholder= 't("login.placeholder.verifyCode")',
          )

          .absolute.top-3.right-4
            ComGetCode(
              v-if='!isEmailLogin'
              :user='user',
              :disabled='smsDisabled',
              :register='true',
              :validatePhone='true',
            )
            ComGetCode(
              v-else
              :user='user',
              :disabled='smsDisabled',
              :register='true',
              :email_register='true'
              :validateEmail='true',
            )

    template(v-if='choosed === "PASSWORD"')
      .w-full
        .form-item-input
          ComLoginPhone(
            v-model:value='user.account',
            :maxLength='320',
            :placeholder= 't("login.placeholder.account")',
          )
        .form-item-input.mt-4
          ComLoginPass(
            v-model:value='user.password',
            :maxLength='20',
            :placeholder= 't("login.placeholder.password")',
          )

        .w-full.flex.justify-end.text-xs.text-gray-600.cursor-pointer.mt-4(
          @click='() => choosed="FORGET"'
          v-if='canForget'
          :class='theme === "DARK" ? "text-[#9CA3AF]" : ""'
        ) {{ t("login.forgotPassword") }}
    template(v-if='choosed === "REGISTER"')
      .w-full
        .form-item-input
          ComLoginPhone(
            v-model:value='user.account',
            :maxLength='11',
            :placeholder= 't("login.placeholder.phone")',
            onlyPhone
          )

        .form-item-input.mt-4
          ComLoginPass(
            v-model:value='user.password_raw',
            :maxLength='20',
            :placeholder= 't("login.placeholder.password")',
          )
        .form-item-input.mt-4.relative
          ComLoginCode(
            v-model:value='user.verify_code',
            :maxLength='6',
            :placeholder= 't("login.placeholder.verifyCode")',
          )
          .absolute.top-3.right-4
            ComGetCode(
              :user='user',
              :disabled='smsDisabled',
              :register='true',
              :validatePhone='true',
            )
    template(v-if='choosed === "EMAIL_REGISTER"')
      .w-full
        .form-item-input
          ComLoginPhone(
            v-model:value='user.account',
            :maxLength='320',
            :placeholder= 't("login.placeholder.mail")',
            onlyEmail
          )
        .form-item-input.mt-4
          ComloginPass(
            v-model:value='user.password_raw',
            :maxLength='20',
            :placeholder= 't("login.placeholder.password")',
          )
        .form-item-input.mt-4.relative
          ComLoginCode(
            v-model:value='user.verify_code',
            :maxLength='6',
            :placeholder= 't("login.placeholder.verifyCode")',
          )
          .absolute.top-3.right-4
            ComGetCode(
              :user='user',
              :disabled='smsDisabled',
              :register='true',
              :email_register='true',
              :validateEmail='true',
            )
    template(v-if='choosed === "FORGET"')
      .w-full
        .form-item-input
          ComLoginPhone(
            v-model:value='user.account',
            :maxLength='11',
            :placeholder= 't("login.placeholder.phone")',
            onlyPhone
          )
        .form-item-input.mt-4.relative
          ComLoginCode(
            v-model:value='user.verify_code',
            :maxLength='6',
            :placeholder= 't("login.placeholder.verifyCode")',
          )
          .absolute.top-3.right-4
            ComGetCode(
              :user='user',
              :disabled='smsDisabled',
              :register='true',
              :validatePhone='true',
            )
        .form-item-input.mt-4
          ComLoginPass(
            v-model:value='user.password_raw',
            :maxLength='20',
            :placeholder= 't("login.placeholder.rawPassword")',
          )

        .form-item-input.mt-4
          ComLoginPass(
            v-model:value='user.password_raw_check',
            :maxLength='20',
            :placeholder= 't("login.placeholder.rawCheckPassword")',
          )


    .login_action.mt-12.w-full
      .login_aciton_button.w-full.cursor-pointer(type='primary' @click='action') {{getLoginActionName(choosed)}}
      .flex.items-center.mt-2
        .check.cursor-pointer.flex-center.w-4.h-4(
          :class='{ "rounded": true, "check-active": privacyChecked, "!text-white": true, }'
          @click='() => privacyChecked = !privacyChecked'
        )
          TaIcon(v-if='privacyChecked', type='CheckOutlined', size='0.75rem')
        span.ml-2.cursor-pointer.text-gray-400.text-xs(@click='() => privacyChecked = !privacyChecked') {{ t("login.privacy.agree") }}
        .privacy_name.cursor-pointer.text-xs(@click='toPrivacy') {{ t("login.privacy.policy") }}
  .w-full.mt-8.login_form(v-else :class='theme === "DARK" ? "login_form_dark" : ""')
    .w-full.flex.flex-col.items-center(v-if='!!!openid')
      img.w-45.h-45(:src='img')
      .mt-3.text-gray-400.text-xs {{ t("login.wechat.scan") }}
      .mt-14.justify-center.w-full.flex.items-center
        .text-gray-400.text-xs {{ t("login.wechat.agree") }}
        span.privacy_name.cursor-pointer.text-xs(@click='toPrivacy') {{ t("login.privacy.policy") }}
    .w-full(v-else)
      .form-item-input
        ComLoginPhone(
          v-model:value='user.account',
          :maxLength='11',
          :placeholder= 't("login.placeholder.phone")',
          onlyPhone
        )
      .form-item-input.mt-4.relative
        ComLoginCode(
          v-model:value='user.verify_code',
          :maxLength='6',
          :placeholder= 't("login.placeholder.verifyCode")',
        )
        .absolute.top-3.right-4
          ComGetCode(
            v-if='!isEmailLogin'
            :user='user',
            :disabled='smsDisabled',
            :register='true',
            :validatePhone='true',
          )
        .w-full.text-center.mt-3.text-rose-600 {{ t("login.phone.checkBind") }}
      .mt-12.w-full
        .login_aciton_button.w-full.cursor-pointer(@click='onBind') {{ t("login.phone.onBind") }}

  .w-full.login_bottom_text.text-center.cursor-pointer.absolute.bottom-0(@click='textAction' v-show='showActionText') {{getLoginActionText(choosed)}}
  img.absolute.-right-23.-top-24.w-10.h-10.cursor-pointer.modal_action(
    src='https://stiei-obs2.obs.cn-east-2.myhuaweicloud.com/tech/%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.png',
    @click='onClose'
  )
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, toRefs, watch } from 'vue';
import { LoginType, getTypeName, getLoginActionName, getLoginActionText } from '../../types/login';
import ComGetCode from './ComGetCode.vue';
import { VStore } from '@/lib/vails';
import {
  QrcodeCheckApi,
  QrcodeCreateApi,
  QrcodeLoadApi,
  WechatLoginBindApi,
} from '../../apis/wechat/index.api';
import { AuthSessionApi } from '../../apis/auth/session.api';
import { SmsAuthRegistApi } from '../../apis/sms_auth/regist_session.api';
import { message } from 'ant-design-vue';
import {
  EmailAuthRegistrationApi,
  SmsAuthRegistrationApi,
} from '../../apis/sms_auth/registration.api';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ComLoginPhone from './ComLoginPhone.vue';
import ComLoginPass from './ComLoginPass.vue';
import ComLoginCode from './ComLoginCode.vue';
import { useCheckLogin } from '../../utils/checkLogin';

const ComLoginModalInner = defineComponent({
  name: 'ComLoginModalInner',
  components: {
    ComGetCode,
    ComLoginPhone,
    ComLoginPass,
    ComLoginCode,
  },
  props: {
    theme: { type: String, default: () => 'LIGHT' },
  },
  emits: ['cancel', 'onComplete'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const user = ref<any>({
      app_id: process.env.VUE_APP_APP_CODE,
    });
    const typeList = (process.env.VUE_APP_LOGIN_TYPE?.split(',') || []) as LoginType[];
    const firstList = typeList.filter(el => el === 'CODE' || el === 'PASSWORD' || el === 'WECHAT') as LoginType[];
    const registerList = typeList.filter(el => el === 'REGISTER' || el === 'EMAIL_REGISTER') as LoginType[];
    const canRegister = registerList.some(el => el === 'REGISTER' || el === 'EMAIL_REGISTER');
    const canForget = typeList.some(el => el === 'FORGET');

    const choosed = ref<LoginType>(firstList[0]);

    const showFlist = computed(() => {
      return firstList.includes(choosed.value);
    });
    const showReg = computed(() => {
      return registerList.includes(choosed.value);
    });
    const showActionText = computed(() => {
      if (showFlist.value && registerList.length > 0) return true;
      if (showReg.value) return true;
      return false;
    });

    const checkChoose = (v: LoginType) => {
      if (v === choosed.value) return;
      choosed.value = v;
    };

    const isEmailLogin = computed(() => {
      // eslint-disable-next-line no-useless-escape
      return /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,}$/.exec(
        user.value.account,
      );
    });
    const smsDisabled = computed(() => !user.value.account);

    const privacyChecked = ref(false);

    const toPrivacy = () => {
      const domain = window.location.host;
      window.open(`//${domain}${process.env.VUE_APP_PUBLIC_PATH}privacy`);
    };

    const textAction = () => {
      if (showFlist.value) {
        // console.log(registerList[0]);
        choosed.value = registerList[0];
        return;
      }
      if (showReg.value) {
        choosed.value = firstList[0];
        return;
      }
      if (choosed.value === 'FORGET') {
        choosed.value = firstList[0];
      }
    };

    const ticket = ref('');
    const openid = ref();
    const timer = ref();
    const timerCount = ref(0);
    const img = ref();

    const resetScan = () => {
      openid.value = '';
      img.value = '';
      choosed.value === firstList[0];
    };
    const resetUser = () => {
      user.value = {
        account: '',
        verify_code: '',
        password: '',
        password_raw: '',
        password_raw_check: '',
        name: '',
        app_id: process.env.VUE_APP_APP_CODE,
      };
    };

    watch(
      () => [choosed.value],
      () => {
        if (choosed.value === 'WECHAT') {
          openid.value = null;
          openWechatLogin();
        } else {
          openid.value = null;
          cancelWechatLogin();
        }
      },
    );
    const CodeStore = new VStore(
      new QrcodeCreateApi({
        parents: [{ type: 'innomatch_wechat' }],
      }),
    );
    const CodeLoadtore = new VStore(
      new QrcodeLoadApi({
        parents: [{ type: 'innomatch_wechat' }],
      }),
    );

    const CodeCheck = new VStore(new QrcodeCheckApi());

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
    const setProfile = (tel: any) => {
      (window as any)?.setSensorsProfile?.({
        tel,
      });
    };

    const checkScran = async () => {
      const res = await CodeCheck.sendMemberAction({
        id: 1,
        action: 'qrcode_login',
        config: {
          data: {
            ticket: ticket.value,
            app_id: user.value.app_id,
            wechat_app_id: 'innomatch_wechat',
          },
        },
      });
      // console.log(res?.data, '============>');
      if (res.data?.auth_account || res.data?.openid) {
        cancelWechatLogin();
        if (res.data?.auth_account) {
          new AuthSessionApi().setToken(res.data.auth_account.token as string);
          setProfile(res.data?.auth_account?.account);
          // props.actions.complete();
          resetUser();
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

    const cancelWechatLogin = async () => {
      clearTime();
      timer.value = null;
      timerCount.value = 0;
      return Promise.resolve();
    };

    const clearTime = () => {
      clearTimeout(timer.value);
    };

    const onBind = async () => {
      try {
        await new SmsAuthRegistApi().login(user.value);
        const token = AuthSessionApi.token();
        await new WechatLoginBindApi().create({
          openid: openid.value,
          oauth_app_id: 'innomatch_wechat',
          app_id: user.value.app_id,
          token,
        });
        setProfile(user.value.account);
        new AuthSessionApi().setToken(token);
        resetUser();
        resetScan();
        loginOk();
      } catch (e) {
        console.log(e);
      }
    };

    const { checkLogin } = useCheckLogin(t);
    const action = async () => {
      const res = checkLogin(choosed.value, user.value);
      if (!res) return;
      if (!privacyChecked.value) {
        message.error(t('login.privacy.pleaseAgree'));
        return;
      }
      if (choosed.value === 'CODE') {
        await new SmsAuthRegistApi().login({
          ...user.value,
        });
        loginFinal();
      }
      if (choosed.value === 'PASSWORD') {
        await new AuthSessionApi().login({ ...user.value, verify_code: undefined });
        loginFinal();
      }
      if (choosed.value === 'REGISTER') {
        await new SmsAuthRegistrationApi().register(user.value);
        loginFinal();
      }
      if (choosed.value === 'EMAIL_REGISTER') {
        await new EmailAuthRegistrationApi().register(user.value);
        loginFinal();
      }

      if (choosed.value === 'FORGET') {
        await new SmsAuthRegistrationApi().resetPassword(user.value).then(() => {
          message.success(t('login.resetPassword'));
          choosed.value = 'PASSWORD';
        });
      }
    };

    const loginFinal = () => {
      resetUser();
      resetScan();
      loginOk();
    };
    const route = useRoute();
    const router = useRouter();
    const redirect = (route.query?.redirect as string) || '/';
    // console.log(redirect);

    const loginOk = () => {
      emit('onComplete');
    };

    const onClose = () => {
      resetUser();
      resetScan();
      emit('cancel');
    };

    onUnmounted(() => {
      cancelWechatLogin();
    });

    const TabCss = computed(() => {
      return {
        active:
          props.theme === 'LIGHT'
            ? 'text-base text-gray-900 font-medium'
            : 'text-base text-white font-medium',
        unActive: props.theme === 'LIGHT' ? 'text-gray-500 text-sm' : 'text-[#9CA3AF] text-sm',
      };
    });

    const checkColorBg = computed(() => {
      return props.theme === 'LIGHT' ? '#F9FAFB' : '#4B5563';
    });
    const checkColorBorder = computed(() => {
      return props.theme === 'LIGHT' ? '#D1D5DB' : '#6B7280';
    });

    return {
      ...toRefs(props),
      user,

      showFlist,
      showReg,
      showActionText,
      canForget,

      firstList,
      registerList,
      canRegister,
      choosed,
      getTypeName,
      getLoginActionName,
      getLoginActionText,
      checkChoose,

      isEmailLogin,
      smsDisabled,

      privacyChecked,
      toPrivacy,

      textAction,

      img,
      onBind,
      action,
      onClose,
      t,

      TabCss,
      checkColorBg,
      checkColorBorder,
    };
  },
});
export default ComLoginModalInner;
</script>
<style lang="stylus" scoped>
.login_form
  :deep(.ant-input)
    border none !important
    background #F3F4F6 !important
    border-radius 4px
    height 44px
    outline none !important
    background-clip text
    &:hover
      background #F3F4F6 !important
      outline none !important
    &:focus
      background #F3F4F6 !important
      outline none !important
    &:autofill
      background: #F3F4F6
      background-clip text
      // 支持chrome
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active
      transition: background-color 50000s;
      -webkit-text-fill-color: rgba(0, 0, 0, 0.65) !important;

  :deep(.ant-input::placeholder)
    font-size 14px !important
    color #9CA3AF  !important

  :deep(.ant-input-password)
    border none !important
    padding 0 14px  !important
    background #F3F4F6 !important
.login_form_dark
  :deep(.ant-input)
    background #4B5563 !important
    color white !important
    box-shadow: none !important
    &:hover
      background #4B5563 !important
    &:focus
      background #4B5563 !important
    &:autofill
      background: #4B5563
      // 支持chrome
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active
      -webkit-text-fill-color: rgba(255, 255, 255, 1) !important;

  :deep(.ant-input::placeholder)
    color #9CA3AF  !important

  :deep(.ant-input-password)
    background #4B5563 !important
  :deep(.ant-input-suffix)
    color #9CA3AF !important
    .ant-input-password-icon
      color #9CA3AF !important
.login_aciton_button
  display flex
  align-items center
  justify-content center
  width 100%
  padding 12px 20px
  border-radius 4px
  color white
  font-size 14px
  font-weight 500
  background $primary-color
.check
  border-width 0.5px
  background v-bind(checkColorBg)
  border-color v-bind(checkColorBorder)
.check-active
  border-color $primary-color

  background $primary-color
.privacy_name
  color $primary-color !important
.login_bottom_text
  color $link-color
  font-size 14px
</style>
