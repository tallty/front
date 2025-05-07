import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { PermitMod } from '@/engines/permit/model';

export class PermitAdminModsApi extends MyApi<PermitMod> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'mod',
      ...config,
    });
  }
}
