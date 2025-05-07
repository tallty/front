<script lang="ts">
import { PropType, computed, defineComponent, ref, toRefs } from 'vue';

export interface ComBpmActionButtonsAction {
  label: string;
  icon: string;
  color?: string;
  callback: () => void;
}

const ComBpmActionButtons = defineComponent({
  name: 'ComBpmActionButtons',
  components: {},
  props: {
    actions: {
      type: Array as PropType<ComBpmActionButtonsAction[]>,
      deafult: () => [],
      required: true,
    },
  },
  setup(props) {
    const visibleMore = ref(false);

    const iconActions = computed(() =>
      props.actions
        .slice(2, props.actions.length)
        .filter((i: ComBpmActionButtonsAction) => i?.label),
    );

    const clickMore = () => {
      visibleMore.value = !visibleMore.value;
    };

    const mainClick = () => {
      props.actions[0]?.callback();
    };

    const viceClick = () => {
      props.actions[1]?.callback();
    };

    return {
      ...toRefs(props),
      iconActions,
      visibleMore,
      clickMore,
      mainClick,
      viceClick,
    };
  },
});
export default ComBpmActionButtons;
</script>

<template lang="pug">
.com-bpm-action-buttons
  .more-actions.absolute.transition-all(:class='{ "more-actions-enable": visibleMore }')
    TaIconLabel.item(
      v-for='action in iconActions.slice(8, iconActions.length)',
      :label='action.label',
      :icon='action.icon',
      :color='action.color',
      @click='action.callback'
    )
  .actions.flex
    .flex.overflow-hidden(:class='{ "w-0": iconActions.length <= 0 }')
      TaIconLabel.flex-shrink-0.item(
        v-for='action in iconActions.slice(0, 8)',
        :label='action.label',
        :icon='action.icon',
        :color='action.color',
        :desc='action.desc',
        @click='action.callback'
      )

      TaIconLabel.flex-shrink-0.item(
        v-if='iconActions.length > 8',
        label='更多',
        icon='UnorderedListOutlined',
        @click='clickMore'
      )

    TaCapsuleButton(
      :desc='actions[0]?.desc',
      :text='actions[0]?.label',
      @click='mainClick',
      :viceDesc='actions[1]?.desc',
      :viceText='actions[1]?.label',
      @viceClick='viceClick'
    )
</template>

<style lang="stylus">
.com-bpm-action-buttons
  position relative
  width 100%
  background white
  .actions, .more-actions
    padding 15px 15px 15px 24px
    width 100%
    .item
      margin-right 40px
      cursor pointer
  .actions
    justify-content space-between
  .more-actions
    padding 0
    height 0
    top 0
    overflow hidden
  .more-actions-enable
    height 100%
    top -70px
    padding 15px 15px 15px 24px
</style>
