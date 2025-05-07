<script lang="ts">
import { defineComponent, computed, ref, Ref, toRefs, reactive } from 'vue';
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { VObject } from '@/lib/vails/model';
import ComPermitDataScopesShow from './ComPermitDataScopesShow.vue';

const ComPermitDataScopesIndex = defineComponent({
  name: 'ComPermitDataScopesIndex',
  components: {
    ComPermitDataScopesShow,
  },
  props: {
    store: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const config = computed(() => ({
      recordName: '',
      store: props.store,
      pagination: {
        perPage: 15,
        showPageSizeChanger: false,
        hideOnSinglePage: false,
        showSizeChanger: false,
      },
      template: 'data_scope',
      detail: {
        mode: 'auto',
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
        scroll: { y: 'auto' },
        // columns: [{ dataIndex: 'id', title: 'ID' }],
      },
      list: {
        scroll: { y: 'auto' },
      },
      // selection: {
      //   showByDefault: false;
      //   showSwitch: false;
      // };
      // searcherSimpleOptions: [{key: 'title', label: '标题', type: 'string' }],
    }));

    const statistics = ref({
      key1: 0,
      key2: 0,
    });

    const tabs = computed<TaIndexViewTabInterface[]>(() => [
      {
        key: 'key1',
        label: '标签1',
        num: statistics.value.key1,
        query: {},
      },
      {
        key: 'key2',
        label: '标签2',
        num: statistics.value.key2,
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

export default ComPermitDataScopesIndex;
</script>

<template lang="pug">
.com-permit-admin-data-scopes-index
  TaIndexView(:config='config' @onIndex='onIndex')
    //- template(#card='{ record }')
    //- template(#table)
    //-    a-table-column(:autoHeight='true' title='名称' dataIndex='record')
    //- template(#detail='{ record, onClose }')
    //-   ComPermitDataScopesShow(
    //-     v-if='record.id'
    //-     :store='store'
    //-     :extendRoute='`/permit/admin/data_scopes/${record.id}`'
    //-     :editable='editable'
    //-     @afterDelete='onClose'
    //-     @afterExtend='onClose'
    //-   )

</template>

<style lang="stylus" scoped>
.com-permit-admin-data-scopes-index
  height 100%
  width 100%
</style>
