import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComRouteSetting } from '@/engines/permit/model';

export class ComAdminRouteSettingsApi extends MyApi<ComRouteSetting> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/permit/admin',
      name: 'route_setting',
      ...config,
    });
  }
}
