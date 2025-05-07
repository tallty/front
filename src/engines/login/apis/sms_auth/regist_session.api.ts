import { VApiConfig } from '@/lib/vails/api/index';
import { AuthAppOptions, AuthSession } from '@/engines/login/types/model';
import { CLEAR, SET_FROM_SESSION } from '../../store/user/actions';
import store from '@/store';
import { MyApi } from '@/engines/base/apis/MyApi';

export class SmsAuthRegistApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/sms_auth',
      name: 'regist_session',
      mode: 'single',
      ...config,
    });
  }

  login(
    session: AuthSession,
    selectAppIdPromise = async (options: AuthAppOptions[]) => options[0]?.app_id,
  ) {
    return this.create({ ...session })
      .then(async res => {
        if (res.data.apps) {
          await selectAppIdPromise(res.data.apps).then(async appId => {
            console.log(appId, 'appId');

            await this.login({ ...session, specify_app_id: appId });
          });
        } else {
          await store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
        }
      })
      .catch(error => {
        // debugger;
        // message.error(error.response?.data?.message || '登录失败');
        store.dispatch(`user/${CLEAR}`);
        throw error;
      });
  }
}
