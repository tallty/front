import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';
import { TokenAction } from '@/engines/bpm/bpm-core/types';
import { TaTemplateFormSelect } from '../../../../../components/global/ta-component/ta-template-form-core/types';
import { TokenModel } from '../../../bpm-core/apis/user/token.api';

let nonce = 1;
const zhMap = TokenModel.tokenActionZhMap();
export const defaultTokenActionsOptions = [
  { value: 'submit', label: `${zhMap.submit}【submit】` },
  { value: 'complete', label: `${zhMap.complete}【complete】` },
  { value: 'print', label: `${zhMap.print}【print】` },
  { value: 'edit', label: `${zhMap.edit}【edit】` },
  { value: 'assign', label: `${zhMap.assign}【assign】` },
  { value: 'forward', label: `${zhMap.forward}【forward】` },
  { value: 'recall', label: `${zhMap.recall}【recall】` },
  { value: 'reject', label: `${zhMap.reject}【reject】` },
  { value: 'fail', label: `${zhMap.fail}【fail】` },
  { value: 'terminate', label: `${zhMap.terminate}【terminate】` },
];
export const levelDutyRankSelect = [
  {
    label: '正职',
    value: 'general_manager',
  },
  {
    label: '副职',
    value: 'deputy_manager',
  },
  {
    label: '员工',
    value: 'employee',
  },
];
export const levelDutyRankPositionSelect = [
  {
    label: '1级', // 普通职员级
    value: '1',
  },
  {
    label: '2级', // 副主管级
    value: '2',
  },
  {
    label: '3级', // 主管级
    value: '3',
  },
  {
    label: '4级', // 副总监级
    value: '4',
  },
  {
    label: '5级', // 总监级
    value: '5',
  },
  {
    label: '6级', // 高级总监级
    value: '6',
  },
  {
    label: '7级', // 副总裁级
    value: '7',
  },
  {
    label: '8级', // 总裁级
    value: '8',
  },
  {
    label: '9级', // 首席级
    value: '9',
  },
  {
    label: '10级', // 董事级
    value: '10',
  },
];

export const getCallbackTemplate = (
  types = [
    'Bpm::Attr::FlowableCallback',
    'Bpm::Attr::FunctionCallback',
    'Bpm::Attr::SmsNotifyCallback',
    'Bpm::Attr::UpdateFlowableCallback',
  ],
  modelKeyPrefix = '',
): TaTemplateFormItem => {
  nonce += 1;
  const model_key_prefix = [modelKeyPrefix, 'callback'].filter(i => i).join('.');
  return {
    key: `layout_1631084420310_5${nonce}`,
    name: '普通布局',
    type: 'layout',
    fields: [
      {
        key: `key_layout_1631084463489_7${nonce}`,
        name: '回调',
        type: 'key_layout',
        fields: [
          {
            key: `radio_1631084479672_8${nonce}`,
            name: '回调类型',
            type: 'radio',
            model: { attr_type: 'string' },
            rules: [],
            fields: [],
            options: {
              span: 24,
              select: [
                ...(types.includes('Bpm::Attr::FlowableCallback')
                  ? [{ label: '对象回调', value: 'Bpm::Attr::FlowableCallback' }]
                  : []),
                ...(types.includes('Bpm::Attr::FunctionCallback')
                  ? [{ label: '类回调', value: 'Bpm::Attr::FunctionCallback' }]
                  : []),
                ...(types.includes('Bpm::Attr::SmsNotifyCallback')
                  ? [{ label: '短信回调', value: 'Bpm::Attr::SmsNotifyCallback' }]
                  : []),
                ...(types.includes('Bpm::Attr::UpdateFlowableCallback')
                  ? [{ label: '更新关联对象', value: 'Bpm::Attr::UpdateFlowableCallback' }]
                  : []),
              ],
              multiple: false,
              table_items: [],
              display_configurable_form: {},
            },
            model_key: 'type',
            conditions: [],
            model_key_prefix,
          },
          {
            key: `condition_1631084529579_9${nonce}`,
            name: '条件块',
            type: 'condition',
            fields: [],
            options: { span: 24 },
            model_key: 'condition_1631084529579_9',
            conditions: [
              {
                opt: '==',
                val: 'Bpm::Attr::FlowableCallback',
                name: '对象回调',
                fields: [
                  {
                    key: `input_1631084718409_19${nonce}`,
                    name: '名称',
                    type: 'input',
                    model: { attr_type: 'string' },
                    rules: [],
                    fields: [],
                    options: { span: 12 },
                    model_key: 'name',
                    conditions: [],
                    model_key_prefix,
                  },
                  {
                    key: `input_1631084715856_17${nonce}`,
                    name: '方法',
                    type: 'input',
                    model: { attr_type: 'string' },
                    rules: [],
                    fields: [],
                    options: { span: 12 },
                    model_key: 'callback_method',
                    conditions: [],
                    model_key_prefix,
                  },
                  {
                    key: `json_1631084707060_16${nonce}`,
                    name: '参数',
                    type: 'json',
                    model: { attr_type: 'object' },
                    rules: [],
                    fields: [],
                    options: { span: 24 },
                    model_key: 'callback_params',
                    conditions: [],
                    model_key_prefix,
                  },
                ],
                model_key: `${model_key_prefix}.type`,
                type: 'simple',
                complex_condition: { groups: [] },
              },
              {
                opt: '==',
                val: 'Bpm::Attr::FunctionCallback',
                name: '类回调',
                fields: [
                  {
                    key: `layout_1631084601414_14${nonce}`,
                    name: '普通布局',
                    type: 'layout',
                    fields: [
                      {
                        key: `input_1631084586661_13${nonce}`,
                        name: '名称',
                        type: 'input',
                        model: { attr_type: 'string' },
                        rules: [],
                        fields: [],
                        options: { span: 8 },
                        model_key: 'name',
                        conditions: [],
                        model_key_prefix,
                      },
                      {
                        key: `input_1631084578791_12${nonce}`,
                        name: '类名',
                        type: 'input',
                        model: { attr_type: 'string' },
                        rules: [],
                        fields: [],
                        options: { span: 8 },
                        model_key: 'callback_class_name',
                        conditions: [],
                        model_key_prefix,
                      },
                      {
                        key: `input_1631084571776_10${nonce}`,
                        name: '方法',
                        type: 'input',
                        model: { attr_type: 'string' },
                        rules: [],
                        fields: [],
                        options: { span: 8 },
                        model_key: 'callback_method',
                        conditions: [],
                        model_key_prefix,
                      },
                      {
                        key: `json_1631084690495_15${nonce}`,
                        name: '参数',
                        type: 'json',
                        model: { attr_type: 'object' },
                        rules: [],
                        fields: [],
                        options: { span: 24 },
                        model_key: 'callback_params',
                        conditions: [],
                        model_key_prefix,
                      },
                    ],
                    options: { span: 24, label: {} },
                    model_key: 'layout_1631084601414_14',
                    conditions: [],
                    model_key_prefix,
                  },
                ],
                model_key: `${model_key_prefix}.type`,
                type: 'simple',
                complex_condition: { groups: [] },
              },
              {
                name: '短信回调',
                type: 'simple',
                model_key: `${model_key_prefix}.type`,
                val: 'Bpm::Attr::SmsNotifyCallback',
                fields: [
                  {
                    name: '收件人',
                    type: 'radio',
                    rules: [
                      {
                        rule_type: 'required',
                        type: 'string',
                        required: true,
                        message: '请填写正确的收件人',
                      },
                    ],
                    model: { attr_type: 'string' },
                    options: {
                      select: [
                        { label: '通知发起人', value: 'creator' },
                        { label: '通知处理人', value: 'operator' },
                      ],
                      multiple: false,
                      span: 24,
                      table_items: [],
                      display_configurable_form: {},
                      defaultValue: 'creator',
                    },
                    key: `radio_1648362597784_2${nonce}`,
                    model_key: 'receiver',
                    fields: [],
                    conditions: [],
                    model_key_prefix,
                  },
                  {
                    name: '参数',
                    type: 'json',
                    rules: [],
                    model: { attr_type: 'object' },
                    options: { span: 24 },
                    key: `json_1648362553170_1${nonce}`,
                    model_key: 'callback_params',
                    fields: [],
                    conditions: [],
                    model_key_prefix,
                  },
                ],
                complex_condition: { groups: [] },
                opt: '==',
              },
              {
                opt: '==',
                val: 'Bpm::Attr::UpdateFlowableCallback',
                name: '关联对象更新',
                fields: [
                  {
                    name: '发起来源',
                    type: 'radio',
                    rules: [
                      {
                        rule_type: 'required',
                        type: 'string',
                        required: true,
                        message: '请填写正确的发起来源',
                      },
                    ],
                    model: {
                      attr_type: 'string',
                    },
                    options: {
                      select: [
                        {
                          label: '流程',
                          value: 'instance',
                        },
                        {
                          label: '节点',
                          value: 'token',
                        },
                      ],
                      multiple: false,
                      span: 24,
                      table_items: [],
                      display_configurable_form: {},
                    },
                    key: 'radio_1670732175665_20',
                    model_key: 'update_by',
                    fields: [],
                    conditions: [],
                    model_key_prefix,
                  },
                  {
                    name: '合并 cache_payload',
                    type: 'switch',
                    rules: [],
                    model: {
                      attr_type: 'boolean',
                    },
                    options: {
                      span: 24,
                    },
                    key: 'switch_1670732231200_21',
                    model_key: 'merge_cache_payload',
                    fields: [],
                    conditions: [],
                    model_key_prefix,
                  },
                  {
                    name: '回调参数',
                    type: 'json',
                    rules: [],
                    model: {
                      attr_type: 'object',
                    },
                    options: {
                      span: 24,
                    },
                    key: 'json_1670732252583_22',
                    model_key: 'callback_params',
                    fields: [],
                    conditions: [],
                    model_key_prefix,
                  },
                ],
                model_key: `${model_key_prefix}.type`,
                type: 'simple',
                complex_condition: { groups: [] },
              },
            ],
            model_key_prefix,
          },
        ],
        options: { span: 24 },
        model_key: 'callback',
        conditions: [],
        model_key_prefix: '',
      },
    ],
    options: { span: 24, label: {} },
    model_key: 'layout_1631084420310_5',
    conditions: [],
    model_key_prefix: '',
  };
};

