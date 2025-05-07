<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { VModel, VStore } from '@/lib/vails';
import { PermitAdminUsersApi, PermitAdminUserModel } from '../../../../apis/permit/admin/users.api';
import { PermitAdminModsApi } from '../../../../apis/permit/admin/mods.api';
import { PermitMod, PermitUser } from '@/engines/permit/model';
import { TaIndexViewTabInterface } from '@/components/global/ta-component/TaIndexView/types';
import { PermitAdminRolesApi } from '../../../../apis/permit/admin/role.api';
import { VObject } from '@/lib/vails/model';
import ComPermitAdminUserList from './ComPermitAdminUserList.vue';
import ComPermitAdminUserRole from './ComPermitAdminUserRole.vue';
import { cloneDeep } from 'lodash';

const ComPermitAdminUsersIndex = defineComponent({
  name: 'ComPermitAdminUsersIndex',
  components: {
    ComPermitAdminUserList,
    ComPermitAdminUserRole,
  },
  setup() {
    const userStore = new VStore(new PermitAdminUsersApi(), PermitAdminUserModel);
    const modStore = new VStore(new PermitAdminModsApi());
    modStore.index({ per_page: 999999 });

    const roleStore = new VStore(new PermitAdminRolesApi());
    const showRoleStore = new VStore(new PermitAdminRolesApi());

    const tabs = computed(() =>
      modStore.records.value.map((mod: PermitMod) => ({
        key: mod.id,
        label: mod.name,
        query: { mod: mod.name },
        meta: { key: mod.key },
      })),
    );

    const config = computed(() => ({
      recordName: '',
      store: roleStore,
      pagination: {
        hide: true,
        perPage: 18,
      },
      params: {
        q: {
          s: [sortBy.value || undefined],
        },
      },
      mode: 'list',
      showCount: false,
      scrollLoading: true,
      list: {
        scroll: {
          y: 'auto',
        },
      },
    }));

    const showConfig = computed(() => ({
      recordName: `${activeUser.value.name}的权限`,
      store: showRoleStore,
      mode: 'table',
    }));

    const activeModKey = ref('');
    const activeModId = ref('-1');

    const onTabChange = (tab: TaIndexViewTabInterface) => {
      activeModKey.value = tab.meta?.key;
      activeModId.value = tab.key;
      roleStore.index({
        per_page: 999999,
        q: { mod_id_eq: tab.key },
      });
    };

    const activeUser = ref<Partial<PermitUser>>({});

    const filters = [
      { text: '已授权', value: true },
      { text: '未授权', value: false },
    ];

    const FILTER_PREFIX = 'mod_filter_';

    const filtersProcessor = (filters: VObject) => {
      const withRoleKeys: string[] = [];
      const withoutRoleKeys: string[] = [];

      Object.keys(filters).forEach((key: string) => {
        if (key.startsWith(FILTER_PREFIX) && filters[key]) {
          const roleKey = key.replace(FILTER_PREFIX, '');
          if (filters[key].includes(true)) withRoleKeys.push(roleKey);
          if (filters[key].includes(false)) withoutRoleKeys.push(roleKey);
        }
      });
      return {
        with_role: withRoleKeys,
        without_role: withoutRoleKeys,
      };
    };

    const temporaryQuery = ref({});

    const onSearchOrg = (selectedKeys: string[], confirm: () => void) => {
      temporaryQuery.value = { orgs_name_cont: selectedKeys[0] };
      confirm();
    };

    const onSearchOrgReset = (_: string[], confirm: () => void) => {
      temporaryQuery.value = {};
      confirm();
    };

    const mode = ref<'user' | 'role'>('user');

    const searchKey = ref('');

    const onSearch = (v: string) => {
      console.log(v);
    };

    const sortBy = ref();
    const sortType = [
      {
        name: '新建时间正序',
        key: 'created_at asc',
      },
      {
        name: '新建时间倒序',
        key: 'created_at desc',
      },
      {
        name: '首字母正序',
        key: 'pinyin asc',
      },
      {
        name: '首字母倒序',
        key: 'pinyin desc',
      },
    ];

    const taIndexView = ref();

    const roleRecord = ref({});
    const roleFormvisible = ref(false);
    const formTitle = ref('');
    const activeRole = ref<any>({});
    const onShow = (record: PermitUser) => {
      activeRole.value = record;
      edit.value = false;
    };
    const onIndex = (data: any) => {
      if (!activeRole.value?.id && data.records?.length) {
        activeRole.value = { ...data.records[0] };
      }
    };

    const create_role = () => {
      roleFormvisible.value = true;
      roleRecord.value = roleStore.new();
      formTitle.value = '新建角色';
    };

    const update_role = (record: VObject) => {
      roleStore.find(Number(record?.id)).then(({ data }) => {
        roleRecord.value = roleStore.new(data);
        roleFormvisible.value = true;
        formTitle.value = '编辑角色';
      });
    };

    const onCreate = (opts: VObject) => {
      const lastFormData = cloneDeep((roleRecord.value as VModel)?.lastFormData);
      roleRecord.value = roleStore.new;
      roleFormvisible.value = true;
    };

    const loadRoleData = () => {};

    const edit = ref(false);

    const rolesRef = ref();

    const changeEdit = () => {
      edit.value = !edit.value;
      rolesRef.value?.restPermission();
    };
    const saveRoles = () => {
      rolesRef.value.save();
    };

    const handleSave = async (keys: any[]) => {
      await roleStore.update({
        id: activeRole.value.id,
        permission_keys: keys,
      } as any);
      changeEdit();
    };

    const reloadActiveRole = (roleId: number) => {
      roleStore.find(roleId).then(({ data }) => {
        activeRole.value = data;
      });
    };

    const searchRoles = () => {
      (taIndexView.value as any).fetchData(1, { label_or_name_cont: searchKey.value });
    };

    watch(
      () => searchKey,
      () => searchRoles(),
      { deep: true },
    );

    return {
      userStore,
      config,
      showConfig,
      tabs,
      onTabChange,
      activeModKey,
      activeModId,
      activeUser,
      roles: roleStore.records,
      filters,
      FILTER_PREFIX,
      temporaryQuery,
      onSearchOrg,
      onSearchOrgReset,

      mode,
      searchKey,
      onSearch,
      sortBy,
      sortType,

      taIndexView,
      activeRole,
      roleRecord,
      formTitle,
      onShow,
      onIndex,
      onCreate,
      create_role,
      update_role,
      roleFormvisible,

      edit,
      rolesRef,
      changeEdit,
      saveRoles,
      handleSave,
      loadRoleData,
      reloadActiveRole,
    };
  },
});

