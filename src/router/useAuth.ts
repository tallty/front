import { ref } from '@vue/reactivity';

import store from '@/store';
import { GET_INFO } from '@/engines/login/store/user/actions';
import { AuthSessionApi } from '@/engines/login/apis/auth/session.api';

const useAuth = () => {
  const loading = ref(false);

  const checkAuth = async (to: string) => {
    if (to.includes('/login') || to.includes('test/view')) {
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      await new AuthSessionApi().sendCollectionAction('check');
      await store.dispatch(`user/${GET_INFO}`);
      loading.value = false;
    } catch (error) {
      setTimeout(() => {
        loading.value = false;
      }, 100);
      throw error;
    }
  };

  return {
    checkAuth,
    loading,
  };
};

export default useAuth;
