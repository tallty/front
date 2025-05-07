<script lang="ts">
import { defineComponent, computed, ref, Ref, toRefs, reactive } from 'vue';
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { VObject } from '@/lib/vails/model';
import ComComThemeShow from './ComComThemeShow.vue';
import { themeTemplate, formThemeTemplate } from './template';

const ComComThemeIndex = defineComponent({
  name: 'ComComThemeIndex',
  components: {
    ComComThemeShow,
  },
  props: {
    store: { type: Object, required: true },
    appId: { type: Number, required: true },
  },
  setup(props) {
    const config = computed(() => ({
      recordName: '主题',
      store: props.store,
      // pagination: {
      //   perPage: 15,
      //   showPageSizeChanger: false,
      //   hideOnSinglePage: false,
      //   showSizeChanger: false,
      // }
      template: themeTemplate,
      detail: {
        mode: 'auto',
        //   mode: 'drawer',
        width: '1100px',
      },
      mode: 'table',
      // editApi:
      // showCount: true,
      actions: [
        { key: 'create', enabled: true },
        { key: 'update', enabled: true },
        { key: 'delete', enabled: true },
        //  { key: 'import', enabled: true },
        //  { key: 'export', enabled: true },
      ],
      table: {
        scroll: { y: '70vh' },
        // columns: [{ dataIndex: 'id', title: 'ID' }],
      },
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
      // searcherSimpleOptions: [{key: 'title', label: '标题', type: 'string' }],
    }));

    const tabs = computed(() => [
      {
        key: 'svr',
        label: '活动主题',
        query: { model_flag_eq: 'svr' },
        template: themeTemplate,
      },
      {
        key: 'form',
        label: '表单主题',
        query: { model_flag_eq: 'form' },
        template: formThemeTemplate,
      },
    ]);

    return {
      ...toRefs(props),
      config,
      tabs,
    };
  },
});

export default ComComThemeIndex;
</script>

<template lang="pug">
.com-com-admin-theme-index
  TaIndexView(:config='config', :tabs='tabs')
    //- template(#card='{ record }')
    //- template(#table)
    //-    a-table-column(:autoHeight='true' title='名称' dataIndex='record')
    //- template(#detail='{ record, onClose }')
    //-   ComComThemeShow(
    //-     v-if='record.id'
    //-     :store='store'
    //-     :extendRoute='`/com/admin/apps/${appId}/themes/${record.id}`'
    //-     :editable='editable'
    //-     @afterDelete='onClose'
    //-     @afterExtend='onClose'
    //-   )

</template>

<style lang="stylus" scoped>
.com-com-admin-theme-index
  height 100%
  width 100%
</style>
