<script lang="ts">
import { ref, defineComponent, toRefs, reactive, computed } from 'vue';
// import { message } from 'ant-design-vue';
import { AuthSessionApi } from '../apis/auth/session.api';
import { useRouter } from 'vue-router';
import { AuthSession } from '../types/model';
import ComSmsButton from './ComSmsButton.vue';
import { SmsAuthRegistApi } from '../apis/sms_auth/regist_session.api';

const ComRegister = defineComponent({
  name: 'ComRegister',
  components: {
    ComSmsButton,
  },
  props: {
    appId: { type: String, required: true },
    normal: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    resetPassword: { type: Boolean, default: false },
    successCallback: { type: Function, default: null },
  },
  setup(props, { emit }) {
    const user = reactive<Partial<AuthSession>>({
      app_id: props.appId,
      account: '',
      password: '',
      verify_code: '',
    });

    const buttonStatus = reactive({
      loading: false,
    });

    const isDisabled = computed(
      () =>
        !user.account ||
        (activeTab.value === 'normal' && !user.password) ||
        (activeTab.value === 'sms' && !user.verify_code),
    );

    const tabs = [
      { label: '密码登录', key: 'normal' },
      { label: '快捷登录', key: 'sms' },
    ];

    const activeTab = ref('normal');

    const router = useRouter();
    const onSubmit = async () => {
      try {
        buttonStatus.loading = true;
        if (activeTab.value === 'sms') {
          await new SmsAuthRegistApi({ encrypt: true }).login(user);
        } else {
          await new AuthSessionApi({ encrypt: true }).login({ ...user, verify_code: undefined });
        }
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
      tabs,
      activeTab,
      onSubmit,
      buttonStatus,
      isDisabled,
      onSwitchToRegister,
      onSwitchToResetPassword,
    };
  },
});
export default ComRegister;
</script>

<template lang="pug">
.com-login.px-8.py-4.pt-7
  TaTab.ta-tabs.mb-4.px-1(v-if='sms', v-model:value='activeTab', :tabs='tabs')
    template(#tab='{ tab, isActive }')
      .tab.flex-center(:class='{ "active-tab": isActive }') {{ tab.label }}

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
    template(v-if='activeTab === "normal"')
      a-form-item.form-item
        a-input-password.form-item-password(
          size='large',
          v-model:value='user.password',
          placeholder='密码',
          @pressEnter='onSubmit'
        )
    template(v-if='activeTab === "sms"')
      a-form-item.form-item
        .flex
          a-input.form-item-code(
            size='large',
            v-model:value='user.verify_code',
            :maxLength='6',
            placeholder='请输入验证码',
            @pressEnter='onSubmit'
          )
          ComSmsButton.code-button(:disabled='!user.account', :user='user', :register='true')
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
