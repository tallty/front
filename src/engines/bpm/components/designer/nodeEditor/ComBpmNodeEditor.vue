<script lang="ts">
// import Apply from './Apply.vue';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { computed, defineComponent } from 'vue';
import { useInjectClipboard } from '../useClipboard';
import ComBpmNodeEditorApproval from './ComBpmNodeEditorApproval.vue';
import ComBpmNodeEditorCondition from './ComBpmNodeEditorCondition.vue';
import ComBpmNodeEditorEnd from './ComBpmNodeEditorEnd.vue';
import ComBpmNodeEditorNotify from './ComBpmNodeEditorNotify.vue';
import ComBpmNodeEditorStart from './ComBpmNodeEditorStart.vue';
import ComBpmNodeEditorTrigger from './ComBpmNodeEditorTrigger.vue';

const ComBpmNodeEditor = defineComponent({
  name: 'ComBpmNodeEditor',
  components: {
    ComBpmNodeEditorApproval,
    ComBpmNodeEditorCondition,
    ComBpmNodeEditorNotify,
    ComBpmNodeEditorStart,
    ComBpmNodeEditorTrigger,
    ComBpmNodeEditorEnd,
  },
  props: {
    visible: { type: Boolean, default: false },
    nodeCopy: {
      type: Object,
      default: () => ({
        options: {},
        fields: {},
        place_form: {
          fields: [],
        },
      }),
      required: true,
    },
    workflow: {
      type: Object,
      default: () => ({
        meta: {
          workflow_roles: [],
        },
      }),
    },
  },
  emits: ['update:visible', 'update:nodeCopy', 'close', 'change'],
  setup(props, { emit }) {
    let subComponentSubmitCallback!: () => void;

    const localVisible = computed({
      get: () => props.visible,
      set: val => emit('update:visible', val),
    });

    const localNodeCopy = computed({
      get: () => props.nodeCopy,
      set: val => emit('update:nodeCopy', val),
    });

    const formattedWorkflow = computed(() => {
      return {
        ...props.workflow,
        meta: props.workflow.meta || {},
      };
    });

    const placeType = computed(() => props.nodeCopy.type || '');

    const title = computed(() => {
      if (props.nodeCopy.kind === 'condition') {
        return `条件 ${(props.nodeCopy.condition.index || 0) + 1}`;
      }
      if (props.nodeCopy.type === 'Places::StartPlace') {
        return '发起人';
      }
      if (props.nodeCopy.type === 'Places::EndPlace') {
        return '结束节点';
      }
      return props.nodeCopy.name;
    });

    const nodeDisabled = computed(() => {
      // if (placeType.value.includes('Teacher')) {
      //   return !(props.nodeCopy.options && props.nodeCopy.options.teachers.length > 0);
      // }
      return false;
    });

    const onClose = () => {
      localVisible.value = false;
      emit('close');
    };

    const onConfirmChange = () => {
      if (subComponentSubmitCallback) {
        subComponentSubmitCallback();
      }

      emit('change', props.nodeCopy);
      onClose();
    };

    // 子组件提交事件，可以再点击外部确认按钮时，最子组件的逻辑做处理
    const onBeforeSubmit = (callback: () => void) => {
      subComponentSubmitCallback = callback;
    };

    const { clipboard } = useInjectClipboard();
    const onCopy = () => {
      if (clipboard?.value) {
        clipboard.value.node = cloneDeep({ ...localNodeCopy.value, id: undefined });
        message.success('复制成功');
      }
    };

    return {
      formattedWorkflow,
      localVisible,
      placeType,
      title,
      nodeDisabled,
      onClose,
      onConfirmChange,
      onBeforeSubmit,
      localNodeCopy,
      onCopy,
    };
  },
});

export default ComBpmNodeEditor;
</script>

<template lang="pug">
a-drawer.node-drawer(
  v-if='localVisible',
  v-model:visible='localVisible',
  placement='right',
  :closable='true',
  :width='800',
  :destroyOnClose='true',
  @close='onClose'
)
  template(#title)
    .com-bpm-node-editor-title
      h3 {{ title }}
      template(v-if='nodeCopy.kind !== "condition"')
        TaIcon.icon(type='CopyOutlined', @click='onCopy')
  .com-bpm-node-editor
    //- | {{ localNodeCopy }}
    .content
      ComBpmNodeEditorApproval(
        v-if='placeType.includes("Places::Approval") || placeType.includes("Handle")',
        v-model:nodeCopy='localNodeCopy',
        :workflow='formattedWorkflow'
      )
      ComBpmNodeEditorNotify(
        v-else-if='placeType.includes("Places::Notify")',
        v-model:nodeCopy='localNodeCopy',
        :workflow='formattedWorkflow'
      )
      ComBpmNodeEditorCondition(
        v-else-if='nodeCopy.kind === "condition"',
        v-model:nodeCopy='localNodeCopy',
        :workflow='formattedWorkflow'
      )
      ComBpmNodeEditorStart(
        v-else-if='placeType.includes("Places::StartPlace")',
        v-model:nodeCopy='localNodeCopy',
        :workflow='formattedWorkflow'
      )
      ComBpmNodeEditorEnd(
        v-else-if='placeType.includes("Places::EndPlace")',
        v-model:nodeCopy='localNodeCopy',
        :workflow='formattedWorkflow'
      )
      ComBpmNodeEditorTrigger(
        v-else-if='placeType.includes("Places::Trigger")',
        v-model:nodeCopy='localNodeCopy',
        :workflow='formattedWorkflow'
      )
    .footer
      a-button(type='primary', @click='onConfirmChange', :disabled='nodeDisabled')
        | 确 认
</template>

<style lang="stylus" scoped>
.com-bpm-node-editor-title
  display flex
  align-items center
  h3
    margin-right 20px
  .icon
    margin-right 10px
.com-bpm-node-editor
  position relative
  z-index 999
  // margin-right -20px
  // margin-left -20px
  margin-top -20px
  padding-bottom 36px
  height calc(100vh - 75px)
  .header
    position absolute
    top 78px
    left 0
    width 100%
    height 49px
    border-bottom 1px solid #e5e5e5
    color #383838
    text-align center
    font-weight 500
    font-size 14px
    line-height 49px
    .close-btn
      position absolute
      top 0
      right 0
      display inline-block
      padding 17px
      font-size 16px
      line-height 1
      cursor pointer
      &:hover
        color #000
  .content
    position relative
    z-index 1
    overflow auto
    height 100%
  .footer
    position absolute
    bottom -20px
    left 0
    display flex
    justify-content flex-end
    align-items center
    padding 0 16px
    width 100%
    height 56px
    border-top 1px solid #e5e5e5
    button
      margin-left 12px
</style>
