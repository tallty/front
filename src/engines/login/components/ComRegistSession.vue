<script lang="ts">
import { ref, defineComponent, toRefs, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AuthSession } from '../types/model';
import ComSmsButton from './ComSmsButton.vue';
import { SmsAuthRegistApi } from '../apis/sms_auth/regist_session.api';

const ComRegistSession = defineComponent({
  name: 'ComRegistSession',
  components: {
    ComSmsButton,
  },
  props: {
    appId: { type: String, required: true },
    successCallback: { type: Function, default: null },
  },
  setup(props, { emit }) {
    const user = reactive<Partial<AuthSession>>({
      app_id: props.appId,
      account: '',
      verify_code: '',
    });

    const buttonStatus = reactive({
      loading: false,
    });

    const isDisabled = computed(() => !user.account || !user.verify_code);

    const router = useRouter();
    const onSubmit = async () => {
      try {
        buttonStatus.loading = true;
        await new SmsAuthRegistApi({ encrypt: true }).login(user);
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

    return {
      ...toRefs(props),
      user,
      onSubmit,
      buttonStatus,
      isDisabled,
    };
  },
});
export default ComRegistSession;
</script>

<template lang="pug">
.com-regist-session.px-8.py-4.pt-7
  TaTab.ta-tabs.mb-4.px-1(v-if='sms', v-model:value='activeTab', :tabs='tabs')
    template(#tab='{ tab, isActive }')
      .tab.flex-center(:class='{ "active-tab": isActive }') {{ tab.label }}

  a-form.login-form(v-model:value='activeKey', :model='user')
    a-form-item.form-item
      a-input-number.form-item-input(
        size='large',
        v-model:value='user.account',
        :precision='0',
        :maxLength='11',
        :required='true',
        :controls='false',
        placeholder='请输入手机号',
        @pressEnter='onSubmit'
      )
      a-form-item.form-item
        .flex.mt-4
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
</template>

<style lang="stylus" scoped>
.com-regist-session
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

  .form-item, .login-button, .form-item-input
    width 320px
  .form-item-code
    width 210px
    margin-right 10px
</style>
