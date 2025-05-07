<script lang="ts">
import { FormsAdminTemplatesApi } from '@/engines/com/apis/forms/admin/templates.api';
import { defineComponent, computed } from 'vue';
import { VStore } from '@/lib/vails';

const ComFormsAdminTemplatesIndex = defineComponent({
  name: 'ComFormsAdminTemplatesIndex',
  components: {},
  setup() {
    const store = new VStore(
      new FormsAdminTemplatesApi({
        params: {
          q: { s: ['id desc'] },
        },
      }),
    );

    const template = {
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
              name: '名称',
              type: 'input',
              rules: [],
              model: { attr_type: 'string' },
              options: { span: 24 },
              key: 'input_1619171405692_3',
              model_key: 'name',
              fields: [],
            },
            {
              name: '表单',
              type: 'form_setting_designer',
              rules: [],
              model: { attr_type: 'array' },
              options: { span: 24 },
              key: 'input_1619171410155_4',
              model_key: 'form_setting',
              fields: [],
            },
          ],
          options: { span: 24, label: { align: 'left', width: 80 } },
          key: 'layout_1619171401544_1',
          model_key: 'layout_1619171401544_1',
        },
      ],
    };

    const config = computed(() => ({
      recordName: '表单',
      store: store,
      mode: 'table',
      template: template,
      actions: {
        create: true,
        update: true,
        delete: true,
      },
      table: {
        scroll: { y: 'auto' },
      },
      detail: {
        mode: 'auto',
        width: '80vw',
      },
      searcherSimpleOptions: [{ key: 'name', label: '名称', type: 'string' }],
    }));

    return {
      config,
      template,
    };
  },
});

export default ComFormsAdminTemplatesIndex;
</script>

<template lang="pug">
.com-forms-admin-templates-index
  TaIndexView(:config='config')
    template(#table='{ actions }')
      a-table-column(:autoHeight='true' title='id', dataIndex='id')
      a-table-column(:autoHeight='true' title='名称', dataIndex='name')
      a-table-column(:autoHeight='true' title='uuid', dataIndex='uuid')
    template(#detail='{ record }')
      TaTemplateFormViewer(:template='template', :record='record')
</template>

<style lang="stylus" scoped>
.com-forms-admin-templates-index
  height 100%
  width 100%
</style>
