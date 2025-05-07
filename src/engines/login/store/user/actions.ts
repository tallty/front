import { AuthSession } from '@/engines/login/types/model';
import { VObject } from '@/lib/vails/model/index';
import store from '@/store';
import { RootState } from '@/store/root-state';
import { ActionTree } from 'vuex';
import { ResUserInfoApi } from '../../../res/res-core/apis/res/user/info.api';
import { RESET_CURRENT_USER, SET_INFO, SET_SESSION_ID, SET_TOKEN } from './mutations';
import { UserState } from './typing';

export const UPDATE_TOKEN = 'UPDATE_TOKEN';
export const UPDATE_SESSION_ID = 'UPDATE_SESSION_ID';
export const UPDATE_INFO = 'UPDATE_INFO';
export const CLEAR = 'CLEAR';
export const SET_FROM_SESSION = 'SET_FROM_SESSION';
export const GET_INFO = 'GET_INFO';

const getInfoQueue: Promise<void>[] = [];

export const actions: ActionTree<UserState, RootState> = {
  [UPDATE_TOKEN]({ commit }, token: string) {
    commit(SET_TOKEN, token);
  },
  [UPDATE_SESSION_ID]({ commit }, sessionId: string) {
    commit(SET_SESSION_ID, sessionId);
  },
  [SET_FROM_SESSION]({ commit }, session: AuthSession, sessionIdKey = 'id') {
    return new Promise<void>(resolve => {
      commit(SET_TOKEN, session.token);
      commit(SET_SESSION_ID, (session as VObject)[sessionIdKey]);
      store.dispatch(`user/${GET_INFO}`).then(() => {
        resolve();
      });
    });
  },
  [GET_INFO]({ commit }) {
    return new Promise((resolve, reject) => {
      if (getInfoQueue.length === 0) {
        const promise = new ResUserInfoApi()
          .find()
          .then(res => {
            commit(SET_INFO, res.data);
            resolve(res);
            getInfoQueue.pop();
          })
          .catch(err => {
            // 获取登录用户信息后，直接清理掉当前 token 并强制让流程走到登录页
            store.dispatch(`user/${CLEAR}`);
            reject(err);
          });
        getInfoQueue.push(promise);
      } else {
        getInfoQueue[0].then(res => resolve(res));
      }
    });
  },
  [CLEAR]({ commit }) {
    commit(SET_TOKEN, null);
    commit(RESET_CURRENT_USER);
    commit(SET_SESSION_ID, null);
  },
};
