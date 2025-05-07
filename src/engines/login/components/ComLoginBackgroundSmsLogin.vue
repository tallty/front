<script lang="ts">
import { ref, defineComponent, toRefs, computed } from 'vue';
import ComSmsButton from '@/engines/login/components/ComSmsButton.vue';

const ComLoginBackgroundSmsLogin = defineComponent({
  name: 'ComLoginBackgroundSmsLogin',
  components: {
    ComSmsButton,
  },
  props: {
    user: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const smsDisabled = computed(() => !props.user.account);
    const localUser = computed({
      get: () => props.user,
      set: val => emit('update:user', val),
    });

    const onSubmit = () => {
      emit('submit');
    };

    return {
      ...toRefs(props),
      smsDisabled,
      localUser,
      onSubmit,
    };
  },
});
export default ComLoginBackgroundSmsLogin;
</script>

<template lang="pug">
.com-login-background-sms-login
  a-form.login-form(:model='localUser',style='position: relative')
    a-form-item.form-item.bg-gray-100.rounded
      a-input.form-item-input(
        type='text',
        size='large',
        v-model:value='localUser.account',
        :maxLength='20',
        placeholder='请输入登录账号',
        @pressEnter='onSubmit'
      )
    a-form-item.form-item
      .item__container.relative
        input.form-item-password(
          :value='localUser.verify_code',
          @input ='(e) => localUser.verify_code = e.target.value',
          @enter.up='onSubmit'
        )
        ComSmsButton.sms-button.absolute(
          :user='localUser',
          :disabled='smsDisabled',
          :register='true',
          :validatePhone='true'
        )

    a-form-item.button-form-item
      a-button.login-button.w-full.h-9(
        type='primary',
        @click='onSubmit',
        :loading='loading'
      )
        | 登录
</template>

<style lang="stylus" scoped>
.com-login-background-sms-login
  .login-form
    height 100%
    .form-item:first-child
      margin-bottom 8px
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
    right 0;top 0;bottom 0;
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
      transition all .3s
      &:focus
        outline 1px solid #40a9ff
  .button-form-item
    margin-bottom 0 !important
    margin-top 24px
    // height 16px !important
    .login-button
      background $primary-color
      border-radius 4px !important
      width 100%
      height 36px !important
</style>
