import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PermitRole } from '@/engines/permit/model';

export class PermitAdminRolesApi extends MyApi<PermitRole> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'role',
      actions: [{ name: 'remove_relation', method: 'post', on: 'member' }],
      ...config,
    });
  }
}
