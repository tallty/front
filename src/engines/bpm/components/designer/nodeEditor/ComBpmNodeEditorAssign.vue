<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { getTransitionTypeTemplate } from './template';

const ComBpmNodeEditorAssign = defineComponent({
  name: 'ComBpmNodeEditorAssign',
  components: {},
  props: {
    nodeCopy: {
      type: Object,
      default: () => ({
        options: {},
        fileds: { fields: [] },
        place_form: { fields: [] },
        callback_options: {},
      }),
    },
    workflow: { type: Object, default: () => ({}) },
  },
  emits: ['update:nodeCopy'],
  setup(props, { emit }) {
    const localNodeCopy = computed({
      get: () => props.nodeCopy,
      set: val => {
        emit('update:nodeCopy', val);
      },
    });

    return {
      ...toRefs(props),
      // assignUserOptionsTemplate,
      // assignAssignUserOptionsTemplate,
      getTransitionTypeTemplate,
      localNodeCopy,
    };
  },
});
export default ComBpmNodeEditorAssign;
</script>

<template lang="pug">
.com-bpm-node-editor-assign
  a-tabs(defaultActiveKey='1')
    a-tab-pane(tab='设置指派人员', key='1')
      TaTemplateForm(
        :template='getTransitionTypeTemplate("指派")',
        v-model:modelValue='localNodeCopy',
        :context='{ workflowId: workflow.id }'
      )
      //- .group
      //-   TaTemplateForm(:template='assignUserOptionsTemplate', v-model:modelValue='localNodeCopy')
      //-   .line
      //- TaTemplateForm(:template='assignAssignUserOptionsTemplate', v-model:modelValue='localNodeCopy')
</template>

<style lang="stylus" scoped>
.group
  position relative
  .line
    position absolute
    bottom 20px
    width 100%
    border-bottom 1px solid #f0f0f0
</style>
