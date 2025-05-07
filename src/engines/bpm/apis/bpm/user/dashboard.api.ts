import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { VObject } from '@/lib/vails/model/index';

export class BpmUserDashboardApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'dashboard',
      mode: 'single',
      ...config,
    });
  }
}
