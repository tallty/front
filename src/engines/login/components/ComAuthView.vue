<script lang="ts">
import { defineComponent, computed, onMounted, ref, toRefs, PropType } from 'vue';
import useLogin, { AuthFunction } from './useLogin';
import ComLogin from '@/engines/login/components/ComLogin.vue';
import ComRegister from './ComRegister.vue';
import ComResetPassword from './ComResetPassword.vue';
import ComRegistSession from './ComRegistSession.vue';
import { useRoute, useRouter } from 'vue-router';
import ComLoginModal from './login/ComLoginModal.vue';

const ComAuthView = defineComponent({
  name: 'ComAuthView',
  components: {
    ComLogin,
    ComRegister,
    ComResetPassword,
    ComRegistSession,
    ComLoginModal,
  },
  props: {
    funcs: {
      type: Array as PropType<AuthFunction[]>,
      default: () => ['login', 'register', 'reset_password'],
    },
    appId: {
      type: String,
      default: 'TECH',
    },
  },
  emits: ['ready', 'cancel'],
  setup(props, { emit }) {
    const visible = ref(false);
    const router = useRouter();
    const route = useRoute();

    const { authProxy, action } = useLogin((mode: AuthFunction) => {
      if (process.env?.VUE_APP_LOGIN_DISPLAY_TYPE) {
        if (process.env.VUE_APP_LOGIN_DISPLAY_TYPE === 'REDIRECT') {
          router.replace(route.fullPath);
        } else {
          func.value = mode;
          visible.value = true;
        }
      } else {
        func.value = mode;
        visible.value = true;
      }
    });

    onMounted(() => {
      emit('ready', authProxy);
    });

    const func = ref(props.funcs[0]);

    const onComplete = async () => {
      await action.value();
      visible.value = false;
    };

    const onCancel = () => {
      emit('cancel');
      visible.value = false;
    };

    const slotActions = computed(() => ({
      cancel: onCancel,
      complete: onComplete,
    }));

    return {
      ...toRefs(props),
      visible,
      func,
      onComplete,
      onCancel,
      slotActions,
    };
  },
});

export default ComAuthView;
</script>

<template lang="pug">
.com-auth-view
  slot(:actions='slotActions', :visible='visible')
    TaNoPaddingModal(
        wrapClassName='login_modal_no_padding_wrapper'
        width='fit-content',
        :top='`20%`',
        :visible='visible',
        :footer='null',
        :headerStyle='{ display: "none" }',
        :closable='false',
      )
        .w-270.h-134
          ComLoginModal(@onComplete='onComplete' @onCancel='onCancel')
   
</template>

<style lang="stylus">
.login_modal_no_padding_wrapper
  .ant-modal-content
    background transparent
</style>
