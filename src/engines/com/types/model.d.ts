import { VObject } from '../../../lib/vails/model/index';
import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';
import { DataFormFormSettingInterface } from '@/components/global/ta-component/ta-template-form-core/data_form/types';

export interface ComTheme {
  id: number;
  model_payload: VObject;
}

export interface FormsTemplate {
  id: number;
  uuid: number;
  form: TaTemplateFormItem;
}

export interface ComModelSetting {
  id?: number;
  bpm_workflow_id?: number;
  flag: string;
  form: TaTemplateFormItem;
  form_setting: DataFormFormSettingInterface;
}

export interface ComModelDefine {
  id?: number;
  klass_singular?: string;
}

export interface ComSearchItem {
  id: number;
  name: string;
  position: number;
  group_name: string;
  enabled: boolean;
  conditions: { items: ComSearchItemCondition[] };
}

export interface ComSearchItemCondition {
  key: string;
  value: any;
}
export interface ComPrivatePolicy {
  id: number;
}
export interface ComApp {
  id: number;
}

export interface ComPaperTrailVersion {
  id: number;
}
