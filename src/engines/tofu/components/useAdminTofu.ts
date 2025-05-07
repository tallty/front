import store from '@/store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { VObject } from '../../../lib/vails/model/index';
import { TofuEntry } from '../model';

let idStore = -1;

export const useAdminTofuPermit2PathMapping: VObject = {
  com_admin: '/com/admin/model_settings',
  res_admin: '/res/admin/orgs',
  tofu_admin: '/tofu/admin/pc/entries',
  permit_admin: '/permit/admin/users',
  bpm_admin: '/bpm/admin/workflows',
  bpm_manage: '/bpm/admin/workflows',
  // svr_admin: '/svr/admin/submodules',
};

// const routes: MenuDataItem[] = [];
// // 引入 engine 文件夹下文件
// const engineRoute = require.context('./../../../engines/', true, /\.route\.ts$/);

// engineRoute.keys().forEach(fileName => {
//   const moduleRoutes = engineRoute(fileName).default;
//   if (Array.isArray(moduleRoutes)) {
//     routes.push(...moduleRoutes);
//   }
// });

const generateEntry = (
  name: string,
  url: string,
  prefix: string,
  children?: Partial<TofuEntry>[],
  ancestry?: string,
): Partial<TofuEntry> => {
  const id = idStore--;
  return {
    id,
    depth: -1, // 生成的是 负 depth
    icon: 'SettingFilled',
    name,
    url,
    ancestry,
    layout: 'TofuAdminLayout',
    children:
      children ||
      ([
        // 先塞一个自己，保证切换 menus 选择了自己
        generateEntry(name, url, prefix, [], `${id}`),
        // ...(routes
        //   .filter((route: MenuDataItem) => {
        //     return route.meta?.role === 'admin' && route.path.startsWith(`/${prefix}/admin`);
        //   })
        //   .map((route: MenuDataItem) => generateEntry('', route.path, prefix, [], `${id}`)) as any),
      ] as any),
    type: 'Tofu::Menu',
    permits: {
      role_permits: [
        {
          role_name: `${prefix}_admin`,
        },
      ],
    },
  };
};

export const useAdminTofuEntries: Partial<TofuEntry>[] = [
  generateEntry('模型', '/com/admin/model_settings', 'com'),
  generateEntry('应用', '/com/admin/apps', 'com'),
  generateEntry('组织', '/res/admin/orgs', 'res'),
  // generateEntry('人员', '/res/admin/members', 'res'),
  generateEntry('人员', '/res/admin/users', 'res'),
  generateEntry('岗位', '/res/admin/duties', 'res'),
  generateEntry('标签', '/res/admin/tags', 'res'),
  generateEntry('导航', '/tofu/admin/pc/entries', 'tofu'),
  generateEntry('权限', '/permit/admin/users', 'permit'),
  generateEntry('工作流', '/bpm/admin/workflows', 'bpm'),
  generateEntry('流程分类', '/bpm/admin/catalogs', 'bpm'),
  generateEntry('状态机', '/state/manage/machines', 'state'),
  // generateEntry('活动', '/svr/admin/submodules', 'svr'),
];

const useAdminTofu = () => {
  const getPermittedEntries = (permits: string) =>
    useAdminTofuEntries.filter(
      entry =>
        (
          entry.permits?.role_permits?.map(
            (rolePermit: { role_name: string }) => rolePermit.role_name,
          ) || []
        ).filter((permit: string) => permits.includes(permit)).length > 0,
    );

  const haveAnyAdminPermit = computed(
    () =>
      (
        store.state.user.currentUser.roles_name?.filter(
          (permit: string) => !!useAdminTofuPermit2PathMapping[permit],
        ) || []
      ).length > 0,
  );

  const router = useRouter();

  const toSetting = () => {
    const existedPermit = Object.keys(useAdminTofuPermit2PathMapping).find((permit: string) =>
      store.state.user.currentUser.roles_name.includes(permit),
    );
    if (existedPermit) {
      router.push(useAdminTofuPermit2PathMapping[existedPermit]);
    }
  };

  return {
    getPermittedEntries,
    haveAnyAdminPermit,
    toSetting,
  };
};

export default useAdminTofu;
