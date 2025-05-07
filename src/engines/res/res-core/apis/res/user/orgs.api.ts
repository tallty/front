import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResOrg } from '@/engines/res/res-core/types/model';

export class ResUserOrgsApi extends MyApi<ResOrg> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/user',
      name: 'org',
      actions: [
        { name: 'search', method: 'get', on: 'collection' },
        { name: 'exit', method: 'post', on: 'member' },
      ],
      ...config,
    });
  }
}
