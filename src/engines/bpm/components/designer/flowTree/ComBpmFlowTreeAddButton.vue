<script lang="ts">
import { Place, PlaceMenuTemplate } from '@/engines/bpm/bpm-core/types';
import { VObject } from '@/lib/vails/model';
import { PropType, defineComponent, ref, toRefs } from 'vue';
import { useInjectClipboard } from '../useClipboard';
import { useInjectWorkflow } from '../useWorkflow';

const ComBpmFlowTreeAddButton = defineComponent({
  name: 'ComBpmFlowTreeAddButton',
  props: {
    node: { type: Object as PropType<Place>, default: () => ({}) },
    menuItems: { type: Array as PropType<PlaceMenuTemplate[]>, default: () => [] },
  },
  emits: ['addNode', 'addRoute'],
  setup(props, { emit }) {
    const visible = ref(false);

    const { workflowRef } = useInjectWorkflow();

    const handleAction = (menu: PlaceMenuTemplate & Place) => {
      if (menu.isRoute) {
        addRoute();
      } else {
        addNode(menu);
      }
    };

    const { clipboard } = useInjectClipboard();

    const addNode = (action: PlaceMenuTemplate & Place) => {
      const extra = {
        id: action.id,
        name: action.name,
        type: action.type,
        options: action.options || {},
        token_actions: workflowRef?.value?.token_actions || [],
        place_form: action.place_form,
        trigger_options: action.trigger_options,
        transition_type: action.transition_type,
        ...action.payload,
      } as VObject;
      if (action.transition_type) {
        extra.transition_type = action.transition_type;
      }
      emit('addNode', props.node, action.type, extra);
      if (action.id && clipboard) clipboard.value.node = undefined;
      visible.value = false;
    };

    const addRoute = () => {
      emit('addRoute', props.node);
      visible.value = false;
    };

    return {
      ...toRefs(props),
      handleAction,
      addNode,
      addRoute,
    };
  },
});
export default ComBpmFlowTreeAddButton;
</script>

<template lang="pug">
.add-node-btn
  a-popover(trigger='click', placement='rightTop', v-model='visible')
    a-button.btn +
    template(#content)
      .menu-box
        .triangle
          .triggle-icon
        .column(v-for='(item, index) in menuItems')
          .action(@click='handleAction(item)')
            img(:src='item.icon', v-if='item.icon')
            .info
              .name {{ item.name }}
              .desc {{ item.desc }}
</template>

<style lang="stylus" scoped>
.add-node-btn
  position relative
  padding 28px 0 28px
  text-align center
  user-select none
  .btn
    position relative
    padding 0
    width 30px
    height 30px
    outline none
    border none
    border-radius 50%
    background #3296fa
    box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
    color #ffffff
    cursor pointer
    transition all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)
    &:hover
      box-shadow 0 13px 27px 0 rgba(0, 0, 0, 0.1)
      transform scale(1.1)
.menu-box
  position relative
  display flex
  flex-wrap wrap
  margin -12px -16px
  padding 14px
  min-height 160px
  width 360px
  border-radius 3px
  background rgba(255, 255, 255, 1)
  box-shadow 0px 7px 21px 0px rgba(0, 0, 0, 0.1)
  .triangle
    position absolute
    top 8px
    left -7px
    overflow hidden
    width 7px
    height 14px
    .triggle-icon
      width 9.8px
      height 9.8px
      background #fff
      box-shadow 0px 7px 21px 0px rgba(0, 0, 0, 0.1)
      transform rotateZ(45deg) translate(4px, -1px)
  .column
    flex 0 0 50%
    .action
      display flex
      align-items center
      margin 6px
      padding 10px 12px
      border 1px solid rgba(229, 229, 229, 1)
      border-radius 3px
      background rgba(255, 255, 255, 1)
      cursor pointer
      &:hover
        border-color #3da8f5
      img
        margin-right 12px
        width 22px
        height 22px
      .name
        margin-bottom 2px
        color rgba(56, 56, 56, 1)
        font-weight 500
        font-size 13px
        line-height 16px
      .desc
        color rgba(166, 166, 166, 1)
        font-size 12px
        line-height 16px
</style>
