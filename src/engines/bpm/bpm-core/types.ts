import { VObject } from '@/lib/vails/model';
import { TaCondition } from '../../../components/global/ta-component/actions/types';
import {
  TaTemplateFormAccessibility,
  TaTemplateFormComplexCondition,
  TaTemplateFormItem,
} from './ta-template-form-core/types';
import {
  DataFormFormSettingInterface,
  DataFormInterface,
} from '@/components/global/ta-component/ta-template-form-core/data_form/types';

export interface Workflow {
  id: number;
  created_at: string;
  updated_at: string;
  app_id: number;
  creator_id: number;
  type: string;
  name: string;
  desc: string;
  state: string;
  form: TaTemplateFormItem;
  core: WorkflowCore;
  token_actions: { actions: TokenAction[] };
  mod: { name: string };
  catalog_name: string;
  model_setting?: VObject;
  form_setting?: DataFormFormSettingInterface;
  form_setting_collection?: DataFormFormSettingInterface;
  meta?: VObject;
  enable_level?: boolean;
  level_options?: VObject;
  model_payload?: VObject;
}

export interface Instance {
  id: number;
  created_at: string;
  updated_at: string;
  app_id: number;
  workflow_id: number;
  workflow_name: string;
  creator_id: number;
  creator_name: string;
  creator_user: VObject;
  flowable_type: string;
  flowable_id: number;
  seq: string;
  type: string;
  form: TaTemplateFormItem;
  payload: VObject;
  storage: VObject;
  summary: VObject;
  state: string;
  auto_submit: boolean;
  flowable_flag: string;
  flowable_summary: VObject;
  flowable_info: VObject;
  tokens: Token[];
  current_token: Token;
  last_token: Token;
  enable_actions: TokenAction[];
  token_places: TokenPlace[];
  last_token_place: TokenPlace;
  model_setting?: {
    ref_model_setting_form?: TaTemplateFormItem;
  };
  unread: boolean;
  cache_payload?: VObject;
  token_place_infos?: TokenPlaceInfo[];
  summary_place_info?: {
    current_index: number; // 从 0 开始
    places: SummaryPlaceInfo[];
  };
  instance_relation_info?: Record<string, InstanceRelationInfo>;
  data_forms?: DataFormInterface[];
  data_form_form_setting?: DataFormFormSettingInterface;
  data_form_payload?: VObject;
  places: Place[];
  action_at: string;
  workflow_enable_level?: boolean;
  workflow_level_options?: VObject;
}

export interface InstanceRelationInfo {
  source_type?: string;
  source_id?: number;
  form?: TaTemplateFormItem;
  attributes?: VObject;
  seq?: string;
}

export interface TokenPlaceInfo {
  id: number;
  name: string;
  token_ids: number[];
  token_state: string;
  position: number;
}

export interface SummaryPlaceInfo {
  completed_at: string;
  id: number;
  index: number;
  name: string;
  position: number;
}

export interface Place {
  created_at: string;
  desc: string;
  fields: { fields: TaTemplateFormAccessibility[] };
  id: number;
  name: string;
  options: {
    rules?: PlaceRule[];
    user_options?: {
      user_ids: number[];
      org_ids: number[];
      duty_ids: number[];
      member_identity_ids: number[];
      department_ids: number[];
      role_ids: number[];
      ranks: string[];
      level: string;
      place_ids?: number[];
    };
  };
  place_form: TaTemplateFormItem;
  position: number;
  timer_options: VObject;
  trigger_options: VObject;
  type: string;
  updated_at: string;
  workflow_id: number;
  layout_options: VObject;

  seq: string;
  kind: string;
  previous_node: Partial<Place>;
  route_node: Partial<Place>;
  next_node?: Partial<Place> | null;
  transition_type: string;
  transition_options: VObject;
  condition?: PlaceRule;

  form_setting?: DataFormFormSettingInterface;
}

export interface PlaceRule {
  target?: {
    id: number;
    useless_id: number;
    seq: string;
  };
  index?: number;
  condition?: TaTemplateFormComplexCondition;
  is_default?: boolean;
  action_condition?: TaCondition;
}

export interface Token {
  id: number;
  created_at: string;
  updated_at: string;
  place_id: number;
  previous_token_id: number;
  operator_id: number;
  operator_name: string;
  instance_id: number;
  type: string;
  place_type: string;
  transition_type: string;
  name: string;
  state: string;
  comment: string;
  options: VObject;
  token_payload: VObject;
  handleable: boolean;
  spent_time_in_second: null | number;
  activate_source_id: number;
  activate_source_type: string;
  extra_token_info: VObject;
  operate_logs: VObject;
  action_info?: {
    action_name?: string;
  };
  token_source?: VObject;
  data_forms?: DataFormInterface[];
  data_form_form_setting?: DataFormFormSettingInterface;
  data_form_payload?: VObject;
}

export interface TokenAction {
  key: string; // 关键字
  name: string; // 名称
  enabled?: boolean;
  display?: string;
  display_name?: string; // 按钮名称
  action_flag?: string; // 次级关键字
  action_name?: string; // 完成文案
  desc?: string;
  callback?: () => void;
}

export interface TokenPlace {
  place: Place;
  token_state: string;
  tokens: Token[];
  token_source_template?: { form: TaTemplateFormItem };
}

export interface WorkflowCore {
  places: Place[];
  tree: WorkflowCoreTreeItem[];
}

export interface WorkflowCoreTreeItem {
  source: { id: number; seq: string };
  target: { id: number; seq: string };
}

export enum TransitionTypes {
  And = 'Transitions::AndApproval',
  Or = 'Transitions::OrApproval',
}

export enum PlaceTypes {
  ApprovalAssign = 'Places::ApprovalAssign', // 选择审批人
  Approval = 'Places::Approval', // 审批
  EndPlace = 'Places::EndPlace',
  Handle = 'Places::Handle', // 办理
  NotifyAssign = 'Places::NotifyAssign', // 选择抄送人
  Notify = 'Places::Notify', // 抄送
  Route = 'Places::Route', // 条件分支
  StartPlace = 'Places::StartPlace',
  Trigger = 'Places::Trigger',
}

export enum TokenTypes {
  Approval = 'Tokens::Approval',
  Assign = 'Tokens::Assign',
  Callback = 'Tokens::Callback',
  Condition = 'Tokens::Condition',
  Finish = 'Tokens::Finish',
  ForwardFrom = 'Tokens::ForwardFrom',
  ForwardTo = 'Tokens::ForwardTo',
  Handle = 'Tokens::Handle',
  Confirm = 'Tokens::Confirm',
  Notify = 'Tokens::Notify',
  Submit = 'Tokens::Submit',
  Deliver = 'Tokens::Deliver',
}

export interface PlaceMenuTemplate {
  name: string;
  desc: string;
  icon: string;
  type: string;
  transition_type?: string;
  isRoute?: boolean;
  options: VObject;
  payload?: {
    [key: string]: any;
  };
}

export enum WorkflowState {
  Todo = 'todo',
  Done = 'done',
}

// api callback
export interface ApiKeyAttr {
  key: string; // form里面定义的属性key
  key_name: string; // form里面原来属性的名称
  name: string; // 回调映射的属性名称
}

export interface BpmModelSetting {
  id: number;
  flag: string;
  flag_name: string;
  workflow: Workflow;
}
