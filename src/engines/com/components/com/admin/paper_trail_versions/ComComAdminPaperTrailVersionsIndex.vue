<script lang="ts">
import { ComAdminPaperTrailVersionsApi } from '@/engines/com/apis/com/admin/paper_trail_versions.api';
import { VObject, VStore } from '@/lib/vails';
import { computed, defineComponent, ref } from 'vue';
import ComComFilters from './ComComFilters.vue';

export default defineComponent({
  name: 'ComComAdminPaperTrailVersionsIndex',
  components: { ComComFilters },
  setup() {
    const store = new VStore(new ComAdminPaperTrailVersionsApi());

    const config = computed(() => ({
      store,
      recordName: '版本管理',
      mode: 'table',
      template: 'paper_trail_version',
      detail: {
        mode: 'drawer',
      },
      table: {
        scroll: {
          y: 'auto',
        },
      },
    }));

    const filterFields = [
      {
        key: 'item_id',
        label: '资源ID',
        type: 'number',
      },
      {
        key: 'item_type',
        label: '资源类型',
        type: 'text',
      },
      {
        key: 'event',
        label: '事件',
        type: 'select',
        mode: 'multiple',
        options: [
          { label: '创建', value: 'create' },
          { label: '修改', value: 'update' },
          { label: '删除', value: 'destroy' },
        ],
      },
      {
        key: 'created_at',
        label: '创建时间',
        type: 'datetime',
      },
    ];

    const filterQuery = ref<VObject>({});
    const onFilterChange = (value: VObject) => {
      filterQuery.value = value;
    };

    return {
      config,
      filterFields,
      onFilterChange,
      filterQuery,
    };
  },
});
</script>

<template lang="pug">
.com-com-admin-paper-trail-versions-index.w-full.h-full
  TaIndexView(:config='config', :temporaryQuery='filterQuery', :drawerDisabled='true')
    template(#collection-actions)
      ComComFilters(ref='filterRef', :fields='filterFields', @filtersChanged='onFilterChange')
</template>
