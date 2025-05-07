<script lang="ts">
import TaTemplateFormDesignerAccessibilityEditor from '@/components/global/ta-component/TaTemplateForm/designer/TaTemplateFormDesignerAccessibilityEditor.vue';
import { Workflow } from '@/engines/bpm/bpm-core/types';
import { PropType, computed, defineComponent, toRefs } from 'vue';
import { getTriggerOptionsTemplate, tokenActionsTemplate } from './template';
import { FormSetting } from '../../../bpm-core/ta-template-form-core/data_form/form_setting';

const ComBpmNodeEditorStart = defineComponent({
  name: 'ComBpmNodeEditorStart',
  components: { TaTemplateFormDesignerAccessibilityEditor },
  props: {
    nodeCopy: {
      type: Object,
      default: () => ({
        options: {},
        fields: { fields: [] },
        place_form: { fields: [] },
        callback_options: {},
      }),
    },
    workflow: { type: Object as PropType<Workflow>, default: () => ({}) },
  },
  emits: ['update:nodeCopy'],
  setup(props, { emit }) {
    const localNodeCopy = computed({
      get: () => props.nodeCopy,
      set: val => emit('update:nodeCopy', val),
    });

    const triggerOptionsTemplate = getTriggerOptionsTemplate(
      localNodeCopy.value.token_actions?.actions || [],
    );

    const dataFormOptions = computed(() => {
      return props.workflow.form_setting
        ? new FormSetting(props.workflow.form_setting).getDataFormOptions('工作流表单')
        : [];
    });

    const collectionDataFormOptions = computed(() => {
      return props.workflow.form_setting_collection
        ? new FormSetting(props.workflow.form_setting_collection).getDataFormOptions('表单')
        : [];
    });

    return {
      ...toRefs(props),
      triggerOptionsTemplate,
      tokenActionsTemplate,
      localNodeCopy,
      dataFormOptions,
      collectionDataFormOptions,
    };
  },
});
export default ComBpmNodeEditorStart;
</script>

<template lang="pug">
.com-bpm-node-editor-start
  a-tabs(defaultActiveKey='1')
    a-tab-pane(tab='表单操作权限', key='2')
      a-tabs
        a-tab-pane(v-for='opts in collectionDataFormOptions', :tab='opts.label', :key='opts.value')
          TaTemplateFormDesignerAccessibilityEditor(
            v-model:value='localNodeCopy.fields',
            :form='opts.meta?.form'
          )
    a-tab-pane(tab='高级设置', key='3')
      //- .place-form
      //-   h3.title 定义节点审批表单
      //-   TaTemplateFormDesignerDialog(v-model:value='localNodeCopy.place_form')
      //- 操作文案
      .place-form
        h3.title 定义节点审批表单 与 trigger
        TaFormSettingDesignerDialog(
          v-model:value='localNodeCopy.form_setting'
          title='节点表单',
          :dataFormOptions='dataFormOptions'
        )
      .place-form
        h3.title
          span 节点操作配置
        TaTemplateForm(:template='tokenActionsTemplate', v-model:modelValue='localNodeCopy')
      //- .place-form
      //-   h3.title
      //-     span trigger_options
      //-   TaTemplateForm(:template='triggerOptionsTemplate', v-model:modelValue='localNodeCopy')
</template>

<style lang="stylus" scoped>
.place-form
  padding 0 20px 20px
  border-bottom 1px solid #e8e8e8
  .title
    color #333
    margin-bottom 16px
    margin-top 20px
    display flex
    align-items center
</style>
