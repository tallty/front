import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';
import { VObject } from '@/lib/vails';
import { IFile } from '../../../components/global/ta-component/file/servers/types';

export interface ResUser {
  id: number;
  account: string;
  name: string;
  mobile: string;
  email: string;
  identity_id?: string;
  avatar?: { files: IFile[] };
  app_id: number;
  created_at: string;
  department_names: Array<string>;
  duty_names: Array<string>;
  effective_at: string;
  gender: string;
  invalid_at: string;
  member_identity_ids: Array<string>;
  member_identity_names: Array<string>;
  members: Array<VObject>;
  memberships_with_invalid: Array<VObject>;
  model_flag: VObject;
  model_payload?: VObject;
  nickname: string;
  roles_label: Array<string>;
  roles_name: Array<string>;
  updated_at: string;
  users_roles: Array<VObject>;
  org_names: Array<string>;
}

export interface ResMemberIdentity {
  id: number;
  member_identity_id: number;
  member_type: string;
  type: string;
  memberships: ResMembership[];
  memberships_with_invalid_attributes: {
    id?: number;
    org_id: number;
    _destroy?: boolean;
  }[];
  duty_names: string[];
  org_names: string[];
  department_names: string[];
}

export interface ResMemberIdentity {
  id: number;
  name: string;
  form: TaTemplateFormItem;
  org_id: number;
  org_name: string;
}

export interface ResDutyGroup {
  id: number;
  app_id: number;
  name: string;
  position: number;
  duties: ResDuty[];
  org_id: number;
}

interface ResDuty {
  id: number;
  duty_group_id: number;
  name: string;
  position: number;
  org_id: number;
  org_name: string;
  duty_group_name: string;
  user_names: Array<string>;
  rank: string;
}

export interface ResMembership {
  id: number;
  member_id: number;
  user_id: number;
  duty_id: number;
  org_id: number;
  user: ResUser;
  effective_at: string;
  invalid_at: string;
  member_type: string;
  flowable_instance_infos: Array<VObject>;
  effective_state: string;
  effective: boolean;
}

export interface SoaAuthPassword {
  old_password?: string;
  new_password?: string;
  id: number;
}

export interface ResOrg {
  id: number;
  name: string;
  code: string;
  ancestry: string;
  app_id: number;
  children_count: number;
  created_at: string;
  depth: number;
  model_payload: VObject;
  model_payload_summary: VObject;
  org_identity_id: number;
  org_identity_name: string;
  org_type: string;
  parent_id: number;
  position: number;
  short_name: string;
  type: string;
  updated_at: string;
  ancestor_names: Array<string>;
}

export interface ResOrgIdentity {
  id: number;
}

export interface ResDepartment {
  id: number;
  parent_id?: number;
  code: string;
  name: string;
  short_name: string;
  department_identity_color: string;
  department_identity_name: string;
  department_identity_id: number;
  children_count: number;
  ancestor_names: Array<string>;
  ancestry: string;
  created_at: string;
  department_type: string;
  depth: number;
  org_id: number;
  org_name: string;
  path_names: Array<string>;
  position: number;
  root_org_id: number;
  type: string;
  updated_at: string;
  children_names: Array<string>;
  user_names: Array<string>;
}

export interface ResDepartmentIdentity {
  type?: string;
  id: number;
}

export interface User {
  id: number;
}

export type ResMember = VObject;

export interface ResTanent {
  id: number;
  name: string;
  code: string;
}

export interface ResOrgMemberIdentity {
  id: number;
  name: string;
  form: VObject;
}

export interface ResOrgMember {
  id: number;
  name: string;
  payload: VObject;
}

export interface ResMemberRequest {
  id: number;
  state: string;
  create_instance_id: number;
  model_payload: VObject;
  created_at: string;
}
