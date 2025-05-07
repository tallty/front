import { permitTemplate } from '@/engines/res/permitTemplate';
import { TaTemplateFormItem } from '../../../../../../components/global/ta-component/ta-template-form-core/types';
import { TokenAction, Workflow } from '../../../../bpm-core/types';
import {
  getTriggerParticalTemplate,
  submitOptions,
} from '../../../../components/designer/nodeEditor/template';
import { VObject } from '@/lib/vails';

export const getWorkflowTemplate = (tokenActions?: TokenAction[]): TaTemplateFormItem => {
  return {
    type: 'layout',
    model: {},
    key: 'layout_1619171398521_0',
    model_key: 'layout_1619171398521_0',
    fields: [
      {
        name: '普通布局',
        type: 'layout',
        fields: [
          {
            key: 'input_1634969175476_1',
            name: '名称',
            type: 'input',
            model: {
              attr_type: 'string',
            },
            rules: [
              {
                type: 'string',
                message: '请填写正确的名称',
                required: true,
                rule_type: 'required',
              },
            ],
            fields: [],
            options: {
              span: 24,
            },
            model_key: 'name',
            conditions: [],
            model_key_prefix: '',
          },
          {
            key: 'input_1634969203999_2',
            name: '图标',
            type: 'input',
            model: {
              attr_type: 'string',
            },
            rules: [],
            fields: [],
            options: {
              span: 24,
            },
            model_key: 'icon',
            conditions: [],
            model_key_prefix: '',
          },
          {
            name: '描述',
            type: 'textarea',
            rules: [],
            model: {
              attr_type: 'string',
            },
            options: {
              span: 24,
              placeholder: '请输入工作流程的描述',
            },
            key: 'textarea_1652757288227_2',
            model_key: 'desc',
            fields: [],
            conditions: [],
            model_key_prefix: '',
          },
          {
            key: 'radio_1634969227063_3',
            name: '状态',
            type: 'radio',
            model: {
              attr_type: 'string',
            },
            rules: [
              {
                type: 'string',
                message: '请填写正确的状态',
                required: true,
                rule_type: 'required',
              },
            ],
            fields: [],
            options: {
              span: 24,
              select: [
                {
                  label: '草稿箱',
                  value: 'todo',
                },
                {
                  label: '已发布',
                  value: 'done',
                },
                {
                  label: '已归档',
                  value: 'archived',
                },
              ],
              multiple: false,
            },
            model_key: 'state',
            conditions: [],
            model_key_prefix: '',
          },
          {
            key: 'file_1668503605357_3',
            name: '打印模板',
            type: 'file',
            model: {
              attr_type: 'array',
            },
            rules: [],
            fields: [],
            actions: [],
            options: {
              span: 24,
              multiple: true,
            },
            model_key: 'conf.files',
            conditions: [],
            index_attributes: [],
            model_key_prefix: '',
            column_attributes: [],
            model_key_configuration: [],
          },
          {
            key: 'radio_1634969301574_4',
            name: '工作流类型',
            type: 'radio',
            model: {
              attr_type: 'string',
            },
            rules: [],
            fields: [],
            options: {
              span: 24,
              select: [
                {
                  label: '直接发起',
                  value: 'direct',
                },
                {
                  label: '关联发起',
                  value: 'flow',
                },
              ],
              multiple: false,
              defaultValue: 'direct',
            },
            model_key: 'classify',
            conditions: [],
            model_key_prefix: '',
          },
          {
            key: 'api_single_1634969434888_7',
            name: '分类',
            type: 'api_single',
            model: {
              attr_type: 'number',
            },
            rules: [],
            fields: [],
            options: {
              path: 'bpm/admin/catalogs',
              span: 24,
              table_items: [
                {
                  name: '分类ID',
                  type: 'string',
                  search: false,
                  data_index: 'id',
                },
                {
                  name: '分类名称',
                  type: 'string',
                  search: true,
                  data_index: 'name',
                },
              ],
            },
            model_key: 'catalog_id',
            conditions: [],
            model_key_prefix: '',
          },
          {
            key: 'api_single_1634969434888_7',
            name: 'mod',
            type: 'api_single',
            model: {
              attr_type: 'number',
            },
            rules: [],
            fields: [],
            options: {
              path: 'com/user/mods',
              span: 24,
              table_items: [
                {
                  name: 'ID',
                  type: 'string',
                  search: false,
                  data_index: 'id',
                },
                {
                  name: '名称',
                  type: 'string',
                  search: true,
                  data_index: 'name',
                },
              ],
            },
            model_key: 'mod_id',
            conditions: [],
            model_key_prefix: '',
          },
          permitTemplate,
          submitOptions,
          {
            type: 'layout',
            key: 'container_layout_1730705731189_1',
            model_key: 'container_layout_1730705731189_1',
            model_key_configuration: [],
            fields: [
              {
                name: '是否启用优先级',
                type: 'switch',
                rules: [],
                model: { attr_type: 'boolean' },
                options: {
                  multiple: false,
                  span: 24,
                  select: [
                    { label: '', value: '' },
                    { label: '', value: '' },
                  ],
                },
                key: 'switch_1730705739181_2',
                model_key: 'enable_level',
                model_key_configuration: [],
                fields: [],
                conditions: [],
                model_key_prefix: '',
              },
              {
                name: '条件块',
                type: 'condition',
                conditions: [
                  {
                    name: '条件1',
                    model_key: '',
                    val: '',
                    fields: [
                      {
                        name: '优先级可选值',
                        type: 'string_array',
                        rules: [],
                        model: { attr_type: 'array' },
                        options: { span: 24, defaultValue: ['A', 'B', 'C', 'D'] },
                        key: 'string_array_1730706242924_6',
                        model_key: 'level_options.option_labels',
                        model_key_configuration: [],
                        fields: [],
                        conditions: [],
                        model_key_prefix: '',
                      },
                    ],
                    type: 'complex',
                    complex_condition: {
                      groups: [
                        {
                          items: [
                            {
                              _id: '1730706227494_0',
                              rule: {
                                type: 'Com::Attr::ConditionRules::Boolean',
                                key: 'enable_level',
                                key_name: '是否启用优先级',
                                opt: '==',
                                val: true,
                              },
                              desc: {
                                name: '是否启用优先级',
                                optZh: '等于',
                                modelValue: { rule: { val: true } },
                                template: {
                                  key: 'key',
                                  type: 'layout',
                                  fields: [
                                    {
                                      key: 'switch_1632802235314_19',
                                      name: '值',
                                      type: 'switch',
                                      model: { attr_type: 'boolean' },
                                      rules: [],
                                      fields: [],
                                      options: { span: 24, placeholder: '' },
                                      model_key: 'val',
                                      conditions: [],
                                      model_key_prefix: 'rule',
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                options: { span: 24 },
                key: 'condition_1730706222752_3',
                model_key: 'condition_1730706222752_3',
                model_key_configuration: [],
                fields: [],
                model_key_prefix: '',
              },
            ],
            conditions: [],
            options: {
              label: { width: 300 },
              disabled_actions: {},
              theme: { card: {}, background: {}, form: {} },
            },
            model: { create_default_value: {}, update_default_value: {} },
          },
          // getTriggerParticalTemplate(tokenActions),
        ],
        options: { span: 24, label: { align: 'left', width: 80 } },
        key: 'layout_1619171401544_1',
        model_key: 'layout_1619171401544_1',
      },
    ],
    options: { theme: 'none' },
  };
};
