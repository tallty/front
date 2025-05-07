import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { ResDepartment } from '@/engines/res/res-core/types/model';

export class ResMemberDepartmentsApi extends MyApi<ResDepartment> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/res/member',
      name: 'department',
      ...config,
    });
  }
}
