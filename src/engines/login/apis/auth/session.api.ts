import { AuthAppOptions, AuthSession } from '@/engines/login/types/model';
import { VApiConfig } from '@/lib/vails/api/index';
import store from '@/store';
import ls from '@/utils/local-storage';

import { message } from 'ant-design-vue';
import { STORAGE_SESSION_ID, STORAGE_TOKEN_KEY } from '../../../../store/mutation-type';
import { CLEAR, GET_INFO, SET_FROM_SESSION, UPDATE_TOKEN } from '../../store/user/actions';

import { docCookies } from '@/components/global/ta-component/cookie';
import { MyApi } from '@/engines/base/apis/MyApi';

export const getQueryStringParameter = (href: string, name: string) => {
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(href);
  if (results == null) {
    return '';
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
};

let seq = 1;

export class AuthSessionApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/soa-auth/auth',
      name: 'session',
      mode: 'single',
      actions: [{ name: 'check', method: 'post', on: 'collection' }],
      ...config,
    });
  }

  login(
    session: AuthSession,
    selectAppIdPromise = async (options: AuthAppOptions[]) => options[0]?.app_id,
  ) {
    return this.request
      .post(`${this.namespace}/session`, {
        ...session,
        limit_identifier: seq++,
      })
      .then(async res => {
        if (res.data.apps) {
          await selectAppIdPromise(res.data.apps).then(async appId => {
            await this.login({ ...session, specify_app_id: appId });
          });
        } else if (res.data?.token) {
          await store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
        }
        return res;
      })
      .catch(error => {
        message.error(error.response?.data?.message || '登录失败');
        store.dispatch(`user/${CLEAR}`);
        throw error;
      });
  }

  logout() {
    return this.delete()
      .then(() => {
        store.dispatch(`user/${CLEAR}`);
      })
      .catch(() => {
        const { hostname } = window.location;
        const domainParts = hostname.split('.');

        if (domainParts.length <= 2 || domainParts[domainParts.length - 1].match(/^\d+$/)) {
          return hostname;
        }
        const domain = domainParts.slice(-2).join('.');
        const storage_TOKEN_KEY = ls.get(STORAGE_TOKEN_KEY);
        docCookies.removeItem(storage_TOKEN_KEY, '/', domain);
      });
  }

  setToken(token: string) {
    store.dispatch(`user/${UPDATE_TOKEN}`, token);
    store.dispatch(`user/${GET_INFO}`);
  }

  static token() {
    return (
      getQueryStringParameter(location.href, 'token') ||
      store.state.user.token ||
      ls.get(STORAGE_TOKEN_KEY) ||
      (process.env.VUE_APP_COOKIE_DOMAIN &&
        (docCookies.getItem(STORAGE_TOKEN_KEY) === 'null'
          ? null
          : docCookies.getItem(STORAGE_TOKEN_KEY)))
    );
  }

  static sessionId() {
    const sessionId = getQueryStringParameter(location.href, 'sessionId');
    const routeSessionId = Number(sessionId) === 0 ? sessionId : Number(sessionId);
    return (
      routeSessionId ||
      store.state.user.sessionId ||
      ls.get(STORAGE_SESSION_ID) ||
      (process.env.VUE_APP_COOKIE_DOMAIN &&
        (docCookies.getItem(STORAGE_TOKEN_KEY) === 'null'
          ? null
          : docCookies.getItem(STORAGE_TOKEN_KEY)))
    );
  }

  static currentUser() {
    return store.state.user.currentUser;
  }

  static getCurrentUser() {
    return store.dispatch(`user/${GET_INFO}`);
  }
}
