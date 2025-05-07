<script lang="ts">
import { computed, defineComponent, toRefs, watch } from 'vue';
import ComBpmInstanceDetailEasyDialogFromIndex from '../components/ComBpmInstanceDetailEasyDialogFromIndex.vue';
import { VStore } from '@/lib/vails';
import { BpmUserInstances, InstanceModel } from '../bpm-core/apis/user/instance.api';

const BpmToken = defineComponent({
  name: 'BpmToken',
  components: { ComBpmInstanceDetailEasyDialogFromIndex },
  props: {
    id: { type: Number, required: true },
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

    const getInstance = async () => {
      try {
        await innerStore.find(props.id);
      } catch (e) {
        console.error('bpm token getDetail error', e);
      }
    };
    const innerStore = new VStore(new BpmUserInstances(), InstanceModel as any);
    watch(
      () => props.id,
      () => {
        if (props.id) {
          getInstance();
        }
      },
      {
        immediate: true,
      },
    );
    return {
      ...toRefs(props),
      localVisible,
      onClose,
      onPrint,
      instance: innerStore.record,
    };
  },
});
export default BpmToken;
</script>

<template lang="pug">
.notify_bpm_token 
  ComBpmInstanceDetailEasyDialogFromIndex(
    v-if='instance?.id',
    v-model:visible='localVisible',
    :instance='instance'
  )
</template>
<style lang="stylus" scoped></style>
