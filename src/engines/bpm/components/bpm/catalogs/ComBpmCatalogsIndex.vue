<script lang="ts">
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { computed, defineComponent, toRefs } from 'vue';
// import { VObject } from '@/lib/vails/model';
import ComBpmCatalogsShow from './ComBpmCatalogsShow.vue';
import { BpmCatalogTemplate } from './template';

const ComBpmCatalogsIndex = defineComponent({
  name: 'ComBpmCatalogsIndex',
  components: {
    ComBpmCatalogsShow,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props) {
    const config = computed(() => ({
      recordName: '工作流分类',
      store: props.store,
      // pagination: {
      //   perPage: 15,
      //   showPageSizeChanger: false,
      //   hideOnSinglePage: false,
      //   showSizeChanger: false,
      // }
      template: BpmCatalogTemplate,
      draggable: true,
      // detail: {
      //   mode: 'auto',
      //   mode: 'drawer',
      //   width: '1100px',
      // },
      mode: 'table',
      // editApi:
      // showCount: true,
      // actions: [
      //  { key: 'create', enabled: true },
      //  { key: 'update', enabled: true },
      //  { key: 'delete', enabled: true },
      //  { key: 'import', enabled: true },
      //  { key: 'export', enabled: true },
      // ],
      // table: {
      //   scroll: { y: '70vh' },
      //   // columns: [{ dataIndex: 'id', title: 'ID' }],
      // },
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
      // searcherSimpleOptions: [{key: 'title', label: '标题', type: 'string' }],
    }));

    // const statistics = ref({
    //   key1: 0,
    //   key2: 0,
    // });

    const tabs = computed<TaIndexViewTabInterface[]>(() => [
      // {
      //   key: 'key1',
      //   label: '标签1',
      //   num: statistics.value.key1,
      //   query: {},
      // },
      // {
      //   key: 'key2',
      //   label: '标签2',
      //   num: statistics.value.key2,
      //   query: {},
      // },
    ]);

    // const onIndex = (data: VObject) => {
    // statistics.value = data.statistics;
    // };

    return {
      ...toRefs(props),
      config,
      tabs,
    };
  },
});

export default ComBpmCatalogsIndex;
</script>

<template lang="pug">
.com-bpm-admin-catalogs-index
  TaIndexView(:config='config', :tabs='tabs', @onIndex='onIndex')
    //- template(#card='{ record }')
    //- template(#table)
    //-    a-table-column(:autoHeight='true' title='名称' dataIndex='record')
    //- template(#detail='{ record, onClose }')
    //-   ComBpmCatalogsShow(
    //-     v-if='record.id'
    //-     :store='store'
    //-     :extendRoute='`/bpm/admin/catalogs/${record.id}`'
    //-     :editable='editable'
    //-     @afterDelete='onClose'
    //-     @afterExtend='onClose'
    //-   )
</template>

<style lang="stylus" scoped>
.com-bpm-admin-catalogs-index
  height 100%
  width 100%
</style>
