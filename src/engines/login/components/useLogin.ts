import { ref } from 'vue';
import { VObject } from '../../../lib/vails/model/index';
import { AuthSessionApi } from '../apis/auth/session.api';

export type AuthFunction = 'login' | 'register' | 'reset_password' | 'regist_session';

const useLogin = (login: (mode: AuthFunction) => any) => {
  // eslint-disable-next-line
  const action = ref((data?: VObject) => {});

  const authProxy = async (fn: () => void, mode: AuthFunction = 'login') => {
    action.value = fn;
    if (AuthSessionApi.token()) {
      action.value && action.value(AuthSessionApi.currentUser());
    } else {
      await login(mode);
    }
  };

  return {
    action,
    authProxy,
  };
};

export default useLogin;
