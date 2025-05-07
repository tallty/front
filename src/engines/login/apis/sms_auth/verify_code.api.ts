import { VApiConfig } from '@/lib/vails/api/index';
import { AuthSession } from '@/engines/login/types/model';
import { MyApi } from '@/engines/base/apis/MyApi';

export class SmsAuthVerifyCodeApi extends MyApi<AuthSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/sms_auth',
      name: 'verify_code',
      mode: 'single',
      ...config,
    });
  }
}
