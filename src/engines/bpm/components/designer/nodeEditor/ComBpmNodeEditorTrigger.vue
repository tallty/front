<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { getCallbackTemplate, getTriggerOptionsTemplate } from './template';

const ComBpmNodeEditorTrigger = defineComponent({
  name: 'ComBpmNodeEditorTrigger',
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
      set: val => emit('update:nodeCopy', val),
    });

    const triggerTemplate = getCallbackTemplate();

    const triggerOptionsTemplate = getTriggerOptionsTemplate(
      localNodeCopy.value.token_actions.actions,
    );

    return {
      ...toRefs(props),
      localNodeCopy,
      triggerTemplate,
      triggerOptionsTemplate,
    };
  },
});
export default ComBpmNodeEditorTrigger;
</script>

<template lang="pug">
.com-bpm-node-editor-trigger
  a-tabs(defaultActiveKey='1')
    a-tab-pane(tab='设置回调', key='1')
      TaTemplateForm(
        :template='triggerTemplate',
        v-model:modelValue='localNodeCopy.options',
        :context='{ workflowId: workflow.id }'
      )
    a-tab-pane(tab='高级设置', key='3')
      //- 操作文案
      .place-form
        h3.title
          span trigger_options
        TaTemplateForm(
          :template='triggerOptionsTemplate',
          v-model:modelValue='localNodeCopy',
          :context='{ workflowId: workflow.id }'
        )
</template>

<style lang="stylus" scoped></style>
