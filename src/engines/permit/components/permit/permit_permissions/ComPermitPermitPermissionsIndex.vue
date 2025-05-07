<script lang="ts">
import { defineComponent, computed, ref, Ref, toRefs, reactive } from 'vue';
import { VObject } from '@/lib/vails/model';
import { PermitAdminPermitPermissionsApi } from '@/engines/permit/apis/permit/admin/permit_permissions.api';
import ComPermitPermitPermissionsShow from './ComPermitPermitPermissionsShow.vue';

const ComPermitPermitPermissionsIndex = defineComponent({
  name: 'ComPermitPermitPermissionsIndex',
  components: {
    ComPermitPermitPermissionsShow,
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
      template: 'permit_permission',
      // detail: {
      //   mode: 'drawer',
      //   width: '1100px',
      // },
      mode: 'table',
      // editApi:
      // showCount: true,
      actions: [
        { key: 'create', enabled: true },
        { key: 'update', enabled: true },
        { key: 'delete', enabled: true },
        { key: 'import', enabled: false },
        { key: 'export', enabled: false },
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
      searcherSimpleOptions: [
        { key: 'action_or_key', label: 'action', type: 'string' },
        { key: 'klass', label: 'klass', type: 'string' },
        { key: 'mod_name_or_mod_key', label: 'mod_name', type: 'string' },
      ],
    }));

    const permissionApi = new PermitAdminPermitPermissionsApi();
    const refrshPermission = () => {
      permissionApi.sendCollectionAction('reload').then(() => {
        props.store.index();
      });
    };

    const clearCache = () => {
      permissionApi.sendCollectionAction('clear').then(() => {
        props.store.index();
      });
    };

    const onIndex = (data: VObject) => {};

    return {
      ...toRefs(props),
      config,
      onIndex,
      clearCache,
      refrshPermission,
    };
  },
});

export default ComPermitPermitPermissionsIndex;
</script>

<template lang="pug">
.com-permit-admin-permit-permissions-index
  TaIndexView(:config='config' @onIndex='onIndex')
    template(#header)
      .empty
    template(#right-actions)
      TaTextButton.mx-10(
          icon='ClearOutlined',
          @click='clearCache'
        ) 清除缓存
      TaTextButton(
              icon='SyncOutlined',
              @click='refrshPermission'
            ) 刷新权限

</template>

<style lang="stylus" scoped>
.com-permit-admin-permit-permissions-index
  height 100%
  width 100%
</style>
