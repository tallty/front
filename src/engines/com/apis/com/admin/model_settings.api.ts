import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComModelSetting } from '@/engines/com/types/model';

export class ComAdminModelSettingsApi extends MyApi<ComModelSetting> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/admin',
      name: 'model_setting',
      mode: 'shallow',
      ...config,
    });
  }
}
