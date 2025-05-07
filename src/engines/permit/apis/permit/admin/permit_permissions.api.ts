import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PermitPermitPermission } from '@/engines/permit/types/model';

export class PermitAdminPermitPermissionsApi extends MyApi<PermitPermitPermission> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'permit_permission',
      actions: [
        { name: 'clear', method: 'post', on: 'collection' },
        { name: 'reload', method: 'post', on: 'collection' },
      ],
      ...config,
    });
  }
}
