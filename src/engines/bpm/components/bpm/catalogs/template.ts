export const BpmCatalogTemplate = {
  type: 'layout',
  model: {},
  fields: [
    {
      key: 'input_59560045339',
      name: '名称',
      type: 'input',
      model: { summary: true, attr_type: 'string' },
      fields: [],
      options: { span: 24 },
      model_key: 'name',
      model_key_prefix: '',
    },
    {
      name: '排序',
      icon: 'FolderOutlined',
      type: 'number',
      rules: [],
      model: {
        attr_type: 'number',
      },
      options: {
        span: 24,
        precision: 0,
        min: 1,
      },
      key: 'number_1669983242451_5',
      model_key: 'position',
      fields: [],
      conditions: [],
      model_key_prefix: '',
    },
    {
      name: '是否发布',
      icon: 'FolderOutlined',
      type: 'radio',
      rules: [],
      model: {
        attr_type: 'string',
      },
      options: {
        select: [
          {
            label: '是',
            value: 'true',
          },
          {
            label: '否',
            value: 'false',
          },
        ],
        multiple: false,
        span: 24,
        table_items: [],
        display_configurable_form: {},
        import_export_headers: [
          {
            _id: '1669983063340_5',
          },
        ],
      },
      key: 'radio_1669983063270_4',
      model_key: 'published',
      fields: [],
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
  options: {
    label: {},
    theme: { card: {}, background: {}, form: {} },
    create_text: '提交',
    update_text: '提交',
  },
  model_key: 'layout_97205607237',
  index_attributes: [{ key: 'input_59560045339', name: '名称', data_index: 'name' }],
  column_attributes: [
    {
      _id: 'column_attributes_1636030960498_0',
      title: ['ID'],
      render: 'TableRendersAuto',
      dataIndex: 'id',
    },
    {
      title: '排序',
      _id: 'number_1669983242451_5',
      dataIndex: 'position',
      index: {
        on: true,
      },
    },
    { _id: 'input_59560045339', title: ['名称'], dataIndex: 'name' },
    {
      title: '是否发布',
      _id: 'radio_1669983063270_4',
      dataIndex: 'published',
      index: {
        on: true,
      },
    },
  ],
};
