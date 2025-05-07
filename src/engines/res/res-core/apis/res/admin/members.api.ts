import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResMember } from '@/engines/res/res-core/model';

export class ResAdminMembersApi extends MyApi<ResMember> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/admin',
      name: 'member',
      actions: [{ name: 'batch_destroy', method: 'delete', on: 'collection' }],
      ...config,
    });
  }
}
