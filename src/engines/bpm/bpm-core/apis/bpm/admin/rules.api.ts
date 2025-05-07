import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmRule } from '@/engines/bpm/bpm-core/types/model';

export class BpmAdminRulesApi extends MyApi<BpmRule> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin',
      name: 'rule',
      ...config,
    });
  }
}
