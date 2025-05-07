import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { FormsTemplate } from '@/engines/com/types/model';

export class FormsAdminTemplatesApi extends MyApi<FormsTemplate> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/forms/admin',
      name: 'template',
      ...config,
    });
  }
}
