import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { FormsTemplate } from '@/engines/com/types/model';

export class FormsUserSetableTemplateApi extends MyApi<FormsTemplate> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/forms/user/setable',
      name: 'template',
      mode: 'single',
      ...config,
    });
  }
}
