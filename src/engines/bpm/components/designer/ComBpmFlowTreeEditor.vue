<script lang="ts">
import { cloneDeep, merge } from 'lodash';
import { PropType, computed, defineComponent, ref, toRefs } from 'vue';
import { VObject } from '../../../../lib/vails/model/index';
import { Place, PlaceMenuTemplate, Workflow, WorkflowCore } from '../../bpm-core/types';
import ComBpmFlowTree from './flowTree/ComBpmFlowTree.vue';
import { defaultMenuPlaces, defaultWorkflow } from './flowTree/defaultValues';
import ComBpmNodeEditor from './nodeEditor/ComBpmNodeEditor.vue';
import { useProvideClipboard } from './useClipboard';
import { useProvideWorkflow } from './useWorkflow';
import {
  getWorkflowSelfDataFormOptions,
  getWorkflowAllDataFormOptions,
} from '../../bpm-core/apis/user/workflowl.api';

const ComBpmFlowTreeEditor = defineComponent({
  components: {
    ComBpmFlowTree,
    ComBpmNodeEditor,
  },
  props: {
    workflow: { type: Object as PropType<Workflow>, default: () => defaultWorkflow },
    menuPlaces: { type: Array as PropType<PlaceMenuTemplate[]>, default: () => [] },
    disabled: { type: Boolean, default: false },
    showStartPoint: { type: Boolean, default: false },
    showEndPoint: { type: Boolean, default: true },
    showStartNode: { type: Boolean, default: true },
    showEndNode: { type: Boolean, default: true },
  },
  emits: ['update:workflow'],
  setup(props, { emit }) {
    const localWorkflow = computed({
      get: () =>
        merge(props.workflow, {
          selfDataFormOptions: getWorkflowSelfDataFormOptions(props.workflow),
          allDataFormOptions: getWorkflowAllDataFormOptions(props.workflow),
        }),
      set: val =>
        emit(
          'update:workflow',
          merge(val, {
            selfDataFormOptions: undefined,
            allDataFormOptions: undefined,
          }),
        ),
    });

    useProvideWorkflow(localWorkflow);
    const { clipboard } = useProvideClipboard();

    const localMenuPlaces = computed(() =>
      clipboard?.value?.node
        ? [...defaultMenuPlaces, { ...clipboard.value.node, desc: '来自剪切板' }]
        : defaultMenuPlaces,
    );

    const activeNodeRef = ref<Partial<Place>>({}); // 真实操作节点的引用, 修改将直接反应到节点树上
    const activeNodeCopy = ref<Partial<Place>>({
      fields: { fields: [] },
      options: {},
      place_form: {
        fields: [],
      },
    } as Partial<Place>); // 用于节点编辑的副本
    const nodeEditorVisible = ref(false);

    const flowTree = ref<any>(null);

    const selectNode = (node: Partial<Place>, nodeCopy: Partial<Place>) => {
      // @ts-ignore
      activeNodeRef.value = node;
      activeNodeCopy.value = nodeCopy;
      nodeEditorVisible.value = true;
    };

    const onFlowTreeChanged = (core: WorkflowCore) => {
      localWorkflow.value.core = core;
    };

    const nodeChanged = (node: VObject) => {
      // 先更新节点原始引用对象
      Object.assign(activeNodeRef.value, cloneDeep(node));
      // 更新流程 core
      const core = flowTree.value.getCore();
      onFlowTreeChanged(core);
    };

    const onClose = () => {
      activeNodeRef.value = {};
    };

    return {
      ...toRefs(props),
      flowTree,
      onClose,
      nodeEditorVisible,
      activeNodeRef,
      onFlowTreeChanged,
      selectNode,
      nodeChanged,
      activeNodeCopy,
      localMenuPlaces,
      localWorkflow,
    };
  },
});

export default ComBpmFlowTreeEditor;
</script>

<template lang="pug">
.flow-tree-editor
  ComBpmFlowTree(
    ref='flowTree',
    :core='localWorkflow?.core',
    :activeNode='activeNodeRef',
    :places='localMenuPlaces',
    :disabled='disabled',
    :showStartPoint='showStartPoint',
    :showStartNode='showStartNode',
    :showEndPoint='showEndPoint',
    :showEndNode='showEndNode',
    @change='onFlowTreeChanged',
    @select='selectNode'
  )

  ComBpmNodeEditor(
    v-model:visible='nodeEditorVisible',
    v-model:nodeCopy='activeNodeCopy',
    :workflow='localWorkflow',
    @change='nodeChanged',
    @close='onClose'
  )
</template>

<style lang="stylus" scoped>
.flow-tree-editor
  position relative
  width 100%
  height 100%
</style>
