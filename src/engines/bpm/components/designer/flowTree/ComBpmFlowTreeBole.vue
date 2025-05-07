<script lang="ts">
import { Place, PlaceMenuTemplate } from '@/engines/bpm/bpm-core/types';
import { PropType, computed, defineComponent, toRefs } from 'vue';
import ComBpmFlowTreeAddButton from './ComBpmFlowTreeAddButton.vue';
import ComBpmFlowTreeNode from './ComBpmFlowTreeNode.vue';
import { injectFlowTreeRootProps } from './useFlowTreeRootProps';

const ComBpmFlowTreeBole = defineComponent({
  name: 'ComBpmFlowTreeBole',
  components: {
    ComBpmFlowTreeNode,
    ComBpmFlowTreeAddButton,
  },
  props: {
    node: { type: Object as PropType<Place>, required: true },
    disabled: { type: Boolean, default: false },
    activeNode: { type: Object, default: () => ({}) },
    showStartNode: { type: Boolean, default: false },
    showEndNode: { type: Boolean, default: false },
    menuItems: { type: Array as PropType<PlaceMenuTemplate[]>, default: () => [] },
  },
  setup(props) {
    const nodeClass = computed(() => {
      return {
        'no-input-node': hasType('StartPlace'),
        'hidden-node':
          (!props.showStartNode && hasType('StartPlace')) ||
          (!props.showEndNode && hasType('EndPlace')),
        'condition-node': props.node.kind === 'condition',
      };
    });

    // const { emitterRef.value } = useFlowTreeEmitter();
    const { emitterRef } = injectFlowTreeRootProps();

    const addCondition = () => {
      emitterRef.value.emit('addCondition', props.node);
    };

    const addNode = (node: any, type: string, extra: any) => {
      emitterRef.value.emit('addNode', { node: props.node, type, extra });
    };

    const addRoute = () => {
      emitterRef.value.emit('addRoute', props.node);
    };

    const removeNode = () => {
      emitterRef.value.emit('removeNode', props.node);
    };

    const onNodeClick = () => {
      emitterRef.value.emit('clickNode', props.node);
    };

    const onNodeChange = () => {
      emitterRef.value.emit('nodeChange', props.node);
    };

    const onTopCondition = () => {
      emitterRef.value.emit('topCondition', props.node);
    };

    const hasType = (type: string) => {
      return (props.node.type || '').includes(type);
    };

    return {
      ...toRefs(props),
      nodeClass,
      addCondition,
      addNode,
      addRoute,
      removeNode,
      onNodeClick,
      onNodeChange,
      hasType,
      onTopCondition,
    };
  },
});

export default ComBpmFlowTreeBole;
</script>

<template lang="pug">
.node-wrap
  //- Branches
  template(v-if='node.next_nodes && node.next_nodes.length > 0')
    .branches-box
      button.add-branch-button(v-if='disabled')
        | 条件分支
      button.add-branch-button.animation-btn(v-else, @click='addCondition')
        | 添加条件
      .branch(v-for='(subNode, index) in node.next_nodes', :key='index')
        template(v-if='index === 0')
          .cover-line.top-left-cover-line
          .cover-line.bottom-left-cover-line
        template(v-if='index === node.next_nodes.length - 1')
          .cover-line.top-right-cover-line
          .cover-line.bottom-right-cover-line
        //- Recursion
        ComBpmFlowTreeBole(
          v-if='node.next_nodes[index]',
          v-model:node='node.next_nodes[index]',
          :key='node.next_nodes[index].id',
          :disabled='disabled',
          :showStartNode='showStartNode',
          :showEndNode='showEndNode',
          :menuItems='menuItems'
        )
    .add-node-btn-box
      ComBpmFlowTreeAddButton(
        v-if='!(disabled || hasType("EndPlace"))',
        @addRoute='addRoute',
        @addNode='addNode',
        :menuItems='menuItems'
      )
  //- Node
  template(v-else)
    .node-box(:class='nodeClass')
      ComBpmFlowTreeNode(
        v-model:node='node',
        :active='activeNode.id === node.id',
        :disabled='disabled',
        @click='onNodeClick',
        @update:node='onNodeChange',
        @remove='removeNode'
        @topCondition='onTopCondition'
      )
    .add-node-btn-box(v-if='!hasType("EndPlace")')
      ComBpmFlowTreeAddButton(
        v-if='!disabled',
        @addRoute='addRoute',
        @addNode='addNode',
        :menuItems='menuItems'
      )
  //- Recurison
  ComBpmFlowTreeBole(
    v-if='node.next_node && node.next_node.seq',
    v-model:node='node.next_node',
    :key='node.next_node.id',
    :activeNode='activeNode',
    :disabled='disabled',
    :showStartNode='showStartNode',
    :showEndNode='showEndNode',
    :menuItems='menuItems'
  )
</template>

<style lang="stylus" scoped>
$bgColor = #f5f5f7
$lineColor = #cacaca
.node-wrap
  text-align center
  .node-box
    position relative
    display inline-block
    text-align left
    &:before
      position absolute
      top -12px
      left 50%
      width 0
      height 4px
      border-width 8px 6px 4px
      border-style solid
      border-color $lineColor transparent transparent
      background $bgColor
      content ''
      transform translateX(-50%)
  .no-input-node:before
    display none
  .hidden-node
    display none
  .branches-box
    position relative
    z-index 1
    display flex
    justify-content center
    overflow visible
    margin auto
    margin-top 15px
    min-height 180px
    height auto
    &:before
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      z-index 0
      margin auto
      width 4px
      height 100%
      background-color $bgColor
      content ''
    .branch
      position relative
      padding 40px 50px 0
      border-top 2px solid $lineColor
      border-bottom 2px solid $lineColor
      &:before
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        z-index 0
        margin auto
        width 2px
        height 100%
        background-color $lineColor
        content ''
      .cover-line
        position absolute
        width 50%
        height 4px
        background-color $bgColor
      .top-left-cover-line
        top -3px
        left -1px
      .top-right-cover-line
        top -3px
        right -1px
      .bottom-left-cover-line
        bottom -3px
        left -1px
      .bottom-right-cover-line
        right -1px
        bottom -3px
    .add-branch-button
      position absolute
      top -16px
      left 50%
      z-index 1
      padding 0 10px
      height 30px
      outline none
      border none
      border-radius 15px
      background #fff
      box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
      color #3296fa
      font-size 12px
      line-height 30px
      transition all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)
      transform translateX(-50%)
      transform-origin center center
      user-select none
    .animation-btn
      cursor pointer
      &:hover
        box-shadow 0 8px 16px 0 rgba(0, 0, 0, 0.1)
        transform translateX(-50%) scale(1.1)
  .add-node-btn-box
    position relative
    margin auto
    min-height 60px
    &:before
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      z-index -1
      margin auto
      width 2px
      height 100%
      background-color $lineColor
      content ''
    .add-node-btn
      padding 24px 0 34px
      text-align center
      user-select none
      .btn
        position relative
        width 30px
        height 30px
        outline none
        border none
        border-radius 50%
        background #3296fa
        box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
        color #ffffff
        line-height 30px
        cursor pointer
        transition all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)
        &:hover
          box-shadow 0 13px 27px 0 rgba(0, 0, 0, 0.1)
          transform scale(1.3)
</style>
