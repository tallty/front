<script lang="ts">
import { FormsResourceInfoFindByIds } from '@/components/global/ta-component/TaTemplateForm/form/apis/find_by_ids.api';
import {
  Place,
  PlaceMenuTemplate,
  PlaceTypes,
  TransitionTypes,
} from '@/engines/bpm/bpm-core/types';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { PropType, computed, defineComponent, nextTick, ref, watch } from 'vue';
import { useInjectClipboard } from '../useClipboard';
import BpmFlowTreeNodePlaceCondition from './BpmFlowTreeNodePlaceCondition.vue';
// import moment from 'moment';
import ComBpmFlowTreeNodeApprovalContext from './ComBpmFlowTreeNodeApprovalContext.vue';
// import ComBpmFlowTreeNodeTrigger from './ComBpmFlowTreeNodeTrigger.vue';
import ComBpmFlowTreeNodeButtonsShell from './ComBpmFlowTreeNodeButtonsShell.vue';

const ComBpmFlowTreeNodeBase = defineComponent({
  name: 'ComBpmFlowTreeNodeBase',
  components: {
    BpmFlowTreeNodePlaceCondition,
    ComBpmFlowTreeNodeApprovalContext,
    // ComBpmFlowTreeNodeTrigger,
    ComBpmFlowTreeNodeButtonsShell,
  },
  props: {
    node: { type: Object as PropType<Place>, required: true },
    disabled: { type: Boolean, default: false },
    places: { type: Array as PropType<PlaceMenuTemplate[]>, default: () => [] },
  },
  emits: ['update:node', 'click', 'remove', 'topCondition'],
  setup(props, { emit }) {
    const visible = ref(false);

    const localNode = computed({
      get: () => props.node,
      set: val => {
        emit('update:node', val);
      },
    });

    const safeNode = computed(() => ({
      ...props.node,
      type: props.node.type || '',
      transition_type: props.node.transition_type || '',
    }));

    const nodeClass = computed(() => {
      const type = safeNode.value.type || '';
      return {
        'approval-node': type.includes('Places::Approval'),
        'handle-node': type.includes('Handle'),
        'notify-node': type.includes('Places::Notify'),
        'route-node': safeNode.value.kind === 'condition',
        'start-node': safeNode.value.type === PlaceTypes.StartPlace,
        'end-node': safeNode.value.type === PlaceTypes.EndPlace,
        // 'wechat-node': type.startsWith('Wechat::Transitions'),
        'callback-node': type.includes('Places::Trigger'),
        'disabled-node': props.disabled,
      };
    });

    const onClick = (...args: any[]) => {
      if (!props.disabled) {
        emit('click', ...args);
      }
    };

    const input = ref<any>(null);

    const onEditName = () => {
      if (props.disabled) {
        return;
      }
      visible.value = true;
      nextTick(() => {
        input.value.select();
      });
    };

    const onCloseEditName = () => {
      visible.value = false;
      // 不知为何无法触发
      emit('update:node', props.node);
    };

    const removeNode = () => {
      emit('remove', props.node);
    };

    const onTopCondition = () => {
      emit('topCondition', props.node);
    };

    const getUserNames = async (ids: number[]) => {
      const { data } = await new FormsResourceInfoFindByIds().create({
        path: '/res/admin/users',
        ids,
        attrs: ['name'],
      });

      return data.records.map((user: { name: string }) => user.name).join('，');
    };

    const userNames = ref('');

    watch(
      () => safeNode.value.options?.user_options?.user_ids,
      async (newValue, oldValue) => {
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          if (newValue && newValue.length > 0) {
            userNames.value = await getUserNames(newValue);
          } else {
            userNames.value = '请选择审批人';
          }
        }
      },
      { immediate: true, deep: true },
    );

    const { clipboard } = useInjectClipboard();

    const copyNode = () => {
      if (clipboard) {
        clipboard.value.node = cloneDeep({ ...props.node, id: undefined });
        message.success('复制成功');
      }
    };

    const cutNode = () => {
      if (clipboard) {
        clipboard.value.node = cloneDeep(props.node);
        message.success('剪切成功');
        emit('remove', props.node);
      }
    };

    return {
      nodeClass,
      safeNode,
      onEditName,
      onCloseEditName,
      localNode,
      visible,
      removeNode,
      TransitionTypes,
      PlaceTypes,
      onClick,
      input,
      userNames,
      copyNode,
      cutNode,
      onTopCondition,
    };
  },
});

