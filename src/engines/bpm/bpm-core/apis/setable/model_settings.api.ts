import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmModelSetting } from '../../types';

export class BpmSetableModelSettingsApi extends MyApi<BpmModelSetting> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/setable',
      name: 'model_setting',
      ...config,
    });
  }
}
