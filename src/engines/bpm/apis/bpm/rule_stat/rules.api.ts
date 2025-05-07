import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmRule } from '@/engines/bpm/types/model';

export class BpmRuleStatRulesApi extends MyApi<BpmRule> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/rule_stat',
      name: 'rule',
      ...config,
    });
  }
}
