<script lang="ts">
import { ref, defineComponent, toRefs, computed } from 'vue';
import { message } from 'ant-design-vue';
import { EmailAuthRegistCodeApi, SmsAuthRegistCodeApi } from '../../apis/sms_auth/regist_code.api';
import { SmsAuthVerifyCodeApi } from '../../apis/sms_auth/verify_code.api';
import { useI18n } from 'vue-i18n';

const ComGetCode = defineComponent({
  name: 'ComGetCode',
  components: {},
  props: {
    user: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    register: { type: Boolean, default: false },
    email_register: { type: Boolean, default: false },
    validatePhone: { type: Boolean, default: false },
    validateEmail: { type: Boolean, default: false },
    type: { type: String, required: false, default: 'primary' },
  },
  setup(props) {
    const { t } = useI18n();

    // 倒计时 ------
    const countDownTime = ref(0);

    const needDisable = computed(() => {
      return props.disabled || countDownTime.value > 0;
    });

    const sendSms = () => {
      if (needDisable.value) return;
      if (props.validatePhone) {
        if (!/^1\d{10}$/.exec(props.user.account)) {
          message.error(t('login.comGetCode.validator.phone'));
          return;
        }
      }
      if (props.validateEmail) {
        if (
          !/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,}$/.exec(
            props.user.account,
          )
        ) {
          message.error(t('login.comGetCode.validator.mail'));
          return;
        }
      }
      if (!props.disabled) {
        new (props.register
          ? props.email_register
            ? EmailAuthRegistCodeApi
            : SmsAuthRegistCodeApi
          : SmsAuthVerifyCodeApi)({ encrypt: true })
          .create({
            account: props.user.account,
            mobile: props.email_register ? undefined : props.user.account,
            email: props.email_register ? props.user.account : undefined,
            app_id: props.user.app_id,
          })
          .then(() => {
            countDownTime.value = 60;
            countdown();
          })
          .catch(() => {
            message.error(t('login.comGetCode.validator.codeFail'));
          });
      } else {
        message.warning(t('login.comGetCode.validator.account'));
      }
    };

    const countdown = () => {
      if (countDownTime.value > 0) {
        setTimeout(() => {
          countDownTime.value = countDownTime.value - 1;
          countdown();
        }, 1000);
      }
    };

    return {
      ...toRefs(props),
      sendSms,
      countDownTime,
      needDisable,
      t,
    };
  },
});
export default ComGetCode;
</script>

<template lang="pug">
.text-xs.text-gray-400(@click="sendSms" :class='needDisable ? "cursor-not-allowed" : "cursor-pointer"')
    | {{ countDownTime <= 0 ? t("login.comGetCode.get") : `${email_register? t("login.comGetCode.deliver"):''}${countDownTime}${t("login.comGetCode.second")}` }}
</template>

<style lang="stylus" scoped>
.com-sms-button
  width 100px
  .code-button
    width 100px
</style>
