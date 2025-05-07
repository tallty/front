import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResMember } from '@/engines/res/res-core/model';

export class ResMemberMembersApi extends MyApi<ResMember> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/member',
      name: 'member',
      ...config,
    });
  }
}
