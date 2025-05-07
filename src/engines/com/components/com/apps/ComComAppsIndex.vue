<script lang="ts">
import { defineComponent, computed, ref, Ref, toRefs, reactive } from 'vue';
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { VObject } from '@/lib/vails/model';
import ComComAppsShow from './ComComAppsShow.vue';

const ComComAppsIndex = defineComponent({
  name: 'ComComAppsIndex',
  components: {
    ComComAppsShow,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const config = computed(() => ({
      recordName: '应用',
      store: props.store,
      // pagination: {
      //   perPage: 15,
      //   showPageSizeChanger: false,
      //   hideOnSinglePage: false,
      //   showSizeChanger: false,
      // }
      template: 'app',
      detail: {
        mode: 'drawer',
        width: '1100px',
      },
      mode: 'table',
      // editApi:
      // showCount: true,
      actions: [
        { key: 'create', enabled: true },
        { key: 'update', enabled: true },
        // { key: 'delete', enabled: true },
        // { key: 'import', enabled: true },
        // { key: 'export', enabled: true },
      ],
      // table: {
      //   scroll: { y: '70vh' },
      //   // columns: [{ dataIndex: 'id', title: 'ID' }],
      // },
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
      searcherSimpleOptions: [
        { key: 'name', label: '名称', type: 'string' },
        { key: 'code', label: '标识', type: 'string' },
      ],
    }));

    const statistics = ref({
      // key1: 0,
      // key2: 0,
    });

    const tabs = computed<TaIndexViewTabInterface[]>(() => [
      {
        key: 'all',
        label: '全部应用',
        // num: statistics.value.key1,
        query: {},
      },
    ]);

    const onIndex = (data: VObject) => {
      statistics.value = data.statistics;
    };

    return {
      ...toRefs(props),
      config,
      tabs,
      onIndex,
    };
  },
});

export default ComComAppsIndex;
</script>

<template lang="pug">
.com-com-admin-apps-index
  TaIndexView(:config='config' :tabs='tabs' @onIndex='onIndex')
    //- template(#card='{ record }')
    //- template(#table)
    //-    a-table-column(:autoHeight='true' title='名称' dataIndex='record')
    //- template(#detail='{ record, onClose }')
    //-   ComComAppsShow(
    //-     v-if='record.id'
    //-     :store='store'
    //-     :extendRoute='`/com/admin/apps/${record.id}`'
    //-     :editable='editable'
    //-     @afterDelete='onClose'
    //-     @afterExtend='onClose'
    //-   )

</template>

<style lang="stylus" scoped>
.com-com-admin-apps-index
  height 100%
  width 100%
</style>
