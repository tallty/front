import { computed } from 'vue';
import { TofuEntry } from '../model';
import { useRoute } from 'vue-router';
import { VStore } from '../../../lib/vails/store/index';
import { TofuUserPcEntriesApi } from '../apis/tofu/user/pc/entries.api';
import { useStore } from 'vuex';

interface AppTreeNode {
  _record: TofuEntry;
  depth: number;
  ancestry: string;
  subs: AppTreeNode[];
}

const useAutoMenu1123 = () => {
  const route = useRoute();
  const vuex = useStore();

  const menuNodeChain = computed<AppTreeNode[]>({
    get: () => vuex.getters('menu/menuNodeChain'),
    set: val => vuex.commit('menu/menuNodeChain', val),
  });

  const menuIdToMenuNodeMapping = computed<Record<number, AppTreeNode>>({
    get: () => vuex.getters('menu/menuIdToMenuNodeMapping'),
    set: val => vuex.commit('menu/menuIdToMenuNodeMapping', val),
  });

  const menuTreeData = computed<AppTreeNode[]>({
    get: () => vuex.getters('menu/menuTreeData'),
    set: val => vuex.commit('menu/menuTreeData', val),
  });

  const activeMainMenu = computed<TofuEntry>({
    get: () => vuex.getters('menu/activeMainMenu'),
    set: val => vuex.commit('menu/activeMainMenu', val),
  });

  const activeSubMenu = computed<TofuEntry>({
    get: () => vuex.getters('menu/activeSubMenu'),
    set: val => vuex.commit('menu/activeSubMenu', val),
  });

  const store = new VStore(new TofuUserPcEntriesApi());

  const initMenus = async () => {
    await store.index();

    menuTreeData.value = processTree(
      store.records.value,
      0,
      '',
      node => (menuIdToMenuNodeMapping.value[node._record.id] = node),
    );

    matchRoute();
  };

  const selectNode = (node: AppTreeNode) => {
    menuNodeChain.value = `${node.ancestry}/${node._record.id}`
      .split('/')
      .filter(i => i)
      .map(id => menuIdToMenuNodeMapping.value[+id]);
    activeMainMenu.value = menuNodeChain.value[0]._record;
    activeSubMenu.value = menuNodeChain.value[1]?._record;
  };

  const matchRoute = () => {
    const matchedNodes = Object.values(menuIdToMenuNodeMapping.value).filter(
      (record: AppTreeNode) => record._record.url === route.path,
    );

    const matchedNode = matchedNodes[matchedNodes.length - 1];

    if (matchedNode) {
      selectNode(matchedNode);
    }
  };

  const processTree = (
    ary: TofuEntry[],
    depth = 0,
    ancestry = '',
    processFn: (record: AppTreeNode) => void = () => {
      return;
    },
  ): AppTreeNode[] => {
    return ary.map((record: TofuEntry) => {
      const node = {
        _record: record,
        depth: depth,
        ancestry: ancestry,
        subs: processTree(
          record.children,
          depth + 1,
          [ancestry, `${record.id}`].join('/'),
          processFn,
        ),
      };
      processFn(node);
      return node;
    });
  };

  const onMenuChange = (menu: TofuEntry) => {
    selectNode(menuIdToMenuNodeMapping.value[menu.id]);
  };

  return {
    initMenus,
    onMenuChange,
    menuTreeData,
    menuNodeChain,
    menuIdToMenuNodeMapping,
    activeMainMenu,
    activeSubMenu,
  };
};

export default useAutoMenu1123;
