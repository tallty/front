import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResOrg } from '@/engines/res/res-core/model';

export class ResAdminOrgsApi extends MyApi<ResOrg> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/admin',
      name: 'org',
      ...config,
    });
  }
}