export default ComBpmFlowTreeNodeBase;
</script>

<template lang="pug">
ComBpmFlowTreeNodeButtonsShell(
  v-model:node='localNode',
  :disabled='disabled',
  @cut='cutNode',
  @copy='copyNode'
  @topCondition='onTopCondition'
)
  .com-bpm-flow-tree-node-base
    //- 结束节点
    //- .before-triggers.my-2
    //-   ComBpmFlowTreeNodeTrigger(
    //-     v-for='trigger in safeNode.trigger_options?.before_triggers',
    //-     type='before',
    //-     :trigger='trigger',
    //-   )
    .node(:class='nodeClass')
      template(v-if='safeNode.type === "Places::EndPlace"')
        .title(@click.stop='onEditName')
          a-input(
            ref='input',
            v-show='visible',
            autofocus,
            @blur='onCloseEditName',
            @keyup.enter='onCloseEditName',
            v-model:value='localNode.name'
          )
          span(v-show='!visible')
            | {{ node.name }}
        .content(@click='onClick')
          .node-item
            | 流程结束
      //- 条件节点
      template(v-else-if='node.kind === "condition"')
        .title
          div 第 {{ node.condition.index + 1 }} 个条件
          .btns(v-if='!node.condition.is_default')
            //- TaIcon.icon(type='ScissorOutlined', @click.stop='cutNode')
            //- TaIcon.icon(type='CopyOutlined', @click.stop='copyNode')
            TaIcon(type='CloseCircleOutlined', @click.stop='removeNode')
        .content(@click='onClick')
          BpmFlowTreeNodePlaceCondition(:node='safeNode')
      //- 功能回调
      //- template(v-else-if='safeNode.transition_type.includes("Callback")')
        .title(@click.stop='onEditName')
          TaIcon.icon(type='TeamOutlined')
          a-input(
            ref='input',
            v-show='visible',
            autofocus,
            @blur='onCloseEditName',
            @keyup.enter='onCloseEditName',
            v-model:value='localNode.name'
          )
          span(v-show='!visible')
            | {{ node.name }}
          .btns(v-if='!disabled')
            TaIcon.icon(type='ScissorOutlined', @click.stop='cutNode')
            TaIcon.icon(type='CopyOutlined', @click.stop='copyNode')
            TaIcon(type='CloseCircleOutlined', @click.stop='removeNode')
        .content(@click='onClick')
          //- 功能回调
          template(v-if='safeNode.transition_type === TransitionTypes.FlowableCallback')
            .node-item(v-if='node.options.name')
              span {{ node.options.name }}
            span.placeholder(v-else)
              | 请选择
          //- api回调
          template(v-if='safeNode.transition_type === TransitionTypes.ApiCallback')
            .node-item(v-if='node.options.url')
              a-tag(color='blue') {{ node.options.method }}
              span {{ node.options.url }}
            span.placeholder(v-else)
              | 请设置
          //- 服务方法回调
          template(v-if='safeNode.transition_type === TransitionTypes.FunctionCallback')
            .node-item(v-if='node.options.function')
              .node-line
                span 类名：
                a-tag(color='blue') {{ node.options.class_name }}
              .node-line
                span 方法名：
                a-tag(color='blue') {{ node.options.function }}
            span.placeholder(v-else)
              | 请设置
          template(v-if='safeNode.transition_type === TransitionTypes.Formula')
            .node-item(v-if='node.options.formula_view')
              .node-line
                a-tag(color='blue') {{ node.options.formula_view }}
            span.placeholder(v-else)
              | 请设置

      //- 审批节点 & 抄送节点
      template(v-else)
        .title(@click.stop='onEditName')
          TaIcon.icon(type='TeamOutlined')
          a-input(
            ref='input',
            v-show='visible',
            autofocus,
            @blur='onCloseEditName',
            @keyup.enter='onCloseEditName',
            v-model:value='localNode.name'
          )
          span(v-show='!visible')
            | {{ node.name }}
          .btns(
            v-if='!(disabled || safeNode.type === PlaceTypes.StartPlace || safeNode.type === PlaceTypes.EndPlace)'
          )
            //- TaIcon.icon(type='ScissorOutlined', @click.stop='cutNode')
            //- TaIcon.icon(type='CopyOutlined', @click.stop='copyNode')
            TaIcon(type='CloseCircleOutlined', @click.stop='removeNode')
        .content(@click='onClick', v-if='safeNode.options?.user_options?.type')
          .node-item
            ComBpmFlowTreeNodeApprovalContext(:node='safeNode')
        .content(@click='onClick', v-else)
    //- .after-triggers.my-3
    //-   ComBpmFlowTreeNodeTrigger(
    //-     v-for='trigger in safeNode.trigger_options?.after_triggers',
    //-     type='after',
    //-     :trigger='trigger'
    //-   )
