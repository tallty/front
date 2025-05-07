import { MyApi } from '@/apis/MyApi';
import { VApiConfig } from '@/lib/vails/api';
import { Place, Workflow } from '../../types';
import { VModel, VObject } from '@/lib/vails';
import { FormSetting } from '@/components/global/ta-component/ta-template-form-core/data_form/form_setting';
import { TaTemplateFormItem, TaTemplateFormSelect } from '../../ta-template-form-core/types';

export class BpmUserWorkflows extends MyApi<Workflow> {
  constructor(config?: VApiConfig) {
    super({
      namespace: '/bpm/user',
      name: 'workflow',
      actions: [
        { method: 'post', name: 'star', on: 'member' },
        { method: 'post', name: 'unstar', on: 'member' },
        { method: 'post', name: 'statistic', on: 'collection' },
      ],
      ...config,
    });
  }
}

export const getWorkflowAllDataFormOptions = (workflow: Workflow): TaTemplateFormSelect[] => {
  return [
    ...getWorkflowSelfDataFormOptions(workflow),
    ...(workflow.model_setting?.form_setting
      ? new FormSetting(workflow.model_setting?.form_setting).getDataFormOptions(`关联对象表单`)
      : []),
    ...(workflow.core?.places || [])
      .map((place: Place) =>
        place.form_setting
          ? new FormSetting(place.form_setting).isEmpty
            ? []
            : new FormSetting(place.form_setting).getDataFormOptions(`节点表单(${place.name})`)
          : [],
      )
      .reduce((a: TaTemplateFormSelect[], b: TaTemplateFormSelect[]) => [...a, ...b], []),
  ];
};

export const getWorkflowSelfDataFormOptions = (workflow: Workflow): TaTemplateFormSelect[] => {
  return workflow.form_setting
    ? new FormSetting(workflow.form_setting).getDataFormOptions('工作流表单', (args: VObject) => {
        const extraAttrs: TaTemplateFormItem[] = (workflow.meta?.workflow_attributes || []).map(
          (o: any) => ({
            key: o.attr,
            name: o.name,
            layout: {},
            model: {
              attr_type: o.attr_type || 'number',
            },
          }),
        );
        return { form: { ...args.form, fields: [...(args.form?.fields || []), ...extraAttrs] } };
      })
    : [];
};
