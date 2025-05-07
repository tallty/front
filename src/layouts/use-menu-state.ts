import { computed, ComputedRef, inject, reactive, Ref, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LayoutType, MenuTheme } from '@/components/base-layouts/typing';
import { xor } from 'lodash-es';
import { VObject } from '@/lib/vails/model';
import { HomeApp } from '../types/model';

export interface MenuState {
  collapsed?: boolean;
  selectedKeys?: string[];
  openKeys?: string[];
  current?: string;
  isMobile?: Ref<boolean>;
  subMenus: HomeApp[];
  subMenuClosed: boolean;
}
type LayoutState = {
  layout: Ref<LayoutType>;
  theme: Ref<MenuTheme>;
  fixedSidebar: Ref<boolean>;
  contentWidth: Ref<string>;
  splitMenus: Ref<boolean>;
  transitionName: Ref<string>;
  multiTab: Ref<boolean>;
  multiTabFixed: Ref<boolean>;
};
interface MenuStated extends LayoutState {
  hasSideMenu: ComputedRef<boolean>;
  isTopMenu: ComputedRef<boolean>;
  sideWidth: ComputedRef<number | undefined>;
  secondSideWidth: Ref<number>;
  breadcrumb: Ref<
    {
      path: string;
      breadcrumbName: string;
    }[]
  >;
  subMenus: Ref<HomeApp[]>;
  subMenuClosed: Ref<boolean>;
  collapsed: Ref<boolean | undefined> | undefined;
  selectedKeys: Ref<string[]> | undefined;
  openKeys: Ref<string[]> | undefined;
  updateSelectKeys: (keys: string[]) => void;
}

export interface BreadcrumbItem {
  path: string;
  breadcrumbName: string;
}

const sideWidth = 208;
const collapsedWidth = 48;
const firstSideWidth = 140; // for leftmenu-layout
const secondSideWidth = 160; // for leftmenu-layout

const pattern = /^((\/)?(https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
const state = reactive<MenuState>({
  collapsed: false,
  openKeys: [],
  selectedKeys: [],
  current: undefined,
  subMenus: [],
  subMenuClosed: false,
});

let res: MenuStated | null = null;
// 用 symbol 类型是最好的，但由于热更新会导致 symbol 更新，导致获取不到正确的 provide 值
export const MenuStateSymbol = 'proGlobalMenuState';

export const injectMenuState = () => {
  return inject(MenuStateSymbol) as MenuStated;
};
export default function useMenuState(initialState?: MenuState): MenuStated {
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  const isMobile =
    initialState && initialState.isMobile ? initialState.isMobile : inject('isMobile', ref(false));
  Object.assign(state, res ? {} : initialState);
  // define layoutSettings
  const layoutState = reactive({
    layout: computed(() => (isMobile.value ? 'side' : store.getters['app/layout'])),
    theme: computed(() => {
      const navTheme = store.getters['app/navTheme'];
      return navTheme === 'realDark' ? 'dark' : navTheme;
    }),
    fixedSidebar: computed(() => store.getters['app/fixedSidebar']),
    fixedHeader: computed(() => store.getters['app/fixedHeader']),
    contentWidth: computed(() => store.getters['app/contentWidth']),
    // only work layout `mix` `side`
    splitMenus: computed(() => !isMobile.value && store.getters['app/splitMenus']),
    transitionName: computed(() => store.getters['app/transitionName']),
    multiTab: computed(() => store.getters['app/multiTab']),
    multiTabFixed: computed(() => store.getters['app/multiTabFixed']),
  } as LayoutState);
  const hasSideMenu = computed(() => {
    return layoutState.layout !== 'top';
  });
  const isTopMenu = computed(() => layoutState.layout === 'top');
  const menuWidth = computed(() => {
    if (isMobile.value) {
      return sideWidth;
    }
    const width: number = layoutState.layout === 'left' ? firstSideWidth : sideWidth;
    return hasSideMenu.value ? (state.collapsed ? collapsedWidth : width) : undefined;
  });
  // 解决动态路由 打开页面 openKeys 错误问题
  // const allowRouters = computed(() => store.getters[`user/allowRouters`]); // genMenuInfo(filterMenu(routes)).menus;
  const menuKeyMap = computed(() => ({} as VObject)); // genMenuInfo(allowRouters.value).menuKeyMap);
  const getOpenKeysBySelectKey = (key: string) => {
    return menuKeyMap.value[key]?.parentKeys;
  };
  watch(
    () => state.collapsed,
    () => {
      if (state.collapsed && !isMobile.value) {
        state.openKeys = [];
      } else {
        state.openKeys = getOpenKeysBySelectKey(route.path);
      }
    },
  );
  // 布局变化时 openKeys 为空
  watch([computed(() => layoutState.layout), computed(() => layoutState.splitMenus)], () => {
    state.openKeys = [];
  });
  const queryMap = ref<Record<string, any>>({});
  const hashMap = ref<Record<string, any>>({});

  watch(
    () => state.selectedKeys,
    (_newVal, oldVal = []) => {
      if (state.selectedKeys) {
        if (isMobile.value) {
          state.collapsed = true;
        }
        const path = state.selectedKeys[state.selectedKeys.length - 1];
        const isOtherUrl = pattern.test(path);
        const isOtherUrlForOldVal = pattern.test(oldVal[oldVal?.length - 1]);
        if (isOtherUrl) {
          const routes = router.getRoutes();
          const { target } = routes.find(r => r.path === `/${path}`)?.meta || {};
          state.selectedKeys = oldVal;
          window.open(path, target as any);
          return;
        }
        if (
          !state.collapsed &&
          layoutState.layout !== 'left' &&
          (layoutState.layout === 'side' ||
            layoutState.layout === 'mix' ||
            layoutState.splitMenus === true) &&
          !isOtherUrlForOldVal
        ) {
          const openKeys = getOpenKeysBySelectKey(path);
          if (xor(state.openKeys, openKeys).length) {
            state.openKeys = openKeys || [];
          }
        }
        router.push({
          path: path,
          query: queryMap.value[path],
          hash: hashMap.value[path],
        });
      }
    },
  );
  const updateMenuState = (path: string): void => {
    const cachedKeys = getOpenKeysBySelectKey(path) || [];
    state.selectedKeys = [...cachedKeys, path];
  };

  const breadcrumb = ref<BreadcrumbItem[]>([]);

  const updateSelectKeys = (keys: string[]) => {
    state.selectedKeys = keys;
  };
  const updateCollapsed = (val: boolean) => {
    state.collapsed = !val;
  };

  watch(
    [() => route.path, () => route.query, () => route.hash],
    (
      newValue: [string, Record<string, any>, string],
      oldValue: [string, Record<string, any>, string],
    ) => {
      queryMap.value[route.fullPath] = route.query;
      hashMap.value[route.fullPath] = route.hash;

      if (route.meta.keepTab && newValue[0] === oldValue[0]) {
        freshLast(route.fullPath);
      } else {
        updateMenuState(route.fullPath);
      }
    },
    // { immediate: true },
  );

  const freshLast = (path: string): void => {
    if (state.selectedKeys) {
      state.selectedKeys.splice(state.selectedKeys?.length - 1, 1, path);
    }
  };

  res = {
    ...toRefs(state),
    ...toRefs(layoutState),
    isMobile,
    hasSideMenu,
    isTopMenu,
    sideWidth: menuWidth,
    secondSideWidth: ref(secondSideWidth),
    breadcrumb,
    collapsedWidth,
    updateSelectKeys,
    updateCollapsed,
  } as MenuStated;
  return res;
}
