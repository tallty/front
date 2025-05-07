<template lang="pug">
.w-full.mb-6 
  .flex.flex-row.items-center.justify-between 
    .flex.items-center 
      img.w-5.h-5.mr-2(src='https://innomatchoss.oss-cn-hangzhou.aliyuncs.com/permit/user-circle.png')
      .text-base.font-medium.text-gray-500 身份
    .flex.items-center 
      a-input(v-model:value='searchKey' placeholder="搜索" style="width: 148px" )
      a-button(style='margin-left: 16px' type='primary' @click='handleCreate') 
        .flex.items-center 
          TaIcon.text-white.w-4.h-4(type='flowbite-outline/plus')
          .text-xs.font-medium.text-white.ml-1 添加
  .w-full.mt-2 
    taIndexView(
      :config='config',
      ref='taIndexView',
      @tableChange='tableChange'
    )
      template(#header)
        .empty
      template(#bodyCell='{ record, column, text, index  }')
        template(v-if='column.title === "操作"')
          TaPopoverConfirm(
            title='删除',
            :content='`确认删除`',
            @confirm='() => delItem(record)'
          )
            .cursor-pointer.text-blue-700.text-sm(@click.stop='') 删除
</template>
<script lang="ts">
import { ResAdminMemberIdentitiesApi } from '@/engines/res/res-core/apis/res/admin/member_identities.api';
import { VStore } from '@/lib/vails';
import { computed, defineComponent, ref, toRefs, watch } from 'vue';

const ComPermitAdminUserListMemberIdentity = defineComponent({
  name: 'ComPermitAdminUserListMemberIdentity',
  components: {},
  props: {
    activeRole: { type: Object, default: () => {} },
  },
  emits: ['addRoleRelation', 'delRoleRelation'],
  setup(props, { emit }) {
    const store = new VStore(new ResAdminMemberIdentitiesApi());
    const searchKey = ref('');
    const pageSize = ref(6);

    const config = computed(() => ({
      recordName: '',
      store,
      pagination: {
        hideOnSinglePage: true,
        perPage: pageSize.value,
        pageSizeOptions: ['6', '10', '20', '50'],
      },
      template: 'role#role_member_identity',
      mode: 'table',
      actions: [
        { key: 'create', enabled: false },
        { key: 'update', enabled: false },
        { key: 'delete', enabled: false },
        { key: 'import', enabled: false },
        { key: 'export', enabled: false },
      ],
      params: {
        q: {
          permit_roles_id_in: [props.activeRole?.id],
        },
      },
      table: {
        pushColumns: [
          {
            title: '操作',
            width: '120px',
          },
        ],
      },
    }));
    const taIndexView = ref();

    const delItem = (v: any) => {
      emit('delRoleRelation', 'member_identity', props.activeRole?.id, v?.id);
    };

    const handleCreate = () => {
      emit('addRoleRelation');
    };

    const loadData = () => {
      taIndexView.value.fetchData();
    };

    const onSearch = () => {
      (taIndexView.value as any).fetchData(1, { name_cont: searchKey.value });
    };
    const tableChange = (v: any) => {
      pageSize.value = v.pageSize;
    };

    watch(
      () => searchKey,
      () => onSearch(),
      { deep: true },
    );

    return {
      ...toRefs(props),
      config,
      taIndexView,
      searchKey,
      delItem,
      handleCreate,
      loadData,
      tableChange,
    };
  },
});
export default ComPermitAdminUserListMemberIdentity;
</script>
<style lang="stylus" scoped>
>>>.ta-table-component
  .ta-table-component__table
    padding 0 !important
:deep(.ta-table-component)
  .ant-table-wrapper
    z-index unset !important
>>>.ant-select
  z-index: 9999 !important
</style>
