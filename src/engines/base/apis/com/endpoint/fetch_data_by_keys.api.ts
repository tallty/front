import { MyApi } from './../../MyApi';
import { VApiConfig } from '@/lib/vails/api';
import { VModel, VObject } from '@/lib/vails/model/index';

export class ComEndpointsFetchDataByKeysApi extends MyApi<VObject> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/endpoints',
      name: 'fetch_data_by_key',
      wrapParams: false,
      ...config,
    });
  }
}
