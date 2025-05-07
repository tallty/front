import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResUser } from '@/engines/res/res-core/model';

export class ResAdminUsersApi extends MyApi<ResUser> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/admin',
      name: 'user',
      ...config,
    });
  }
}
