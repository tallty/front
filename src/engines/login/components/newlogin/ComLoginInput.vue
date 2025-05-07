<script lang='ts'>
import { defineComponent, toRefs, computed, PropType } from 'vue';
import ComSmsButton from '@/engines/login/components/ComSmsButton.vue';
import { User } from '@/engines/login/components/newlogin/useLoginCfg';

type InputType = 'password' | 'text' | 'email' | 'number' |
  'tel' | 'url' | 'search' | 'date' | 'datetime-local' |
  'month' | 'week' | 'time' | 'datetime' | 'color' |
  'file' | 'range' | 'hidden' | 'button' | 'submit' |
  'reset' | 'image' | 'radio' | 'checkbox' | 'image'

const ComLoginInput = defineComponent({
  name: 'ComLoginInput',
  components: { ComSmsButton },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '账号/手机号',
    },
    forId: {
      type: String as PropType<string | number>,
      default: 1,
    },
    type: {
      type: String as PropType<InputType | 'verify'>,
      default: 'text',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object as PropType<User>,
      default: () => { }
    },
  },
  setup(props, { emit }) {
    const localValue = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('update:value', val)
      }
    })
    const smsDisabled = computed(() => !props.user);
    return {
      ...toRefs(props),
      localValue,
      smsDisabled,
    };
  },
});
export default ComLoginInput;
</script>

<template lang="pug">
.com-login-input-wrapper.relative.w-full
  input.com-login-input.w-full.h-11.px-4(
    :value='localValue',
    @input='(e)=>localValue = e.target.value',
    :id='forId',
    :type='type',
    :autofocus='autofocus',
    :class='{"fillValue":localValue.length > 0}'
  )
  label.com-login-label.text-gray-400.absolute.px-1(:for='forId') {{ placeholder }}
  .h-full.absolute.right-2.top-0.flex.items-center(v-if='type === "verify"')
    ComSmsButton(
      :user='user',
      :disabled='smsDisabled',
      :register='true',
      :validatePhone='true'
    )

</template>

<style lang="stylus" scoped>
.com-login-input-wrapper
  .com-login-label
    top 11px
    left 16px
    user-select none
    transition all .3s
  .com-login-input
    border-radius 6px
    border 1px solid rgba(0,0,0,0.23)
    line-height 20px
    font-size 16px
    //解决自动填充时背景颜色问题
    &:-webkit-autofill
      transition: background-color 5000s ease-in-out 0s
  .fillValue,.com-login-input:focus
    border 2px solid $primary-color
    outline 0
  .fillValue + label,.com-login-input:focus + label
    color $primary-color
    transform translate(0,-24px) scale(0.9)
    background linear-gradient(to bottom,transparent 0%,transparent 57%,white 57%,white 100%)

</style>
