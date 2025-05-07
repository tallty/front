<script lang="ts">
import { cloneDeep } from 'lodash';
import { computed, defineComponent, toRefs, onMounted, ref, onUnmounted } from 'vue';
import elementDetectorGenerator from 'element-resize-detector';

const ComBpmInstanceCollapse = defineComponent({
  name: 'ComBpmInstanceCollapse',
  components: {},
  props: {
    header: { type: String, default: '' },
    index: { type: Number, default: 1 },
    collapsed: { type: Boolean, default: false },
    defaultCollapsed: { type: Boolean, default: true },
    closeClone: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const localCollapsed = computed({
      get: () => props.collapsed,
      set: val => emit('update:collapsed', val),
    });

    localCollapsed.value = cloneDeep(props.defaultCollapsed);

    const hContainer = ref<any>(null);
    const height = ref('100%');
    const setHeight = () => {
      height.value = `${hContainer.value.clientHeight}px`;
    };

    // let observer: any = null;
    // onMounted(() => {
    //   observer = new ResizeObserver(setHeight);
    //   observer.observe(hContainer.value, { attributes: true });
    // });

    // onUnmounted(() => {
    //   observer.unobserve(hContainer.value);
    // });

    onMounted(() => {
      if (hContainer.value) {
        const elementDetector = elementDetectorGenerator({});
        elementDetector.listenTo(hContainer.value, setHeight);
      }
    });

    return {
      ...toRefs(props),
      localCollapsed,
      hContainer,
      height,
    };
  },
});
export default ComBpmInstanceCollapse;
</script>

<template lang="pug">
.com-bpm-instance-collapse.rounded-xl.border.overflow-hidden.relative(class='!border-gray-200 !border !border-solid',
)
  .py-2.px-6.flex.items-center.justify-between.font-medium.text-sm.text-gray-900.bg-gray-50.cursor-pointer(
    @click='() => (localCollapsed = !localCollapsed)'
  )
    .flex.items-center
      TaIcon.transition-all.text-gray-900.transform.mr-5(
        type='solid/chevron-down',
        :class='{ "-rotate-90": localCollapsed }'
      )
      .flex.items-center
        //- .rounded-full.border.h-6.w-6.bg-white.mr-4.flex.items-center.justify-center(v-if='index', class='!border-gray-100 !border !border-solid') {{ index }}
        div {{ header }}
    .header-right
      slot(name='header-right')

  template(v-if='!closeClone')
    //- 该部分占位，撑开高度
    .content-container.invisible-container.bg-white.px-6.py-4.overflow-hidden.min-h-10.border-t.border-gray-200.opacity-0(
      v-if='!localCollapsed',
      :class='{ "collapsed-hidden": localCollapsed }'
    )
      slot

    //- 该部分显示，提高 mt-8，以供在 header 栏定位显示所需内容
    .absolute.top-0.flex.flex-col.overflow-hidden.min-h-10.border-t.border-gray-200.w-full.h-100Z(
      :class='{ "collapsed-hidden": localCollapsed }'
    )
      .h-9.flex-shrink-0.cursor-pointer.w-full.border-gray-200.border-b(
        @click='() => (localCollapsed = !localCollapsed)'
      )
      .bg-white.flex-shrink-0.w-full.px-6.py-4(
        ref='hContainer',
      )
        slot(v-if='!localCollapsed')
  template(v-else)
    .content-container.bg-white.px-6.py-4.overflow-hidden.border-t.border-gray-200(
      v-if='!localCollapsed || !defaultCollapsed',
      :class='{ "collapsed-hidden": localCollapsed }'
    )
      slot
</template>

<style lang="stylus" scoped>
.content-container
  height v-bind(height)

.h-fit
  height fit-content

.collapsed-hidden
  @apply h-0 p-0 opacity-0
</style>
