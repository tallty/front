<script lang="ts">
import { TaTemplateFormSelect } from '@/components/global/ta-component/ta-template-form-core/types';
import { Place, PlaceTypes } from '@/engines/bpm/bpm-core/types';
import { PropType, computed, defineComponent, toRefs } from 'vue';
import { getEndPlaceTemplateFn } from './template';

const ComBpmNodeEditorEnd = defineComponent({
  props: {
    nodeCopy: {
      type: Object as PropType<Place>,
      default: () => ({
        condition: {
          is_default: true,
          groups: [],
        },
      }),
    },
    workflow: {
      type: Object,
      default: () => ({
        meta: {
          workflow_attributes: [],
        },
      }),
    },
  },
  emits: ['update:nodeCopy'],
  setup(props, { emit }) {
    const placeSelect = computed<TaTemplateFormSelect[]>(() =>
      props.workflow.core.places
        .filter((place: Place) =>
          [PlaceTypes.Approval, PlaceTypes.Handle].includes(place.type as PlaceTypes),
        )
        .map((place: Place) => ({
          label: place.name,
          value: place.id,
        })),
    );
    // treeNode node
    const localNode = computed({
      get: () => props.nodeCopy,
      set: val => emit('update:nodeCopy', val),
    });

    const endPlaceTemplate = computed(() => getEndPlaceTemplateFn(placeSelect.value));

    return {
      ...toRefs(props),
      localNode,
      endPlaceTemplate,
    };
  },
});

export default ComBpmNodeEditorEnd;
</script>

<template lang="pug">
.com-bpm-node-editor-end
  TaTemplateForm(v-model:modelValue='nodeCopy', :template='endPlaceTemplate')
</template>

<style lang="stylus" scoped>
.com-bpm-node-editor-end
  padding 20px
</style>
