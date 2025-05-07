<script>
import { toRefs } from '@vue/reactivity';
import { defineComponent } from '@vue/runtime-core';
import draggable from 'vuedraggable';

const NestedDraggable = defineComponent({
  name: 'NestedDraggable',
  components: {
    draggable,
  },
  props: {
    list: { type: Array, default: () => [] },
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});

export default NestedDraggable;
</script>

<template lang="pug">
.nested-draggable
  draggable.drag-area(
    class='"draggable"'
    chosenclass='red',
    :list='list',
    tag='a-row'
    group='widgets',
    item-key='key'
  )
    template(#item='{ element }')
      a-col(:span='element.options?.span || 24')
        template(v-if='element.type === "layout"')
          NestedDraggable(:list='element.fields')
        template(v-else)
          TaTemplateFormField(v-prevent :item='element')

</template>

<style scoped lang="stylus">
.nested-draggable
  border 1px dashed #808080
  height 100%
  width 100%
  .drag-area
    min-height 200px
.draggable
  border 1px dashed #808080

.flex
  display flex
</style>
