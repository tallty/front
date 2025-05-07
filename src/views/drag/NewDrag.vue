<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import TaTemplateFormDeisgner from '@/components/global/ta-component/TaTemplateForm/designer/TaTemplateFormDesigner.vue';

const formDeisgner = defineComponent({
  name: 'formDeisgner',
  components: {
    TaTemplateFormDeisgner,
  },
  setup(props) {
    const item = ref({});
    return {
      ...toRefs(props),
      item,
    };
  },
});
export default formDeisgner;
</script>

<template lang="pug">
.form-deisgner
  TaTemplateFormDeisgner(v-model:value='item')
</template>

<style lang="stylus" scoped>
.form-deisgner
  width 100%
  height 100%
</style>
