import { VApiConfig } from '@/lib/vails/api/index';
import { AuthSession } from '@/engines/login/types/model';
import { CLEAR, SET_FROM_SESSION } from '../../store/user/actions';
import store from '@/store';
import { MyApi } from '@/engines/base/apis/MyApi';

export class SmsAuthSessionApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/sms_auth',
      name: 'session',
      mode: 'single',
      ...config,
    });
  }

  login(session: AuthSession) {
    return this.create({ ...session })
      .then(async res => {
        await store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
      })
      .catch(error => {
        store.dispatch(`user/${CLEAR}`);
        throw error;
      });
  }
}
