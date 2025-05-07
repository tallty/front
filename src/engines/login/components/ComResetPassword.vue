<script lang="ts">
import { ref, defineComponent, toRefs, reactive, computed } from 'vue';
import { VObject } from '@/lib/vails/model';
import ComSmsButton from './ComSmsButton.vue';
import { message } from 'ant-design-vue';
import { SmsAuthRegistrationApi } from '../apis/sms_auth/registration.api';

const ComResetPassword = defineComponent({
  name: 'ComResetPassword',
  components: {
    ComSmsButton,
  },
  props: {
    appId: { type: String, required: true },
  },
  setup(props, { emit }) {
    const info = ref<VObject>({
      app_id: props.appId,
    });

    const buttonStatus = reactive({
      loading: false,
    });

    const isDisabled = computed(
      () =>
        !info.value.account ||
        !info.value.password_raw ||
        !info.value.password_raw_check ||
        !info.value.verify_code,
    );

    const onSubmit = async () => {
      buttonStatus.loading = true;
      new SmsAuthRegistrationApi({ encrypt: true })
        .resetPassword(info.value)
        .then(() => {
          buttonStatus.loading = false;
          message.success('重置密码成功');
          emit('toLogin');
        })
        .catch(() => {
          // message.error('重置密码失败');
          buttonStatus.loading = false;
        });
    };

    const onSwitchToLogin = () => {
      emit('toLogin');
    };

    return {
      ...toRefs(props),
      info,
      buttonStatus,
      isDisabled,
      onSubmit,
      onSwitchToLogin,
    };
  },
});
export default ComResetPassword;
</script>

<template lang="pug">
.com-reset-password.px-8.py-8.pt-7
  .form
    a-form-item.form-item
      a-input.form-item-input(
        type='text',
        size='large',
        v-model:value='info.account',
        :maxLength='20',
        placeholder='请输入手机号',
      )

    a-form-item.form-item
      .flex
        a-input.form-item-code(
          size='large',
          v-model:value='info.verify_code',
          :maxLength='6',
          placeholder='请输入验证码',
          @pressEnter='onSubmit'
        )
        ComSmsButton.code-button(:disabled='!info.account', :user='info')
    a-form-item.form-item
      a-input-password.form-item-password(
        size='large',
        v-model:value='info.password_raw',
        placeholder='新密码',
        @pressEnter='onSubmit'
      )
    a-form-item.form-item
      a-input-password.form-item-password(
        size='large',
        v-model:value='info.password_raw_check',
        placeholder='再次输入新密码',
        @pressEnter='onSubmit'
      )
    a-button.submit-button(
      type='primary',
      @click='onSubmit',
      @pressEnter='onSubmit',
      :disabled='isDisabled',
      :loading='buttonStatus.loading'
    )
      | 重置密码
    .flex-end.pt-2
      TaTextButton(@click='onSwitchToLogin') 返回
</template>

<style lang="stylus" scoped>
.com-reset-password
  width fit-content
  background white
  .form
    width 320px
  .submit-button
    width 320px
  .form-item-code
    width 210px
    margin-right 10px
</style>
