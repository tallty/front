import { MyApi } from '@/apis/MyApi';
import { FormSetting } from '@/components/global/ta-component/ta-template-form-core/data_form/form_setting';
import {
  TaTemplateFormItem,
  TaTemplateFormStepsStep,
} from '@/components/global/ta-component/ta-template-form-core/types';
import useProcessFields from '@/components/global/ta-component/ta-template-form-core/useProcessFields';
import { VModel } from '@/lib/vails';
import { VApiConfig } from '@/lib/vails/api';
import { VObject } from '@/lib/vails/model/index';
import dayjs from 'dayjs';
import { PlaceTypes, Workflow } from '../../types';

export class BpmAdminWorkflows extends MyApi<Workflow> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/admin/',
      name: 'workflow',
      actions: [
        { method: 'post', name: 'clone', on: 'member' },
        { method: 'post', name: 'ta_resource_statistic', on: 'member' },
      ],
      ...config,
    });
  }
}

const { getFormAllAccessibilityHidden } = useProcessFields();

export class WorkflowModel extends VModel<Workflow> {
  static stateZhMapping: VObject = {
    todo: '未发布',
    done: '已发布',
    archived: '已归档',
  };

  stateZh = this.computedAttr('stateZh', () => {
    return WorkflowModel.stateZhMapping[this.reactiveRecord.state] || '未知状态';
  });

  createdAtStr = this.computedAttr('createdAtStr', () => {
    return dayjs(this.reactiveRecord.created_at).format('YYYY-MM-DD HH:mm');
  });

  updatedAtStr = this.computedAttr('updatedAtStr', () => {
    return dayjs(this.reactiveRecord.updated_at).format('YYYY-MM-DD HH:mm');
  });

  startPlace = this.computedAttr('startPlace', () => {
    return this.reactiveRecord.core?.places?.find(place => place.type === PlaceTypes.StartPlace);
  });

  accessibility = this.computedAttr('accessibility', () => {
    return this.startPlace.value?.fields?.fields || [];
  });

  fireAction = (action: 'star' | 'unstar') => {
    return this.store!.sendMemberAction({
      action,
      id: this.reactiveRecord.id,
    }).then(res => {
      // 需要强制重渲染一下页面
      Object.assign(this, res.data);
    });
  };

  // instanceFlowableForm = this.computedAttr('instanceFlowableForm', () => {
  //   return this.reactiveRecord.model_setting?.ref_model_setting_form || null;
  // });

  formSetting = this.computedAttr('formSetting', () => {
    return this.reactiveRecord.form_setting_collection
      ? new FormSetting(this.reactiveRecord.form_setting_collection)
      : null;
  });

  formAllAccessibilityHidden = this.computedAttr('formAllAccessibilityHidden', () => {
    return (
      this.formSetting.value?.isEmpty ||
      this.formSetting.value?.steps?.every((step: TaTemplateFormStepsStep) => {
        return (
          (step.type == 'form' &&
            getFormAllAccessibilityHidden(
              step.form as TaTemplateFormItem,
              {},
              this.accessibility.value,
            )) ||
          (step.type == 'dynamicComponent' && !step.dynamicComponent)
        );
      })
    );
  });
}

export const getWorkflowLevelSteps = (levelOptions: VObject) => {
  return [
    {
      title: '',
      type: 'form',
      form: {
        type: 'container_layout',
        key: 'container_layout_1730707079283_1',
        model_key: 'container_layout_1730707079283_1',
        model_key_configuration: [],
        fields: [
          {
            name: '优先级',
            icon: 'FolderOutlined',
            type: 'radio',
            rules: [],
            model: { attr_type: 'string' },
            options: {
              select: (levelOptions?.option_labels || ['A', 'B', 'C', 'D']).map(
                (label: string, index: number) => ({
                  label,
                  id: `1730707091873_0_${index}`,
                }),
              ),
              multiple: false,
              span: 24,
              table_items: [],
              display_configurable_form: {},
              import_export_headers: [{ _id: '1730707089158_0' }],
            },
            key: 'radio_1730707087940_2',
            model_key: 'level',
            model_key_configuration: [],
            fields: [],
            conditions: [],
            model_key_prefix: '',
          },
        ],
        conditions: [],
        options: {
          label: {},
          disabled_actions: {},
          theme: { card: {}, background: {}, form: {} },
        },
        model: { create_default_value: {}, update_default_value: {} },
      },
    },
  ];
};
