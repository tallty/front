import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { SmsAuthUserAccount } from '@/engines/login/types/model';
import store from '@/store';
import { CLEAR, SET_FROM_SESSION } from '../../store/user/actions';

type LoginSession = {
  app_id: string;
  user_id: number;
  openid: number;
  oauth_app_id: string;
  verify_code: string;
  account: string;
};
export class SmsAuthUserAccountApi extends MyApi<SmsAuthUserAccount> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/sms_auth',
      name: 'user_account',
      mode: 'single',
      ...config,
    });
  }

  login(session: LoginSession) {
    return this.create({
      ...session,
    } as any)
      .then(async res => {
        await store.dispatch(`user/${SET_FROM_SESSION}`, res.data);
      })
      .catch(error => {
        store.dispatch(`user/${CLEAR}`);
        throw error;
      });
  }
}
