import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';

export class ComUserDynamicTasksApi extends MyApi<any> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/com/user',
      name: 'async_task',
      ...config,
    });
  }
}
