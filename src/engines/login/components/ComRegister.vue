<script lang="ts">
import { ref, defineComponent, toRefs, reactive, computed, PropType } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { SmsAuthRegistrationApi } from '../apis/sms_auth/registration.api';
import { VObject } from '@/lib/vails/model';
import ComSmsButton from './ComSmsButton.vue';

const ComRegister = defineComponent({
  name: 'ComRegister',
  components: {
    ComSmsButton,
  },
  props: {
    appId: { type: String, required: true },
    // template: { type: Object as PropType<TaTemplateFormItem>, default: () => ({}) },
    successCallback: { type: Function, default: null },
  },
  setup(props, { emit }) {
    const info = ref<VObject>({
      app_id: props.appId,
    });

    const router = useRouter();

    const buttonStatus = reactive({
      loading: false,
    });

    const isDisabled = computed(
      () =>
        !info.value.account ||
        !info.value.password_raw ||
        !info.value.name ||
        !info.value.verify_code,
    );

    const onSubmit = async () => {
      try {
        buttonStatus.loading = true;
        await new SmsAuthRegistrationApi({ encrypt: true }).register(info.value);
        if (props.successCallback) {
          await props.successCallback();
        } else {
          router.replace('/');
        }
        buttonStatus.loading = false;
      } catch (error) {
        // message.error('注册失败');
        buttonStatus.loading = false;
      }
    };

    const onSwitchToLogin = () => emit('toLogin');

    return {
      ...toRefs(props),
      onSubmit,
      info,
      buttonStatus,
      isDisabled,
      onSwitchToLogin,
    };
  },
});
export default ComRegister;
</script>

<template lang="pug">
.com-register.px-8.py-4.pt-7
  //- TaTemplateForm.form(v-model:modelValue='info', :template='template')
  a-form-item.form-item
    a-input.form-item-input(
      type='text',
      size='large',
      v-model:value='info.account',
      :maxLength='20',
      placeholder='请输入登录账号',
    )
  a-form-item.form-item
    a-input.form-item-input(
      type='text',
      size='large',
      v-model:value='info.name',
      :maxLength='20',
      placeholder='请输入用户名',
    )
  a-form-item.form-item
    a-input-password.form-item-password(
      size='large',
      v-model:value='info.password_raw',
      placeholder='密码',
      @pressEnter='onSubmit'
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
      ComSmsButton.code-button(:disabled='!info.account', :user='info', :register='true')
  a-button.login-button(
    type='primary',
    @click='onSubmit',
    @pressEnter='onSubmit',
    :disabled='isDisabled',
    :loading='buttonStatus.loading'
  )
    | 注册
  .flex-end.pt-2
    TaTextButton(@click='onSwitchToLogin') 登录
</template>

<style lang="stylus" scoped>
.com-register
  background white
  width fit-content
  .form
    width 320px
  .login-button
    width 320px
  .form-item-code
    width 210px
    margin-right 10px
</style>
