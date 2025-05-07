import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { TofuMod } from '../../../../model';

export class TofuUserPcModsApi extends MyApi<TofuMod> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/tofu/user/',
      name: 'mod',
      ...config,
    });
  }
}