export const getTriggerParticalTemplate = (
  tokenActions?: TokenAction[],
  needTriggerSource = false,
): TaTemplateFormItem => {
  const tokenActionsOptions: TaTemplateFormSelect[] = tokenActions
    ? tokenActions.map(action => ({
        value: action.key,
        label: `${action.display || zhMap[action.key]}【${action.key}】`,
      }))
    : defaultTokenActionsOptions;

  return {
    key: 'layout_1631084382893_3',
    type: 'layout',
    model: { create_default_value: { callback: { receiver: 'creator' } } },
    fields: [
      {
        key: 'key_layout_1631950343086_0',
        name: '嵌套对象',
        type: 'key_layout',
        fields: [
          {
            key: 'list_1631084402969_4',
            name: '前置回调',
            type: 'list',
            fields: [
              {
                name: '动作名',
                type: 'select',
                rules: [],
                model: { attr_type: 'string' },
                options: { select: tokenActionsOptions, multiple: false, span: 24 },
                key: 'select_1631954786785_1',
                model_key: 'action',
                fields: [],
                conditions: [],
                model_key_prefix: '',
              },
              ...(needTriggerSource
                ? [
                    {
                      name: '触发对象',
                      type: 'radio',
                      rules: [],
                      model: { attr_type: 'string' },
                      options: {
                        select: [
                          { label: '单节点', value: 'token' },
                          { label: '多节点', value: 'place' },
                        ],
                        multiple: false,
                        span: 24,
                        defaultValue: 'token',
                      },
                      key: 'radio_1648362930880_3',
                      model_key: 'trigger_source',
                      fields: [],
                      conditions: [],
                      model_key_prefix: '',
                    } as TaTemplateFormItem,
                  ]
                : ([] as TaTemplateFormItem[])),
              getCallbackTemplate(),
            ],
            options: { span: 24 },
            model_key: 'before_triggers',
            conditions: [],
            model_key_prefix: 'trigger_options',
          },
          {
            key: 'list_1631084835287_33',
            name: '后置回调',
            type: 'list',
            fields: [
              {
                name: '动作名',
                type: 'select',
                rules: [],
                model: { attr_type: 'string' },
                options: { select: tokenActionsOptions, multiple: false, span: 24 },
                key: 'select_1631954809634_2',
                model_key: 'action',
                fields: [],
                conditions: [],
                model_key_prefix: '',
              },
              ...(needTriggerSource
                ? [
                    {
                      name: '触发对象',
                      type: 'radio',
                      rules: [],
                      model: { attr_type: 'string' },
                      options: {
                        select: [
                          { label: '单节点', value: 'token' },
                          { label: '多节点', value: 'place' },
                        ],
                        multiple: false,
                        span: 24,
                        defaultValue: 'token',
                      },
                      key: 'radio_1648362930880_3',
                      model_key: 'trigger_source',
                      fields: [],
                      conditions: [],
                      model_key_prefix: '',
                    } as TaTemplateFormItem,
                  ]
                : ([] as TaTemplateFormItem[])),
              getCallbackTemplate(),
            ],
            options: { span: 24 },
            model_key: 'after_triggers',
            conditions: [],
            model_key_prefix: 'trigger_options',
          },
        ],
        options: { span: 24 },
        model_key: 'trigger_options',
        conditions: [],
        model_key_prefix: '',
      },
    ],
    options: { label: {}, theme: 'none', create_text: '提交', update_text: '提交' },
    model_key: 'layout_1631084382893_3',
    conditions: [],
    index_attributes: [],
    actions: [
      { key: 'create', enabled: true },
      { key: 'update', enabled: true },
      { key: 'delete', enabled: true },
      { key: 'import', enabled: true },
      { key: 'export', enabled: true },
    ],
  };
};

