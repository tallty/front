import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PermitRole } from '@/engines/permit/model';

export class PermitAdminPermissionsApi extends MyApi<any> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'permission',
      ...config,
    });
  }
}
