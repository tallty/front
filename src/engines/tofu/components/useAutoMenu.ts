import { computed } from '@vue/reactivity';
import { filter, isEqual } from 'lodash';
import { ComputedRef, nextTick, reactive, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { injectMultiTabStore } from '../../../components/multi-tab/multi-tab-store';
import { TofuUserPcEntriesApi } from '../apis/tofu/user/pc/entries.api';
import { TofuEntry } from '../model';
import { useAdminTofuEntries } from './useAdminTofu';
import { VObject } from '@/lib/vails';

export interface menuState {
  menuTree: TofuEntry[];
  menuModTreeMapping: Record<string, TofuEntry[]>;
  menuIdMapping: Record<number, TofuEntry>;
  menuPathMapping: Record<string, TofuEntry[]>;
  menuChain: TofuEntry[];
  current?: TofuEntry;
  subMenuClosed: boolean;
}

export const state = reactive<menuState>({
  menuTree: [],
  menuModTreeMapping: {},
  menuIdMapping: {},
  menuPathMapping: {},
  current: undefined,
  menuChain: [],
  subMenuClosed: false,
});

const menuRouteMod = 'menus';
const menusUrl = '/menus';
// 主树在 /menus/xx/xx 下
// 其余 mod 树在各自 /:mod/xx/xx 下

export const useAutoMenu = () => {
  const { mod, isMenuMod, route, getChain, registerTofuEntry, onSelectMenu, pathsAreMatch } =
    useAutoMenuHelper();

  const fetchMenuTree = async (
    filterFn: (item: VObject, ancestor: VObject[]) => boolean = () => true,
  ) => {
    return new TofuUserPcEntriesApi().sendCollectionAction('tree').then(({ data }) => {
      state.menuTree = shakingTree((data as any).records, filterFn).concat(useAdminTofuEntries);
      registerTofuEntry(state.menuTree);
      freshCurrent();
    });
  };

  const shakingTree = (
    data: VObject[],
    filterFn: (item: VObject, ancestor: VObject[]) => boolean,
    ancestor: VObject[] = [],
  ): any[] => {
    return data
      .filter((item: VObject) => filterFn(item, ancestor))
      .map((item: VObject) => ({
        ...item,
        children: shakingTree(item.children, filterFn, [...ancestor, item]),
      }));
  };

  const fetchModMenuTree = () => {
    new TofuUserPcEntriesApi({
      parents: [{ type: 'pc/mods', id: mod.value }],
      pathIndexKey: 'entries',
    })
      .sendCollectionAction('tree')
      .then(({ data }) => {
        state.menuModTreeMapping[mod.value] = (data as any).records;
        registerTofuEntry(state.menuModTreeMapping[mod.value]);
        freshCurrent();
      });
  };

  const multiTabStore = injectMultiTabStore();

  const freshCurrent = () => {
    const existsRoute = matchFromMenuPathMapping(route.fullPath);

    nextTick(() => {
      state.current =
        existsRoute ||
        matchFromMenuPathMapping(
          (multiTabStore.cacheList.find(item => item.route.path === route.path)?.route?.meta
            ?.menuKey as string | undefined) || '',
        ) ||
        ({} as TofuEntry);

      // if (existsRoute) {
      //   onSelectMenu(state.current);
      // }
    });
  };

  const matchFromMenuPathMapping = (routePath: string) => {
    if (!routePath) return undefined;

    if (state.menuPathMapping[routePath]?.length > 0) {
      return state.menuPathMapping[routePath][state.menuPathMapping[routePath].length - 1];
    } else {
      const existTofuPath = Object.keys(state.menuPathMapping).find((tofuPath: string) =>
        pathsAreMatch(tofuPath, routePath),
      );
      if (existTofuPath) {
        return {
          ...state.menuPathMapping[existTofuPath][state.menuPathMapping[existTofuPath].length - 1],
          url: routePath,
        };
      }
    }
    return undefined;
  };

  watch(
    mod,
    (val1: ComputedRef<string>, val2?: ComputedRef<string>) => {
      if (!isEqual(val1?.value, val2?.value)) {
        !isMenuMod.value && fetchModMenuTree();
      }
    },
    { immediate: true },
  );

  watch(() => route.fullPath, freshCurrent);

  watch(
    () => state.current,
    () => {
      if (state.current) {
        state.menuChain = getChain(state.current);
      }
    },
  );

  const mainMenu = computed(() => state.menuChain[0]);
  const mainMenus = computed(() => state.menuTree);

  return {
    mainMenu,
    mainMenus,
    onSelectMenu,
    fetchMenuTree,
    ...toRefs(state),
  };
};

export const useSubMenus = () => {
  const { onSelectMenu } = useAutoMenuHelper();

  const subMenus = computed(() => {
    // return isMenuMod.value
    //   ? state.menuChain[0]?.children?.map(record => ({ ...record, children: [] })) || []
    //   : state.menuModTreeMapping[mod.value];

    return state.menuChain[0]?.children?.filter(record => record.type !== 'Tofu::Node') || [];
  });

  const subMenuOpened = computed(
    () => subMenus.value && subMenus.value.length > 0 && !state.subMenuClosed,
  );

  return {
    onSelectMenu,
    subMenus,
    subMenuOpened,
  };
};

export const useDashboardMenu = () => {
  const { onSelectMenu } = useAutoMenuHelper();

  const dashboardMenus = computed(() => {
    const entries = state.menuChain.filter(tofu => tofu.type !== 'Tofu::Node');
    const lastEntry = entries[entries.length - 1];
    return lastEntry?.children || [];
  });

  return {
    onSelectMenu,
    dashboardMenus,
  };
};

export const useAutoMenuHelper = () => {
  const route = useRoute();
  const router = useRouter();
  const mod = computed(() => route.path.split('/').filter(i => i)[0]);

  const isMenuMod = computed(() => mod.value === menuRouteMod);

  const onSelectMenu = (record: TofuEntry) => {
    const deepestTofu = getDeepest(record);
    if (!deepestTofu.id) return;

    // if (isMenuMod) {
    //   state.current = deepestTofu;
    // } else {
    // }
    if (isExternalLink(deepestTofu.url)) {
      openExternalLink(deepestTofu.url);
    } else if (!deepestTofu.url) {
      state.current = deepestTofu;
      router.push(menusUrl);
    } else {
      state.current = deepestTofu;
      router.push(deepestTofu.url);
    }
  };

  // const getFirstChildEntryHasUrl = (record: TofuEntry): TofuEntry => {
  //   if (
  //     record.children?.length > 0 &&
  //     record.children[0].type !== 'Tofu::Node' &&
  //     !record.children[0].url
  //   ) {
  //     return getFirstChildEntryHasUrl(record.children[0]);
  //   } else {
  //     return record;
  //   }
  // };

  const getDeepest = (record: TofuEntry): TofuEntry => {
    if (record.children?.length > 0 && record.children[0].type !== 'Tofu::Node') {
      return getDeepest(record.children[0]);
    } else {
      return record;
    }
  };

  // 将请求到的 tofu 列表，注册进入 state 的两个 mapping 中
  const registerTofuEntry = (ary: TofuEntry[]) => {
    processTree(ary, record => {
      if (record.type !== 'Tofu::Node') {
        state.menuIdMapping[record.id] = record;
        if (record.url) {
          if (!state.menuPathMapping[record.url]) {
            state.menuPathMapping[record.url] = [];
          }
          state.menuPathMapping[record.url].push(record);
        } else {
          // url 为空，跳转到 menusUrl 页面，并加上 key，用于检索
          const url = `${menusUrl}/${record.id}`;
          record.url = url;
          if (!state.menuPathMapping[record.url]) {
            state.menuPathMapping[record.url] = [];
          }
          state.menuPathMapping[record.url].push(record);
        }
      }
    });
  };

  const processTree = (
    ary: TofuEntry[],
    processFn: (record: TofuEntry) => void = () => {
      return;
    },
  ) => {
    ary.forEach((record: TofuEntry) => {
      if (record) {
        processFn(record);
        processTree(record.children, processFn);
      }
    });
  };

  const getChain = (record: TofuEntry) => {
    return [...(record?.ancestry?.split('/') || []), record?.id]
      .filter(i => i)
      .map(id => state.menuIdMapping[+id])
      .filter(i => i);
  };

  const isExternalLink = (url?: string) => {
    return url?.trim()?.startsWith('http');
  };

  const openExternalLink = (url: string) => {
    if (url) window.open(url);
  };

  const pathsAreMatch = (tofuPath: string, routePath: string) => {
    return (
      tofuPath.replace(/:\w+\//g, '/').replace(/:\w+$/g, '') ===
      routePath.replace(/\d+/g, '').replace(/\?.+/g, '')
    );
  };

  return {
    mod,
    isMenuMod,
    route,
    onSelectMenu,
    processTree,
    registerTofuEntry,
    getChain,
    isExternalLink,
    openExternalLink,
    getDeepest,
    pathsAreMatch,
  };
};

export default useAutoMenu;
