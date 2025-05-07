import { VApiConfig } from '@/lib/vails/api/index';
import { AuthSession } from '@/engines/login/types/model';
import { MyApi } from '@/engines/base/apis/MyApi';

export class SmsAuthRegistCodeApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/sms_auth',
      name: 'regist_code',
      mode: 'single',
      ...config,
    });
  }
}

export class EmailAuthRegistCodeApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/mail_auth',
      name: 'regist_code',
      mode: 'single',
      ...config,
    });
  }
}