</template>

<style lang="stylus" scoped>
.com-bpm-flow-tree-node-base
  .node
    position relative
    margin 0 auto
    min-height 80px
    min-width 260px
    border-radius 4px
    background-color #ffffff
    color #383838
    cursor pointer
    // &:after
    // position absolute
    // top 0
    // right 0
    // bottom 0
    // left 0
    // z-index 2
    // border 1px solid transparent
    // border-radius 4px
    // box-shadow 0 2px 5px 0 rgba(0, 0, 0, 0.1)
    // content ''
    // transition all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)
    // pointer-events none
    &:hover, &:focus, &:active
      // &:after
      // box-shadow 0 4px 15px 0 rgba(0, 0, 0, 0.2)
      .btns
        opacity 0.6 !important
    .title
      position relative
      display flex
      align-items center
      padding 4px 32px 4px 14px
      width 100%
      height 32px
      border-radius 4px 4px 0 0
      background-color inherit
      color inherit
      text-align left
      font-size 15px
      line-height 24px
      &:hover
        span
          text-decoration underline
      img.icon
        margin-right 6px
        width 18px
        height 18px
      span
        display block
        // flex-grow 1
        overflow hidden
        padding 0 6px
        text-overflow ellipsis
        white-space nowrap
      input
        flex-grow 1
        padding 0 6px
        height 24px
        outline none
        border none
        border-radius 3px
        filter brightness(80%)
        background-color inherit
        color inherit
        line-height 24px
      .btns
        position absolute
        top 8px
        right 10px
        z-index 100
        border-radius 50%
        color #fff
        text-align center
        font-size 16px
        line-height 16px
        opacity 0
        cursor pointer
        display flex
    .content
      position relative
      padding 14px
      background-color #fff
      color #383838
      font-size 14px
      min-height 50px
      .node-item
        overflow hidden
        text-overflow ellipsis
        .node-line
          margin-bottom 6px
          &:last-child
            margin-bottom 0
        .placeholder
          position relative
          padding-right 20px
          color #A6A6A6
          &:after
            position absolute
            top 50%
            right 6px
            width 8px
            height 8px
            border-top 1px solid #A6A6A6
            border-right 1px solid #A6A6A6
            content ''
            transform translateY(-50%) rotateZ(45deg)
        .rule
          display -webkit-box
          overflow hidden
          margin-bottom 5px
          color #333
          font-size 12px
          -webkit-box-orient vertical
          -webkit-line-clamp 2
          span
            padding 0 4px
          .options
            margin-bottom 0
            padding-left 24px
  .approval-node
    .title
      background #F29851
      color #fff
  .handle-node
    .title
      background rgba(146, 64, 14, 1)
      color #fff
  .notify-node
    .title
      background #1890ff
      color #fff
  .route-node
    .title
      background #f5f5f5
      color #15bc83
      .btns
        color #aaa
  .start-node, .self-node
    .title
      background #15bc83
      color #fff
  .assign-node
    .title
      background #0066CC
      color #fff
  .end-node
    .title
      background #E03D29
      color #fff
  .wechat-node
    .title
      background #75C940
      color #fff
  .callback-node
    .title
      background #36455A
      color #fff
  .disabled-node
    cursor unset
    &:hover
      &:after
        border 1px solid transparent
        box-shadow 0 2px 5px 0 rgba(0, 0, 0, 0.1)
    .title:hover
      span
        text-decoration none
</style>
