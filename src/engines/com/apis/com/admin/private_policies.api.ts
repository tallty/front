import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComPrivatePolicy } from '@/engines/com/types/model';

export class ComAdminPrivatePoliciesApi extends MyApi<ComPrivatePolicy> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/admin',
      name: 'private_policy',
      ...config,
    });
  }
}
