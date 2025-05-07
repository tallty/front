import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmModelSetting } from '../../types';

export class BpmFlowableModelSettingsApi extends MyApi<BpmModelSetting> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/flowable',
      name: 'model_setting',
      ...config,
    });
  }
}
