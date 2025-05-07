<script lang="ts">
import { PlaceMenuTemplate, WorkflowCore } from '@/engines/bpm/bpm-core/types';
import { VObject } from '@/lib/vails/model';
import { cloneDeep } from 'lodash';
import mitt from 'mitt';
import {
  PropType,
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch,
} from 'vue';
import ComBpmFlowTreeBole from './ComBpmFlowTreeBole.vue';
import ComBpmFlowTreePoint from './ComBpmFlowTreePoint.vue';
import ComFlowTreeZoomBox from './ComFlowTreeZoomBox.vue';
import Transformer from './Transformer';
import { defaultCore, defaultMenuPlaces } from './defaultValues';
import { provideFlowTreeRootProps } from './useFlowTreeRootProps';

const ComBpmFlowTree = defineComponent({
  name: 'ComBpmFlowTree',
  components: {
    ComBpmFlowTreePoint,
    ComBpmFlowTreeBole,
    ComFlowTreeZoomBox,
  },
  props: {
    core: { type: Object as PropType<WorkflowCore>, default: () => defaultCore, required: true }, // 流程图数据
    places: { type: Array as PropType<PlaceMenuTemplate[]>, default: () => defaultMenuPlaces }, // 菜单配置
    activeNode: { type: Object, default: () => ({}) }, //  当前激活 node
    disabled: { type: Boolean, default: false }, // 是否可编辑
    showStartPoint: { type: Boolean, default: true },
    showEndPoint: { type: Boolean, default: true },
    showStartNode: { type: Boolean, default: false },
    showEndNode: { type: Boolean, default: false },
  },
  emits: ['change', 'select', 'addNode'],
  setup(props, { emit }) {
    const rootNode = ref<VObject>({});
    const transformer = ref<null | Transformer>(null);
    const emitter = mitt();
    const internalInstance = (getCurrentInstance() as any).proxy;

    const rootProps = computed(() => ({
      places: props.places,
      activeNode: props.activeNode,
      flowTreeComponent: internalInstance,
    }));

    provideFlowTreeRootProps(rootProps);

    watch(
      () => props.core,
      (newVal: any) => {
        if (newVal && transformer.value) {
          const valueStr = JSON.stringify(newVal);
          const coreStr = JSON.stringify(transformer.value.core);
          if (valueStr !== coreStr) {
            reloadTree();
          }
        }
      },
      { immediate: true, deep: true },
    );

    const addNode = (e?: { node: any; type: string; extra: any }) => {
      // const { places } = transformer.value!.core;
      const newNodeInfo = e?.extra || {
        name: '新建节点',
        type: e?.type,
        options: {},
      };
      // 加上新节点后，重新渲染树
      const context = transformer.value!.addNode(e?.node, newNodeInfo);
      rootNode.value = context.treeNode;
      emit('addNode', context.newNode, e?.type);
      emitChange();
    };

    const addRoute = (node: any) => {
      rootNode.value = transformer.value!.addRoute(node).treeNode;
      emitChange();
    };

    const removeNode = (node: any) => {
      rootNode.value = transformer.value!.removeNode(node).treeNode;
      emitChange();
    };

    const addCondition = (node: any) => {
      rootNode.value = transformer.value!.addCondition(node).treeNode;
      emitChange();
    };

    const topCondition = (node: any) => {
      rootNode.value = transformer.value!.topConditionNode(node).treeNode;
      emitChange();
    };

    onMounted(() => {
      reloadTree();
      removeEvents();

      emitter.on('addNode', addNode);
      emitter.on('addRoute', addRoute);
      emitter.on('removeNode', removeNode);
      emitter.on('addCondition', addCondition);
      emitter.on('topCondition', topCondition);
      emitter.on('clickNode', clickNode);
      emitter.on('nodeChange', nodeChange);
    });

    onUnmounted(() => {
      removeEvents();
    });

    const removeEvents = () => {
      emitter.off('addNode', addNode);
      emitter.off('addRoute', addRoute);
      emitter.off('removeNode', removeNode);
      emitter.off('addCondition', addCondition);
      emitter.off('clickNode', clickNode);
      emitter.off('nodeChange', nodeChange);
    };

    const reloadTree = () => {
      if (!props.core) {
        return;
      }
      const { places, tree } = cloneDeep(props.core);
      if (places.length > 0 && tree.length > 0) {
        // @ts-ignore
        transformer.value = new Transformer({
          nodes: places,
          associations: tree,
        });
        rootNode.value = transformer.value!.renderTree();
      }
    };

    const clickNode = (node: any) => {
      const nodeCopy = Transformer.cloneNode(node);
      emit('select', node, nodeCopy);
    };

    const nodeChange = () => {
      transformer.value!.deconstructNode();
      emitChange();
    };

    const emitChange = () => {
      emit('change', transformer.value!.core);
    };

    const getCore = () => {
      return transformer.value!.deconstructNode().core;
    };

    return {
      ...toRefs(props),
      getCore,
      rootNode,
      emitter,
    };
  },
});
export default ComBpmFlowTree;
</script>

<template lang="pug">
ComFlowTreeZoomBox
  slot(name='start')
    ComBpmFlowTreePoint(type='start', v-if='showStartPoint')
  ComBpmFlowTreeBole(
    v-model:node='rootNode',
    :key='rootNode.seq',
    :activeNode='activeNode',
    :disabled='disabled',
    :showStartNode='showStartNode',
    :showEndNode='showEndNode',
    :menuItems='places'
  )
  slot(name='end')
    ComBpmFlowTreePoint(type='end', v-if='showEndPoint')
</template>

<style lang="stylus" scoped></style>
