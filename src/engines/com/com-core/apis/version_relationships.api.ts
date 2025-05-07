import { VApiConfig } from '@/lib/vails/api';
import { MyApi } from '@/apis/MyApi';
import { VersionRelationship } from '../types/model';

export class VersionRelationshipsApi extends MyApi<VersionRelationship> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '',
      name: 'version_relationship',
      ...config,
    });
  }
}
