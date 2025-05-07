<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { FormSetting } from '../../../../../components/global/ta-component/ta-template-form-core/data_form/form_setting';
import {
  getTransitionTypeTemplate,
  getTriggerOptionsTemplate,
  notifyTemplate,
  tokenActionsTemplate,
} from './template';

const ComBpmNodeEditorNotify = defineComponent({
  name: 'ComBpmNodeEditorNotify',
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

    const triggerOptionsTemplate = getTriggerOptionsTemplate(
      localNodeCopy.value.token_actions.actions,
    );

    const dataFormOptions = computed(() => {
      return props.workflow.form_setting
        ? new FormSetting(props.workflow.form_setting).getDataFormOptions('工作流表单')
        : [];
    });

    return {
      ...toRefs(props),
      notifyTemplate,
      getTransitionTypeTemplate,
      localNodeCopy,
      tokenActionsTemplate,
      triggerOptionsTemplate,
      dataFormOptions,
    };
  },
});
export default ComBpmNodeEditorNotify;
</script>

<template lang="pug">
.com-bpm-node-editor-notify
  a-tabs(defaultActiveKey='1')
    a-tab-pane(tab='设置抄送人', key='1')
      TaTemplateForm(
        :template='getTransitionTypeTemplate("抄送")',
        v-model:modelValue='localNodeCopy',
        :context='{ workflowId: workflow.id }'
      )
      TaTemplateForm(:template='notifyTemplate', v-model:modelValue='localNodeCopy')
    a-tab-pane(tab='高级设置', key='3')
      .place-form
        h3.title 定义节点审批表单 与 trigger
        TaFormSettingDesignerDialog(
          v-model:value='localNodeCopy.form_setting'
          title='节点表单',
          :dataFormOptions='dataFormOptions'
        )
      //- 操作文案
      .place-form
        h3.title
          span 节点操作配置
        TaTemplateForm(
          :template='tokenActionsTemplate',
          v-model:modelValue='localNodeCopy',
          :context='{ workflowId: workflow.id }'
        )
      //- .place-form
      //-   h3.title
      //-     span trigger_options
      //-   TaTemplateForm(
      //-     :template='triggerOptionsTemplate',
      //-     v-model:modelValue='localNodeCopy',
      //-     :context='{ workflowId: workflow.id }'
      //-   )
</template>

<style lang="stylus" scoped></style>
