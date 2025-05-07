<script lang="ts">
import { defineComponent, computed, ref, Ref, toRefs, reactive } from 'vue';
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { VObject } from '@/lib/vails/model';
import ComComSearchItemsShow from './ComComSearchItemsShow.vue';
import { comAdminSearchItemTemplate } from './template';

const ComComSearchItemsIndex = defineComponent({
  name: 'ComComSearchItemsIndex',
  components: {
    ComComSearchItemsShow,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const config = computed(() => ({
      recordName: '搜索项',
      store: props.store,
      // pagination: {
      //   perPage: 15,
      //   showPageSizeChanger: false,
      //   hideOnSinglePage: false,
      //   showSizeChanger: false,
      // }
      template: comAdminSearchItemTemplate,
      // detail: {
      //   mode: 'auto',
      //   mode: 'drawer',
      //   width: '1100px',
      // },
      mode: 'table',
      draggable: true,
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

    // const statistics = ref({
    //   key1: 0,
    //   key2: 0,
    // });

    // const tabs = computed<TaIndexViewTabInterface[]>(() => [
    //   {
    //     key: 'key1',
    //     label: '标签1',
    //     num: statistics.value.key1,
    //     query: {},
    //   },
    //   {
    //     key: 'key2',
    //     label: '标签2',
    //     num: statistics.value.key2,
    //     query: {},
    //   },
    // ]);

    // const onIndex = (data: VObject) => {
    //   statistics.value = data.statistics;
    // };

    return {
      ...toRefs(props),
      config,
      // tabs,
      // onIndex,
    };
  },
});

export default ComComSearchItemsIndex;
</script>

<template lang="pug">
.com-com-admin-search-items-index.rounded-lg.bg-white(class='!p-4')
  TaIndexView(:config='config')
    //- template(#card='{ record }')
    //- template(#table)
    //-    a-table-column(:autoHeight='true' title='名称' dataIndex='record')
    //- template(#detail='{ record, onClose }')
    //-   ComComSearchItemsShow(
    //-     v-if='record.id'
    //-     :store='store'
    //-     :extendRoute='`/com/admin/search_items/${record.id}`'
    //-     :editable='editable'
    //-     @afterDelete='onClose'
    //-     @afterExtend='onClose'
    //-   )

</template>

<style lang="stylus" scoped>
.com-com-admin-search-items-index
  height 100%
  width 100%
</style>
