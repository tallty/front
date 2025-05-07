import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { BpmDashboard } from '@/bpm-mobile/bpm-core/types/model';

export class BpmUserDashboardApi extends MyApi<BpmDashboard> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'dashboard',
      mode: 'single',
      ...config,
    });
  }
}
