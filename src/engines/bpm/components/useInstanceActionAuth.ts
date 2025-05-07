import { Ref, inject, provide, ref } from 'vue';
import { Instance, Token } from '../bpm-core/types';
const KEY = 'useInstanceActionAuthKey';

export interface useInstanceActionAuthInterface {
  instance: {
    edit?: boolean | ((instance: Instance) => boolean);
  };
  token: {
    edit?: boolean | ((token: Token) => boolean);
  };
}

export const useInstanceActionAuthProvide = (auth: Ref<useInstanceActionAuthInterface>) => {
  provide(KEY, auth);
};

export const useInstanceActionAuthInject = () => {
  const auth = inject(
    KEY,
    ref<useInstanceActionAuthInterface>({ instance: {}, token: {} }),
  );

  const tokenCanDo = (token: Token, action: 'edit') => {
    const target = auth.value.token[action];
    if (typeof target === 'function') {
      return target(token);
    }
    return target;
  };

  const instanceCanDo = (instance: Instance, action: 'edit') => {
    const target = auth.value.instance[action];
    if (typeof target === 'function') {
      return target(instance);
    }
    return target;
  };

  return { auth, tokenCanDo, instanceCanDo };
};
