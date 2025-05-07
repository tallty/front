<script lang="ts">
import { ref, defineComponent, toRefs } from 'vue';
import { message } from 'ant-design-vue';
import { SmsAuthVerifyCodeApi } from '../apis/sms_auth/verify_code.api';
import { EmailAuthRegistCodeApi, SmsAuthRegistCodeApi } from '../apis/sms_auth/regist_code.api';
import { EmailAuthRegistrationApi } from '../apis/sms_auth/registration.api';

const ComSmsButton = defineComponent({
  name: 'ComSmsButton',
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
    // 倒计时 ------
    const countDownTime = ref(0);

    const sendSms = () => {
      if (props.validatePhone) {
        if (!/^1\d{10}$/.exec(props.user.account)) {
          message.error('请输入正确的手机号');
          return;
        }
      }
      if (props.validateEmail) {
        if (
          !/^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,}$/.exec(
            props.user.account,
          )
        ) {
          message.error('请输入正确的邮箱号');
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
            message.error('验证码发送失败');
          });
      } else {
        message.warning('请输入账号');
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
    };
  },
});
export default ComSmsButton;
</script>

<template lang="pug">
.com-sms-button(
  :style={
      height: type === 'primary' ?  '39px' : undefined
    }
  )
  a-button.code-button(
    :style={
      height: type === 'primary' ?  '39px' : undefined
    }
    :type='type',
    :disabled='disabled || countDownTime > 0',
    @click="sendSms",
  )
    | {{ countDownTime <= 0 ? '获取验证码' : `${email_register?'验证码已发送':''}${countDownTime}秒` }}
</template>

<style lang="stylus" scoped>
.com-sms-button
  width 100px
  .code-button
    width 100px
</style>
