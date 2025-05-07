import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResMembership } from '@/engines/res/res-core/model';

export class ResAdminSubtreeMembershipsApi extends MyApi<ResMembership> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/admin/subtree',
      name: 'membership',
      ...config,
    });
  }
}