export default ComPermitAdminUsersIndex;
</script>

<template lang="pug">
.permit-admin-users-index.flex.flex-col
  .px-4.py-3.bg-white.h-58px.text-lg.text-gray-900.font-medium 权限管理
  .h-0.flex-grow.flex.flex-row.flex-nowrap.p-4.bg-gray-100 
    .w-50.h-full.p-4.bg-white.mr-4.rounded-lg.p-4.flex.flex-col
      .flex.items-center.justify-between
        .text-lg.text-gray-900.font-medium 系统管理角色
        .w-8.h-8.rounded-full.bg-blue-600.flex.items-center.justify-center.cursor-pointer(@click='create_role') 
          TaIcon.w-6.h-6.text-white(type='flowbite-outline/plus')
      .mt-6.mb-2.flex.items-center.justify-between.search-wrap 
        a-input(v-model:value='searchKey' placeholder="搜索" style="width: 120px" )
        a-popover(placement='rightTop') 
          template(#content)
            .flex.flex-col 
              .w-35.px-3.py-2.rounded-lg.cursor-pointer.text-gray-700.text-sm(
                v-for='item in sortType' 
                @click='() => sortBy = item.key' 
                class='hover:bg-gray-100'
                :class='sortBy === item.key ? "bg-gray-100" : ""'
              ) {{ item.name }}
          .w-9.h-9.rounded-lg.bg-gray-100.border-1.border-gray-200.flex.items-center.justify-center
            TaIcon.w-4.h-4.text-gray-600(type='flowbite-outline/filter')
      .h-0.flex-grow
        TaIndexView(
          ref='taIndexView',
          :config='config',
          @onShow='onShow',
          @onIndex='onIndex',
        )
          template(#header)
            .empty
          template(#card='{record,actions}')
            .px-4.py-3.rounded-lg.text-sm.cursor-pointer.flex.items-center.justify-between.record_item(
              :class='activeRole?.id === record.id ? "font-medium text-blue-600 bg-blue-50" : ""'
              class='hover:bg-gray-50'
            ) 
              .w-0.flex-grow.ellipsis {{ record?.label || record?.name }}
              .flex.items-center.record_item_actionwrap.w-13
                .w-6.h-6.items-center.flex.justify-center.cursor-pointer.record_item_action.rounded
                  TaIcon.w-4.h-4.text-gray-400.mr-2(type='flowbite-outline/pencil-alt' @click.stop='update_role(record)')
                .w-6.h-6.items-center.flex.justify-center.cursor-pointer.record_item_action.rounded
                  TaPopoverConfirm(
                    title='确定删除吗？',
                    okText='确定',
                    cancelText='取消',
                    @click.stop='',
                    @confirm='actions.delete(record)'
                  )
                    TaIcon.w-4.h-4.text-gray-400(type='flowbite-outline/trash')
    .w-0.flex-grow.flex.flex-col.h-full 
      .w-full.h-0.flex-grow.bg-white.rounded-lg.p-4.overflow-y-scoll.pt-0.flex.flex-col(:class='mode === "user" ? "" : "mb-4"')
        a-tabs(v-model:activeKey='mode')
          a-tab-pane(key='user' tab='人员')
          a-tab-pane(key='role' tab='权限')
        ComPermitAdminUserList(:activeRole='activeRole', @reload='reloadActiveRole' v-show='mode === "user"')
        ComPermitAdminUserRole(:activeRole='activeRole' v-show='mode === "role"' ref='rolesRef', :disabled='!edit'  @reset='handleSave')
      .w-full.h-15.py-3.bg-white.bg-white.rounded-lg.flex.flex-row.items-center.justify-center(v-if='mode === "role"')
        template(v-if='edit')
          .mr-4
            a-button(type='primary' @click='saveRoles') 保存
          a-button(@click='changeEdit') 取消
        template(v-else)
          a-button(type='primary' @click='changeEdit') 编辑
  TaTemplateFormWithActionsDrawer(
    v-model:visible='roleFormvisible',
    template='role#model',
    :record='roleRecord',
    :closable='false',
    :title='formTitle',
    :canSaveAndCreateNext='false',
    @afterSaveAndCreateNext='onCreate',
    @afterSave="loadRoleData()",
  )
</template>

<style lang="stylus" scoped>
.permit-admin-users-index
  height 100%
  width 100%
	.ant-tabs-top
		> .ant-tabs-nav::before
			border: none !important

.permits
  padding 24px
.record_item
  .record_item_actionwrap
    width 0
    overflow hidden
  .record_item_action:hover
    background-color rgba(0,0,0,0.05)
.record_item:hover
  .record_item_actionwrap
    width 48px
.search-wrap
  >>>.ant-input
    background #FFF !important
    border-radius 8px
    color #111928
    padding 6px 16px !important
    bprder-color #E5E7EB
  >>>.ant-input::placeholder
    color: #9CA3AF
    font-size 14px
    font-weight 400
  >>>.ant-input-affix-wrapper
    background #F9FAFB !important
    padding var(--inputPadding) !important
    border-radius 8px
    >>>.ant-input::placeholder
      color: #6B7280
      font-size 14px
      font-weight 400

  >>>.ant-input-group-addon
    div
      color: #6B7280
</style>
