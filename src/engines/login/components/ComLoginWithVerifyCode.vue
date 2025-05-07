<script lang="ts">
import { ref, defineComponent, toRefs, reactive, computed } from 'vue';
// import { message } from 'ant-design-vue';
import { AuthSessionApi } from '../apis/auth/session.api';
import { useRouter } from 'vue-router';
import { AuthSession } from '../types/model';
import ComSmsButton from './ComSmsButton.vue';

const ComLoginWithVerifyCode = defineComponent({
  name: 'ComLoginWithVerifyCode',
  components: {
    ComSmsButton,
  },
  props: {
    appId: { type: String, required: true },
    resetPassword: { type: Boolean, default: false },
    successCallback: { type: Function, default: null },
  },
  setup(props, { emit }) {
    const user = reactive<Partial<AuthSession>>({
      account: '',
      password: '',
      verify_code: '',
    });

    const buttonStatus = reactive({
      loading: false,
    });

    const isDisabled = computed(() => !user.account || !user.password || !user.verify_code);

    const activeTab = ref('normal');

    const router = useRouter();
    const onSubmit = async () => {
      try {
        buttonStatus.loading = true;
        await new AuthSessionApi({ encrypt: true }).login({ ...user, specify_app_id: props.appId });
        if (props.successCallback) {
          await props.successCallback();
        } else {
          router.replace('/');
        }
      } catch (error) {
        // message.error('登录失败');
      }

      buttonStatus.loading = false;
    };

    const onSwitchToRegister = () => {
      emit('toRegister');
    };

    const onSwitchToResetPassword = () => {
      emit('toResetPassword');
    };

    return {
      ...toRefs(props),
      user,
      activeTab,
      onSubmit,
      buttonStatus,
      isDisabled,
      onSwitchToRegister,
      onSwitchToResetPassword,
    };
  },
});
export default ComLoginWithVerifyCode;
</script>

<template lang="pug">
.com-login.px-8.py-4.pt-7
  a-form.login-form(v-model:value='activeKey', :model='user')
    a-form-item.form-item
      a-input.form-item-input(
        type='text',
        size='large',
        v-model:value='user.account',
        :maxLength='20',
        :required='true',
        placeholder='请输入登录账号',
        @pressEnter='onSubmit'
      )
    a-form-item.form-item
      a-input-password.form-item-password(
        size='large',
        v-model:value='user.password',
        placeholder='密码',
        @pressEnter='onSubmit'
      )
    a-form-item.form-item
      .flex
        a-input.form-item-code(
          size='large',
          v-model:value='user.verify_code',
          :maxLength='6',
          placeholder='请输入验证码',
          @pressEnter='onSubmit'
        )
        ComSmsButton.code-button(:disabled='!user.account', :user='{ ...user, app_id: appId}')
    a-button.login-button(
      type='primary',
      @click='onSubmit',
      @pressEnter='onSubmit',
      :disabled='isDisabled',
      :loading='buttonStatus.loading'
    )
      | 登录
    .flex-end.pt-2
      TaTextButton(v-if='resetPassword', @click='onSwitchToResetPassword') 忘记密码
      TaTextButton.ml-6(v-if='sms', @click='onSwitchToRegister') 快速注册
</template>

<style lang="stylus" scoped>
.com-login
  width fit-content
  background white
  .ta-tabs
    >>> .pane
      margin 0
    >>> .cursor
      bottom 0
  .ta-tabs
    border-bottom 1px solid #d9d9d9
  .tab
    margin-bottom 8px
    width 150px
  .active-tab
    width 150px

  .form-item, .login-button
    width 320px
  .form-item-code
    width 210px
    margin-right 10px
</style>
