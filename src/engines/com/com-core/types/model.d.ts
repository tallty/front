import { VObject } from '@/lib/vails';

export interface VersionRelationship {
  id: number;
  created_at: string;
  real_resource_type: string;
  real_resource_id: string;
  resource_id: string;
  resource_type: string;
  version: PaperTrailVersion;
}
export interface PaperTrailVersion {
  id: number;
  created_at: string;
  event: string;
  object_changes: VObject;
  model_info?: VObject;
  controller_info?: VObject;
}
