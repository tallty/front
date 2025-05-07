import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { TofuMod } from '../../../../model';

export class TofuAdminPcModsApi extends MyApi<TofuMod> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/tofu/admin/',
      name: 'mod',
      ...config,
    });
  }
}