export const getTransitionTypeTemplate: (label: string) => TaTemplateFormItem = (
  label: string,
) => ({
  key: 'layout_1625041792977_0',
  type: 'layout',
  model: {},
  fields: [
    {
      key: 'radio_1632468028849_3',
      name: `${label}方式`,
      type: 'radio',
      model: {
        attr_type: 'string',
      },
      rules: [
        {
          type: 'string',
          message: `请填写正确${label}方式`,
          required: true,
          rule_type: 'required',
        },
      ],
      fields: [],
      options: {
        span: 24,
        select: [
          {
            label: '会签',
            value: 'Transitions::AndApproval',
          },
          {
            label: '或签',
            value: 'Transitions::OrApproval',
          },
          {
            label: '指派（多人采用会签）',
            value: 'Transitions::Assign',
          },
          {
            label: '（多人采用或签）',
            value: 'Transitions::OrAssign',
          },
        ],
        multiple: false,
      },
      model_key: 'transition_type',
      conditions: [],
      model_key_prefix: '',
    },
    {
      name: '条件块',
      type: 'condition',
      conditions: [
        {
          name: 'assign',
          model_key: 'transition_type',
          val: 'Transitions::Assign',
          fields: [
            {
              name: '嵌套对象',
              type: 'key_layout',
              options: {
                span: 24,
              },
              key: 'key_layout_1634967549795_4',
              model_key: 'transition_options',
              fields: [
                {
                  name: '是否多选',
                  type: 'switch',
                  rules: [
                    {
                      type: 'string',
                      required: true,
                      rule_type: 'required',
                    },
                  ],
                  model: {
                    attr_type: 'boolean',
                  },
                  options: {
                    span: 24,
                    defaultValue: true,
                  },
                  key: 'switch_1634971199108_1',
                  model_key: 'multiple',
                  fields: [],
                  conditions: [],
                  model_key_prefix: 'transition_options',
                },
                ...getUserOptionsItemAry(
                  '指派执行人（谁来选人）',
                  'transition_options.assign_user_options',
                  false,
                ),
              ],
              conditions: [],
              model_key_prefix: '',
            },
          ],
          type: 'complex',
          // opt: '==',
          complex_condition: {
            groups: [
              {
                _id: 1634988921123,
                items: [
                  {
                    _id: 1634988921151,
                    rule: {
                      type: 'Com::Attr::ConditionRules::String',
                      key: 'transition_type',
                      key_name: '条件块',
                      opt: '==',
                      val: 'Transitions::Assign',
                    },
                    desc: {
                      name: '条件块',
                      optZh: '等于',
                      modelValue: {
                        rule: {
                          val: 'Transitions::Assign',
                        },
                      },
                      template: {
                        key: 'key',
                        type: 'layout',
                        fields: [
                          {
                            key: 'input_1632802358717_21',
                            name: '值',
                            type: 'input',
                            model: {
                              attr_type: 'string',
                            },
                            rules: [],
                            fields: [],
                            options: {
                              span: 24,
                            },
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
              {
                _id: 1634988938389,
                items: [
                  {
                    _id: 1634988938417,
                    rule: {
                      type: 'Com::Attr::ConditionRules::String',
                      key: 'transition_type',
                      key_name: '条件块',
                      opt: '==',
                      val: 'Transitions::OrAssign',
                    },
                    desc: {
                      name: '条件块',
                      optZh: '等于',
                      modelValue: {
                        rule: {
                          val: 'Transitions::OrAssign',
                        },
                      },
                      template: {
                        key: 'key',
                        type: 'layout',
                        fields: [
                          {
                            key: 'input_1632802358717_21',
                            name: '值',
                            type: 'input',
                            model: {
                              attr_type: 'string',
                            },
                            rules: [],
                            fields: [],
                            options: {
                              span: 24,
                            },
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
      options: {
        span: 24,
      },
      key: 'condition_1634967503797_3',
      model_key: 'condition_1634967503797_3',
      fields: [],
      model_key_prefix: '',
    },
    {
      key: 'label_1634119196057_0',
      name: '',
      type: 'label',
      model: { attr_type: 'string' },
      rules: [],
      fields: [],
      options: {
        span: 24,
        label: {
          height: 2,
          font_size: 0,
          padding_top: 0,
          padding_left: 0,
          padding_right: 0,
          padding_bottom: 0,
          background_color: '',
        },
      },
      model_key: 'label_1634119196057_0',
      conditions: [],
      model_key_prefix: 'options',
    },
  ],

  options: {
    label: {},
    theme: 'none',
  },
  index_attributes: [],
  column_attributes: [],
});

export const getUserOptionsItemAry = (
  label: string,
  model_key_prefix: string,
  extra?: boolean,
  required = true,
): TaTemplateFormItem[] => [
  {
    key: 'radio_1634117407476_38',
    name: `${label} 类型`,
    type: 'radio',
    model: { attr_type: 'string' },
    rules: [
      required
        ? {
            type: 'string',
            message: `请填写正确的${label}类型`,
            required: true,
            rule_type: 'required',
          }
        : {},
    ],
    fields: [],
    options: {
      span: 24,
      select: [
        { label: '指定人', value: 'Bpm::Attr::UserList' },
        { label: '直接主管', value: 'Bpm::Attr::DirectManager' },
        { label: '发起人', value: 'Bpm::Attr::SponsorSelf' },
        { label: '上个节点处理人', value: 'Bpm::Attr::TokenUserSelf' },
        { label: '工作流角色', value: 'Bpm::Attr::FlowableRole' },
        { label: '节点处理人', value: 'Bpm::Attr::PlaceDoneUsers' },
        ...(extra
          ? [
              { label: '指定岗位', value: 'Bpm::Attr::Duty' },
              { label: '角色', value: 'Bpm::Attr::Role' },
              { label: '身份', value: 'Bpm::Attr::MemberIdentity' },
              { label: '部门岗位', value: 'Bpm::Attr::LevelDutyRank' },
              { label: '岗位职级', value: 'Bpm::Attr::LevelDutyPosition' },
            ]
          : []),
      ],
      multiple: false,
    },
    model_key: 'type',
    conditions: [],
    model_key_prefix,
  },
  {
    key: 'condition_1634117407476_39',
    name: '条件块',
    type: 'condition',
    fields: [],
    options: { span: 24 },
    model_key: 'condition_1634117407476_39',
    conditions: [
      {
        opt: '==',
        val: 'Bpm::Attr::UserList',
        name: '指定人',
        type: 'simple',
        fields: [
          {
            key: 'api_1634117407477_401',
            name: '指定用户',
            type: 'api',
            model: { attr_type: 'array' },
            rules: [
              {
                type: 'array',
                message: '请填写正确的指定用户',
                required: true,
                rule_type: 'required',
              },
            ],
            fields: [],
            options: {
              path: '/res/member/users',
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '用户名',
                  type: 'string',
                  search: true,
                  data_index: 'name',
                },
                {
                  name: '用户账号',
                  type: 'string',
                  search: true,
                  data_index: 'account',
                },
              ],
            },
            model_key: 'user_ids',
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::SponsorSelf',
        name: '发起人',
        type: 'simple',
        fields: [],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::PlaceDoneUsers',
        name: '节点处理人',
        type: 'simple',
        fields: [
          {
            name: '节点（需先保存工作流）',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '节点名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
                {
                  name: '节点类型',
                  data_index: 'type',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/bpm/user/workflows/${workflowId}/places',
              ransack: '{ "type_eq": "Places::Approval" }',
            },
            key: 'api_1634973132562_16123',
            model_key: 'place_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::TokenUserSelf',
        name: '上个节点处理人',
        type: 'simple',
        fields: [],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::FlowableRole',
        name: '角色',
        type: 'simple',
        fields: [
          {
            key: 'input_1634117407477_412',
            name: '角色',
            type: 'input',
            model: { attr_type: 'string' },
            rules: [
              {
                type: 'string',
                message: '请填写正确的角色',
                required: true,
                rule_type: 'required',
              },
            ],
            fields: [],
            options: { span: 24 },
            model_key: 'role',
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::Duty',
        name: '指定岗位',
        type: 'simple',
        fields: [
          {
            name: '操作成员类型',
            type: 'radio',
            rules: [
              {
                rule_type: 'required',
                type: 'string',
                required: true,
                message: '请填写正确的操作成员类型',
              },
            ],
            model: {
              attr_type: 'string',
            },
            options: {
              select: [
                {
                  label: '流程发起人',
                  value: 'instance_creator',
                },
                {
                  label: '上节点操作人',
                  value: 'perform_operator',
                },
              ],
              multiple: false,
              span: 24,
              defaultValue: 'instance_creator',
            },
            key: 'radio_1653578460514_113',
            model_key: 'operator_type',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '组织',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '组织名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/res/member/orgs',
            },
            key: 'api_1634973132562_14',
            model_key: 'org_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '部门',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '部门名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/res/member/departments',
            },
            key: 'api_1634973132562_15',
            model_key: 'department_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '岗位',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '岗位名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
                {
                  name: '分组',
                  data_index: 'duty_group_name',
                  search: true,
                  type: 'string',
                },
                {
                  name: '部门',
                  data_index: 'department.name',
                  search: false,
                  type: 'string',
                },
              ],
              path: '/res/member/duties',
            },
            key: 'api_1634973132562_16',
            model_key: 'duty_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '是否依次查找父组织',
            type: 'switch',
            rules: [],
            model: {
              attr_type: 'boolean',
            },
            options: {
              span: 24,
              defaultValue: true,
            },
            key: 'switch_1637567414101_17',
            model_key: 'use_org_parents',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::Role',
        name: '角色',
        type: 'simple',
        fields: [
          {
            name: '组织',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '组织名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/res/member/orgs',
            },
            key: 'api_1634973132562_18',
            model_key: 'org_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '部门',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '部门名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/res/member/departments',
            },
            key: 'api_1634973132562_19',
            model_key: 'department_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '角色',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '角色名称',
                  data_index: 'label',
                  search: true,
                  type: 'string',
                },
                {
                  name: '所属模块',
                  data_index: 'mod.name',
                  search: true,
                  type: 'string',
                },
              ],
              attrs: ['label'],
              path: '/res/member/roles',
            },
            key: 'api_1634973132562_110',
            model_key: 'role_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::MemberIdentity',
        name: '身份',
        type: 'simple',
        fields: [
          {
            name: '组织',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '组织名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/res/member/orgs',
            },
            key: 'api_1634973132562_111',
            model_key: 'org_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '部门',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '部门名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              path: '/res/member/departments',
            },
            key: 'api_1634973132562_112',
            model_key: 'department_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '身份',
            type: 'api',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              span: 24,
              multiple: true,
              table_items: [
                {
                  name: '身份名称',
                  data_index: 'name',
                  search: true,
                  type: 'string',
                },
              ],
              attrs: ['name'],
              path: '/res/user/member_identities',
            },
            key: 'api_1634973132562_1123',
            model_key: 'member_identity_ids',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::LevelDutyRank',
        name: '部门岗位',
        type: 'simple',
        fields: [
          {
            name: '第',
            type: 'number',
            rules: [],
            model: {
              attr_type: 'number',
            },
            options: {
              span: 4,
            },
            key: 'number_1634974240131_114',
            model_key: 'level',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '级部门',
            type: 'checkbox',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              select: levelDutyRankSelect,
              multiple: true,
              span: 20,
            },
            key: 'checkbox_1634974301799_315',
            model_key: 'ranks',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
      {
        opt: '==',
        val: 'Bpm::Attr::LevelDutyPosition',
        name: '岗位职级',
        type: 'simple',
        fields: [
          {
            name: '0: 仅本部门, 1: 仅上级部门, 2: 本部门找不到则搜索上级部门',
            type: 'number',
            rules: [
              {
                type: 'number',
                required: true,
                rule_type: 'required',
              },
            ],
            model: {
              attr_type: 'number',
            },
            options: {
              span: 24,
            },
            key: 'number_1634974240131_114',
            model_key: 'level',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
          {
            name: '第几级岗位',
            type: 'select',
            rules: [],
            model: {
              attr_type: 'array',
            },
            options: {
              select: levelDutyRankPositionSelect,
              multiple: true,
              span: 24,
            },
            key: 'checkbox_1634974301799_315',
            model_key: 'ranks',
            fields: [],
            conditions: [],
            model_key_prefix,
          },
        ],
        model_key: `${model_key_prefix}.type`,
        complex_condition: { groups: [] },
      },
    ],
    model_key_prefix,
  },
];

export const getUserOptionsTemplate: (label: string) => TaTemplateFormItem = (label: string) => ({
  key: 'layout_1634116950748_9',
  type: 'layout',
  model: {},
  fields: [
    {
      name: '隐藏名字',
      type: 'switch',
      rules: [],
      model: {
        attr_type: 'boolean',
      },
      options: {
        span: 12,
      },
      key: 'switch_1672368073924_1',
      model_key: 'layout_options.hidden_name',
      fields: [],
      conditions: [],
      model_key_prefix: '',
    },
    {
      name: '条件块',
      type: 'condition',
      conditions: [
        {
          name: '隐藏名字',
          model_key: 'layout_options.hidden_name',
          val: 'custom',
          fields: [
            {
              name: '匿名代称类型',
              type: 'radio',
              rules: [],
              model: { attr_type: 'string' },
              options: {
                select: [
                  { label: '默认（工作人员）', value: 'default' },
                  { label: '自定义', value: 'custom' },
                  { label: '对应组织', value: 'org' },
                  { label: '对应部门', value: 'department' },
                ],
                multiple: false,
                span: 24,
                table_items: [],
                display_configurable_form: {},
                import_export_headers: [],
              },
              key: 'radio_1707288752275_5',
              model_key: 'layout_options.hidden_name_type',
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
                  name: '自定义',
                  model_key: 'layout_options.hidden_name_type',
                  val: 'custom',
                  fields: [
                    {
                      name: '自定义匿名代称',
                      type: 'input',
                      rules: [
                        {
                          rule_type: 'required',
                          type: 'string',
                          required: true,
                          message: '请填写正确的自定义匿名代称',
                        },
                      ],
                      model: { attr_type: 'string' },
                      options: { span: 24 },
                      key: 'input_1707288976600_6',
                      model_key: 'layout_options.hidden_name_custom',
                      model_key_configuration: [],
                      fields: [],
                      conditions: [],
                      model_key_prefix: '',
                    },
                    {
                      name: '自定义指派人匿名代称',
                      type: 'input',
                      rules: [],
                      model: { attr_type: 'string' },
                      options: { span: 24 },
                      key: 'input_1707288976600_63',
                      model_key: 'layout_options.hidden_name_custom_assign',
                      model_key_configuration: [],
                      fields: [],
                      conditions: [],
                      model_key_prefix: '',
                    },
                  ],
                  type: 'simple',
                  complex_condition: { groups: [{ items: [] }] },
                  opt: '==',
                },
              ],
              options: { span: 24 },
              key: 'condition_1707288745891_4',
              model_key: 'condition_1707288745891_4',
              model_key_configuration: [],
              fields: [],
              model_key_prefix: '',
            },
          ],
          type: 'complex',
          complex_condition: {
            groups: [
              {
                items: [
                  {
                    _id: '1707289325800_1',
                    rule: {
                      type: 'Com::Attr::ConditionRules::Boolean',
                      key: 'layout_options.hidden_name',
                      key_name: '',
                      opt: '==',
                      val: true,
                    },
                    desc: {
                      name: '',
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
      key: 'condition_1707288638790_3',
      model_key: 'condition_1707288638790_3',
      model_key_configuration: [],
      fields: [],
      model_key_prefix: '',
    },
    {
      name: '导出节点处理情况',
      type: 'switch',
      rules: [],
      model: {
        attr_type: 'boolean',
      },
      options: {
        span: 12,
      },
      key: 'switch_1672368073924_1',
      model_key: 'layout_options.exportable',
      fields: [],
      conditions: [],
      model_key_prefix: '',
    },
    {
      key: 'key_layout_1634117001979_12',
      name: 'options',
      type: 'key_layout',
      fields: [
        {
          key: 'key_layout_1634117081493_16',
          name: '嵌套对象',
          type: 'key_layout',
          fields: getUserOptionsItemAry(label, 'options.user_options', true),
          options: { span: 24 },
          model_key: 'user_options',
          conditions: [],
          model_key_prefix: 'options',
        },
      ],
      options: { span: 24 },
      model_key: 'options',
      conditions: [],
      model_key_prefix: '',
    },
  ],
  actions: [
    { key: 'create', enabled: true },
    { key: 'update', enabled: true },
    { key: 'delete', enabled: true },
    { key: 'import', enabled: true },
    { key: 'export', enabled: true },
  ],
  options: { label: {}, theme: 'none' },
  model_key: 'layout_1634116950748_9',
  conditions: [],
  index_attributes: [],
  column_attributes: [],
});

export const approvalTemplate: TaTemplateFormItem = getUserOptionsTemplate('审批');
export const notifyTemplate: TaTemplateFormItem = getUserOptionsTemplate('抄送');

export const getTriggerOptionsTemplate = (tokenActions?: TokenAction[]) => {
  return {
    options: { label: {}, theme: 'none' },
    index_attributes: [],
    type: 'layout',
    model: {},
    key: 'layout_1631085140304_34',
    model_key: 'layout_1631085140304_34',
    fields: [getTriggerParticalTemplate(tokenActions, true)],
    conditions: [],
  };
};

export const tokenActionsTemplate = {
  key: 'layout_1630747035454_4',
  type: 'layout',
  model: {},
  fields: [
    {
      key: 'key_layout_1631082642187_1',
      name: 'token_actions',
      type: 'key_layout',
      fields: [
        {
          key: 'list_1631080180249_0',
          name: 'token_actions',
          type: 'list',
          fields: [
            {
              key: 'layout_1631080364877_12',
              name: '普通布局',
              type: 'layout',
              fields: [
                {
                  key: 'input_1631080190364_1',
                  name: '关键字',
                  type: 'input',
                  model: { attr_type: 'string' },
                  rules: [],
                  fields: [],
                  options: { span: 6 },
                  model_key: 'key',
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  key: 'switch_1631082738952_2',
                  name: '激活',
                  type: 'switch',
                  model: { attr_type: 'boolean' },
                  rules: [],
                  fields: [],
                  options: { span: 6 },
                  model_key: 'enable',
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  key: 'input_1631080266729_12',
                  name: '操作次级关键字',
                  type: 'input',
                  model: { attr_type: 'string' },
                  rules: [],
                  fields: [],
                  options: { span: 6 },
                  model_key: 'action_flag',
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  key: 'input_1631080255778_10',
                  name: '名称',
                  type: 'input',
                  model: { attr_type: 'string' },
                  rules: [],
                  fields: [],
                  options: { span: 6 },
                  model_key: 'name',
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  key: 'input_1631080266729_11',
                  name: '按钮名称',
                  type: 'input',
                  model: { attr_type: 'string' },
                  rules: [],
                  fields: [],
                  options: { span: 12 },
                  model_key: 'display_name',
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  key: 'input_1631080266729_13',
                  name: '完成文案',
                  type: 'input',
                  model: { attr_type: 'string' },
                  rules: [],
                  fields: [],
                  options: { span: 12 },
                  model_key: 'action_name',
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  key: 'input_1631080232195_9',
                  name: '简述',
                  type: 'input',
                  model: { attr_type: 'string' },
                  rules: [],
                  fields: [],
                  options: { span: 24 },
                  model_key: 'desc',
                  conditions: [],
                  model_key_prefix: '',
                },
              ],
              options: { span: 24, label: {} },
              model_key: 'layout_1631080364877_12',
              conditions: [],
              model_key_prefix: '',
            },
          ],
          options: {
            span: 24,
            // disabled_actions: { create: true, destroy: true },
            edit_directly: true,
          },
          model_key: 'actions',
          conditions: [],
          model_key_prefix: 'token_actions',
        },
        {
          name: 'permits',
          type: 'label',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
            label: {},
          },
          key: 'label_1659187285987_12',
          model_key: 'label_1659187285987_21',
          fields: [],
          conditions: [],
          model_key_prefix: '',
        },
        {
          key: 'list_1631080180249_0',
          name: 'permits',
          type: 'list',
          fields: [...getUserOptionsItemAry('可见性', 'user_options', true, false)],
          options: {
            span: 24,
            // disabled_actions: { create: true, destroy: true },
            edit_directly: true,
          },
          model_key: 'permits',
          conditions: [],
          model_key_prefix: 'token_actions',
        },
      ],
      options: { span: 24 },
      model_key: 'token_actions',
      conditions: [],
      model_key_prefix: '',
    },
  ],
  options: { label: {}, theme: 'none' },
  model_key: 'layout_1630747035454_4',
  conditions: [],
  index_attributes: [],
};

export const activateOptionsTemplate = {
  type: 'layout',
  model: {},
  key: 'layout_1659170465523_0',
  model_key: 'layout_1659170465523_0',
  fields: [
    {
      name: 'activate_options',
      type: 'key_layout',
      options: {
        span: 24,
        defaultValue: { before_activation: { callback: { type: 'Bpm::Attr::Activate::Deliver' } } },
      },
      key: 'key_layout_1659186000311_1',
      model_key: 'activate_options',
      fields: [
        {
          name: '启用前置激活',
          type: 'switch',
          rules: [],
          model: {
            attr_type: 'boolean',
          },
          options: {
            span: 24,
          },
          key: 'switch_1659268472683_6',
          model_key: 'before_activation_enable',
          fields: [],
          conditions: [],
          model_key_prefix: 'activate_options',
        },
        {
          name: '条件块',
          type: 'condition',
          conditions: [
            {
              name: '条件1',
              model_key: 'activate_options.before_activation_enable',
              val: '',
              fields: [
                {
                  name: '前置激活',
                  type: 'label',
                  rules: [],
                  model: {
                    attr_type: 'string',
                  },
                  options: {
                    span: 24,
                    label: {},
                  },
                  key: 'label_1659187285987_1',
                  model_key: 'label_1659187285987_1',
                  fields: [],
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  name: 'before_activation',
                  type: 'key_layout',
                  options: {
                    span: 24,
                    defaultValue: { callback: { type: 'Bpm::Attr::Activate::Deliver' } },
                  },
                  key: 'key_layout_1659186275956_2',
                  model_key: 'before_activation',
                  fields: [
                    {
                      name: '操作',
                      type: 'checkbox',
                      rules: [],
                      model: { attr_type: 'array' },
                      options: { span: 24, select: defaultTokenActionsOptions, multiple: true },
                      key: 'string_array_1659186305339_3',
                      model_key: 'actions',
                      fields: [],
                      conditions: [],
                      model_key_prefix: 'activate_options.before_activation',
                    },
                    {
                      name: '回调',
                      type: 'key_layout',
                      options: { span: 24, defaultValue: { type: 'Bpm::Attr::Activate::Deliver' } },
                      key: 'key_layout_1659186344541_4',
                      model_key: 'callback',
                      fields: [
                        {
                          name: '回调类型',
                          type: 'radio',
                          rules: [],
                          model: { attr_type: 'string' },
                          options: {
                            select: [{ label: '派送', value: 'Bpm::Attr::Activate::Deliver' }],
                            multiple: false,
                            span: 24,
                            table_items: [],
                            display_configurable_form: {},
                            import_export_headers: [],
                            defaultValue: 'Bpm::Attr::Activate::Deliver',
                          },
                          key: 'radio_1659186388991_5',
                          model_key: 'type',
                          fields: [],
                          conditions: [],
                          model_key_prefix: 'activate_options.before_activation.callback',
                        },
                        {
                          name: '条件块',
                          type: 'condition',
                          conditions: [
                            {
                              name: 'Bpm::Attr::Activate::Deliver',
                              model_key: 'activate_options.before_activation.callback.type',
                              val: 'Bpm::Attr::Activate::Deliver',
                              fields: [
                                {
                                  name: 'user_options',
                                  type: 'key_layout',
                                  options: { span: 24 },
                                  key: 'key_layout_1659186445375_6',
                                  model_key: 'user_options',
                                  fields: getUserOptionsItemAry(
                                    '激活',
                                    'activate_options.before_activation.callback.user_options',
                                    true,
                                    false,
                                  ),
                                  conditions: [],
                                  model_key_prefix: 'activate_options.before_activation.callback',
                                },
                              ],
                              opt: '==',
                              type: 'simple',
                              complex_condition: { groups: [{ items: [] }] },
                            },
                          ],
                          options: { span: 24 },
                          key: 'condition_1659187037827_7',
                          model_key: 'condition_1659187037827_7',
                          fields: [],
                          model_key_prefix: 'activate_options.before_activation.callback',
                        },
                      ],
                      conditions: [],
                      model_key_prefix: 'activate_options.before_activation',
                    },
                  ],
                  conditions: [],
                  model_key_prefix: 'activate_options',
                },
              ],
              type: 'complex',
              complex_condition: {
                groups: [
                  {
                    items: [
                      {
                        _id: '1659268490848_2',
                        rule: {
                          type: 'Com::Attr::ConditionRules::Boolean',
                          key: 'activate_options.before_activation_enable',
                          key_name: '启用前置激活',
                          opt: '==',
                          val: true,
                        },
                        desc: {
                          name: '启用前置激活',
                          optZh: '等于',
                          modelValue: {
                            rule: {
                              val: true,
                            },
                          },
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
              opt: '==',
            },
          ],
          options: {
            span: 24,
          },
          key: 'condition_1659268417997_4',
          model_key: 'condition_1659268417997_4',
          fields: [],
          model_key_prefix: '',
        },

        {
          name: '启用后置激活',
          type: 'switch',
          rules: [],
          model: {
            attr_type: 'boolean',
          },
          options: {
            span: 24,
          },
          key: 'switch_1659268472683_6',
          model_key: 'after_activation_enable',
          fields: [],
          conditions: [],
          model_key_prefix: 'activate_options',
        },
        {
          name: '条件块',
          type: 'condition',
          conditions: [
            {
              name: '条件1',
              model_key: 'activate_options.after_activation_enable',
              val: '',
              fields: [
                {
                  name: '后置激活',
                  type: 'label',
                  rules: [],
                  model: {
                    attr_type: 'string',
                  },
                  options: {
                    span: 24,
                    label: {},
                  },
                  key: 'label_1659187285987_1',
                  model_key: 'label_1659187285987_1',
                  fields: [],
                  conditions: [],
                  model_key_prefix: '',
                },
                {
                  name: 'after_activation',
                  type: 'key_layout',
                  options: {
                    span: 24,
                    defaultValue: { callback: { type: 'Bpm::Attr::Activate::Deliver' } },
                  },
                  key: 'key_layout_1659186275956_2',
                  model_key: 'after_activation',
                  fields: [
                    {
                      name: '操作',
                      type: 'checkbox',
                      rules: [],
                      model: { attr_type: 'array' },
                      options: { span: 24, select: defaultTokenActionsOptions, multiple: true },
                      key: 'string_array_1659186305339_3',
                      model_key: 'actions',
                      fields: [],
                      conditions: [],
                      model_key_prefix: 'activate_options.after_activation',
                    },
                    {
                      name: '回调',
                      type: 'key_layout',
                      options: { span: 24, defaultValue: { type: 'Bpm::Attr::Activate::Deliver' } },
                      key: 'key_layout_1659186344541_4',
                      model_key: 'callback',
                      fields: [
                        {
                          name: '回调类型',
                          type: 'radio',
                          rules: [],
                          model: { attr_type: 'string' },
                          options: {
                            select: [{ label: '派送', value: 'Bpm::Attr::Activate::Deliver' }],
                            multiple: false,
                            span: 24,
                            table_items: [],
                            display_configurable_form: {},
                            import_export_headers: [],
                            defaultValue: 'Bpm::Attr::Activate::Deliver',
                          },
                          key: 'radio_1659186388991_5',
                          model_key: 'type',
                          fields: [],
                          conditions: [],
                          model_key_prefix: 'activate_options.after_activation.callback',
                        },
                        {
                          name: '条件块',
                          type: 'condition',
                          conditions: [
                            {
                              name: 'Bpm::Attr::Activate::Deliver',
                              model_key: 'activate_options.after_activation.callback.type',
                              val: 'Bpm::Attr::Activate::Deliver',
                              fields: [
                                {
                                  name: 'user_options',
                                  type: 'key_layout',
                                  options: { span: 24 },
                                  key: 'key_layout_1659186445375_6',
                                  model_key: 'user_options',
                                  fields: getUserOptionsItemAry(
                                    '激活',
                                    'activate_options.after_activation.callback.user_options',
                                    true,
                                    false,
                                  ),
                                  conditions: [],
                                  model_key_prefix: 'activate_options.after_activation.callback',
                                },
                              ],
                              opt: '==',
                              type: 'simple',
                              complex_condition: { groups: [{ items: [] }] },
                            },
                          ],
                          options: { span: 24 },
                          key: 'condition_1659187037827_7',
                          model_key: 'condition_1659187037827_7',
                          fields: [],
                          model_key_prefix: 'activate_options.after_activation.callback',
                        },
                      ],
                      conditions: [],
                      model_key_prefix: 'activate_options.after_activation',
                    },
                  ],
                  conditions: [],
                  model_key_prefix: 'activate_options',
                },
              ],
              type: 'complex',
              complex_condition: {
                groups: [
                  {
                    items: [
                      {
                        _id: '1659268490848_2',
                        rule: {
                          type: 'Com::Attr::ConditionRules::Boolean',
                          key: 'activate_options.after_activation_enable',
                          key_name: '启用前置激活',
                          opt: '==',
                          val: true,
                        },
                        desc: {
                          name: '启用前置激活',
                          optZh: '等于',
                          modelValue: {
                            rule: {
                              val: true,
                            },
                          },
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
              opt: '==',
            },
          ],
          options: {
            span: 24,
          },
          key: 'condition_1659268417997_4',
          model_key: 'condition_1659268417997_4',
          fields: [],
          model_key_prefix: '',
        },
      ],
      conditions: [],
      model_key_prefix: '',
    },
  ],
  conditions: [],
  options: {
    label: {},
    disabled_actions: {},
    theme: 'none',
    create_text: '提交',
    update_text: '提交',
  },
  actions: [
    { key: 'create', enabled: true },
    { key: 'update', enabled: true },
    { key: 'delete', enabled: true },
    { key: 'import', enabled: true },
    { key: 'export', enabled: true },
  ],
  activate_options: {
    before_activation: { callback: { type: 'Bpm::Attr::Activate::Deliver' } },
    after_activation: { callback: { type: 'Bpm::Attr::Activate::Deliver' } },
  },
};

export const getEndPlaceTemplateFn = (placeSelect: TaTemplateFormSelect[]) => {
  return {
    type: 'layout',
    model: {},
    key: 'layout_1662017435738_0',
    model_key: 'layout_1662017435738_0',
    fields: [
      {
        name: '结束节点',
        type: 'select',
        rules: [],
        model: {
          attr_type: 'string',
        },
        options: {
          select: placeSelect,
          multiple: false,
          span: 24,
          table_items: [],
          display_configurable_form: {},
        },
        key: 'select_1662017442300_1',
        model_key: 'options.place_id',
        fields: [],
        conditions: [],
        model_key_prefix: '',
      },
    ],
    conditions: [],
    options: {
      label: {},
      disabled_actions: {},
      theme: 'none',
      create_text: '提交',
      update_text: '提交',
    },
    actions: [
      {
        key: 'create',
        enabled: true,
      },
      {
        key: 'update',
        enabled: true,
      },
      {
        key: 'delete',
        enabled: true,
      },
      {
        key: 'import',
        enabled: true,
      },
      {
        key: 'export',
        enabled: true,
      },
    ],
  };
};

export const BpmPlaceTokenSourceOptionsTemplate = {
  options: {
    label: {},
    disabled_actions: {},
    theme: {
      card: {},
      background: {},
    },
    create_text: '提交',
    update_text: '提交',
  },
  model: {},
  column_attributes: [],
  actions: [
    {
      key: 'create',
      enabled: true,
    },
    {
      key: 'update',
      enabled: true,
    },
    {
      key: 'delete',
      enabled: true,
    },
    {
      key: 'import',
      enabled: true,
    },
    {
      key: 'export',
      enabled: true,
    },
  ],
  type: 'layout',
  key: 'layout_1679809741955_0',
  model_key: 'layout_1679809741955_0',
  fields: [
    {
      name: 'token_source_options',
      type: 'key_layout',
      options: {
        span: 24,
      },
      key: 'key_layout_1679809785557_2',
      model_key: 'token_source_options',
      fields: [
        {
          name: '类名',
          type: 'input',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
          },
          key: 'input_1679809794126_3',
          model_key: 'klass',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options',
        },
        {
          name: 'model_setting_flag',
          type: 'input',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
          },
          key: 'input_1679809815044_4',
          model_key: 'model_setting_flag',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options',
        },
        {
          name: 'association',
          type: 'input',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
          },
          key: 'input_1679809817212_5',
          model_key: 'association',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options',
        },
        {
          name: 'default_values',
          type: 'json',
          rules: [],
          model: {
            attr_type: 'object',
          },
          options: {
            span: 24,
          },
          key: 'json_1679809870428_6',
          model_key: 'default_values',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options',
        },
        {
          name: 'PC 渲染组件名',
          type: 'input',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
          },
          key: 'input_1679809870428_61',
          model_key: 'component',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options.options',
        },
        // {
        //   name: 'mobile 渲染组件名',
        //   type: 'input',
        //   rules: [],
        //   model: {
        //     attr_type: 'string',
        //   },
        //   options: {
        //     span: 24,
        //   },
        //   key: 'input_1679809870428_62',
        //   model_key: 'mobile_component',
        //   fields: [],
        //   conditions: [],
        //   model_key_prefix: 'token_source_options.options',
        // },
        {
          name: 'complete 交互组件名',
          type: 'input',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
          },
          key: 'input_1679809870428_62',
          model_key: 'complete_component',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options.options',
        },
        {
          name: '自定义配置组件名',
          type: 'input',
          rules: [],
          model: {
            attr_type: 'string',
          },
          options: {
            span: 24,
          },
          key: 'input_1679809870428_612',
          model_key: 'configuration_component',
          fields: [],
          conditions: [],
          model_key_prefix: 'token_source_options.options',
        },
      ],
      conditions: [],
      model_key_prefix: '',
    },
  ],
  conditions: [],
};

export const submitOptions: TaTemplateFormItem = {
  options: {
    label: { width: '888px' },
    disabled_actions: {},
    theme: { card: { content: '<p><br></p>' }, background: {} },
    create_text: '提交',
    update_text: '提交',
    searcher: [],
  },
  model: {},
  column_attributes: [],
  actions: [
    { key: 'create', enabled: true },
    { key: 'update', enabled: true },
    { key: 'delete', enabled: true },
    { key: 'import', enabled: true },
    { key: 'export', enabled: true },
  ],
  type: 'layout',
  key: 'container_layout_1691662257673_0',
  model_key: 'container_layout_1691662257673_0',
  fields: [
    {
      key: 'TaTemplateFormDesignerKey-1',
      type: 'key_layout',
      fields: [
        {
          name: '开启发起限制',
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
          key: 'switch_1691662261956_1',
          model_key: 'enable',
          fields: [],
          conditions: [],
          model_key_prefix: 'submit_options',
        },
        {
          name: '条件块',
          type: 'condition',
          conditions: [
            {
              name: '条件1',
              model_key: '',
              val: '',
              fields: [getCallbackTemplate(['Bpm::Attr::FunctionCallback'], 'submit_options')],
              type: 'complex',
              complex_condition: {
                groups: [
                  {
                    items: [
                      {
                        _id: '1691662283063_0',
                        rule: {
                          type: 'Com::Attr::ConditionRules::Boolean',
                          key: 'submit_options.enable',
                          key_name: '开启发起限制',
                          opt: '==',
                          val: true,
                        },
                        desc: {
                          name: '开启发起限制',
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
          key: 'condition_1691662277329_2',
          model_key: 'condition_1691662277329_2',
          fields: [],
          model_key_prefix: '',
        },
      ],
      model_key: 'submit_options',
      options: {},
      model: {},
      model_key_prefix: '',
    },
  ],
  conditions: [],
};
