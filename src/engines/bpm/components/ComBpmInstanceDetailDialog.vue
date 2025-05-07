<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import ComBpmInstanceDetail from './ComBpmInstanceDetail.vue';

const ComBpmInstanceDetailDialog = defineComponent({
  name: 'ComBpmInstanceDetailDialog',
  components: { ComBpmInstanceDetail },
  props: {
    instanceId: { type: Number, required: true },
    visible: { type: Boolean, default: false },
  },
  emits: ['update:visible', 'close', 'print'],
  setup(props, { emit }) {
    const localVisible = computed({
      get: () => props.visible,
      set: val => emit('update:visible', val),
    });

    const onClose = () => {
      emit('close');
      localVisible.value = false;
    };

    const onPrint = () => {
      emit('print');
      localVisible.value = false;
    };

    return {
      ...toRefs(props),
      localVisible,
      onClose,
      onPrint,
    };
  },
});
export default ComBpmInstanceDetailDialog;
</script>

<template lang="pug">
TaNoPaddingModal(
  v-model:visible='localVisible',
  :footer='null',
  :closable='false',
  :bodyStyle='{ overflow: "auto", height: "90vh" }',
  :modalContentStyle='{ "border-radius": "12px" }',
  :headerStyle='{ display: "none" }',
  width='90vw',
  @cancel='onClose'
)
  ComBpmInstanceDetail(
    v-if='localVisible',
    :instanceId='instanceId',
    @close='onClose',
    @print='onPrint'
  )
</template>
<style lang="stylus" scoped></style>
