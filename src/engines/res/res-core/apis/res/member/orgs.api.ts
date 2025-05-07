import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResOrg } from '@/engines/res/res-core/types/model';

export class ResMemberOrgsApi extends MyApi<ResOrg> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/member',
      name: 'org',
      ...config,
    });
  }
}
