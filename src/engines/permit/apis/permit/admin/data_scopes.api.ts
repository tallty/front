import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PermitDataScope } from '@/engines/permit/types/model';

export class PermitAdminDataScopesApi extends MyApi<PermitDataScope> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'data_scope',
      ...config,
    });
  }
}
