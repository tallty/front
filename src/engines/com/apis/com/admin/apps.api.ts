import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComApp } from '@/engines/com/types/model';

export class ComAdminAppsApi extends MyApi<ComApp> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/admin',
      name: 'app',
      ...config,
    });
  }
}
