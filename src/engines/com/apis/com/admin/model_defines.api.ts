import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ComModelDefine } from '@/engines/com/types/model';

export class ComAdminModelDefinesApi extends MyApi<ComModelDefine> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/admin',
      name: 'model_define',
      ...config,
    });
  }
}
