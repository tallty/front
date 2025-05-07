import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { SoaSession } from '@/engines/login/types/model';

export class SoaOauthSessionApi extends MyApi<SoaSession> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/soa-auth/oauth',
      name: 'session',
      actions: [{ name: 'account_create_bind', method: 'post', on: 'collection' }],
      mode: 'single',
      ...config,
    });
  }
}
