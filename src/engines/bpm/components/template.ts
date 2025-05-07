import { VObject } from '@/lib/vails';
import { Workflow } from '../bpm-core/types';
import TaFormSettingDesigner from '@/components/global/ta-component/data_forms/TaFormSettingDesigner.vue';
import { getWorkflowAllDataFormOptions } from '../bpm-core/apis/user/workflowl.api';
import ComBpmFlowTreeEditor from '@/engines/bpm/components/designer/ComBpmFlowTreeEditor.vue';

export const getBpmWorklfowFormSteps = (workflowTemplate: VObject, payload: Workflow) => {
  return [
    {
      title: '基本信息',
      type: 'form',
      form: workflowTemplate,
    },
    {
      title: '表单',
      type: 'dynamicComponent',
      dynamicComponent: TaFormSettingDesigner,
      bindKey: 'value',
      modelKeyPrefix: 'form_setting',
      options: {
        props: {
          title: '工作流表单',
          dataFormOptions: getWorkflowAllDataFormOptions(payload),
        },
      },
    },
    {
      title: '流程',
      type: 'dynamicComponent',
      dynamicComponent: ComBpmFlowTreeEditor,
      bindKey: 'workflow',
    },
  ];
};

export const bpmCommentTemplate = {
  type: 'layout',
  model: {},
  key: 'layout_1656575476022_0',
  model_key: 'layout_1656575476022_0',
  fields: [
    // {
    //   name: '标题',
    //   icon: 'FolderOutlined',
    //   type: 'input',
    //   rules: [],
    //   model: { attr_type: 'string' },
    //   options: { span: 24 },
    //   key: 'input_1656575478516_1',
    //   model_key: 'title',
    //   fields: [],
    //   conditions: [],
    //   model_key_prefix: '',
    // },
    {
      name: '',
      icon: 'FolderOutlined',
      type: 'rich_text',
      rules: [],
      model: { attr_type: 'string' },
      options: { span: 24 },
      key: 'rich_text_1656575482199_2',
      model_key: 'body',
      fields: [],
      conditions: [],
      model_key_prefix: '',
    },
  ],
  conditions: [],
  options: {
    label: { width: 40, algin: 'left' },
    disabled_actions: {},
    theme: null,
    create_text: '提交',
    update_text: '提交',
    layout: 'horizontal',
  },
  actions: [
    { key: 'create', enabled: true },
    { key: 'update', enabled: true },
    { key: 'delete', enabled: true },
    { key: 'import', enabled: true },
    { key: 'export', enabled: true },
  ],
  rich_text_1656575482199_2: '<p><br></p>',
  column_attributes: [],
};
