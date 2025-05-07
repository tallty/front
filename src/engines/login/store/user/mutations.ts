import { MutationTree } from 'vuex';
import { UserState } from './typing';
import ls from '@/utils/local-storage';
import { STORAGE_TOKEN_KEY } from '@/store/mutation-type';
import { STORAGE_SESSION_ID } from '../../../../store/mutation-type';

import { docCookies } from '@/components/global/ta-component/cookie';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_INFO = 'SET_INFO';
export const RESET_CURRENT_USER = 'RESET_CURRENT_USER';

export const mutations: MutationTree<UserState> = {
  [SET_TOKEN]: (state, token: string) => {
    state.token = token;
    const storage_TOKEN_KEY = ls.get(STORAGE_TOKEN_KEY);
    console.log(storage_TOKEN_KEY);
    ls.set(STORAGE_TOKEN_KEY, token);
    if (process.env.VUE_APP_COOKIE_DOMAIN) {
      if (token === null) {
        docCookies.removeItem(STORAGE_TOKEN_KEY, '/', process.env.VUE_APP_COOKIE_DOMAIN);
      } else {
        docCookies.setItem(
          STORAGE_TOKEN_KEY,
          token,
          new Date().getTime() + 3600000 * 24 * 30,
          '/',
          process.env.VUE_APP_COOKIE_DOMAIN,
        );
      }
    }
  },
  [SET_INFO]: (state, info) => {
    state.currentUser = { ...info };
  },
  [RESET_CURRENT_USER]: state => {
    state.currentUser = {};
  },
  [SET_SESSION_ID]: (state, id: number) => {
    state.sessionId = id;
    ls.set(STORAGE_SESSION_ID, id);

    if (process.env.VUE_APP_COOKIE_DOMAIN) {
      docCookies.setItem(
        STORAGE_SESSION_ID,
        `${id}`,
        new Date().getTime() + 3600000 * 24 * 30,
        '/',
        process.env.VUE_APP_COOKIE_DOMAIN,
      );
    }
  },
};
