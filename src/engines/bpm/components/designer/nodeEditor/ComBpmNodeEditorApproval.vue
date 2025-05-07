<script lang="ts">
import TaTemplateFormDesignerAccessibilityEditor from '@/components/global/ta-component/TaTemplateForm/designer/TaTemplateFormDesignerAccessibilityEditor.vue';
import { Workflow } from '@/engines/bpm/bpm-core/types';
import { PropType, computed, defineComponent, toRefs, ref } from 'vue';
import { preinstalledTokenSourceConfig } from './preinstalledTokenSourceConfig';
import {
  BpmPlaceTokenSourceOptionsTemplate,
  activateOptionsTemplate,
  approvalTemplate,
  getTransitionTypeTemplate,
  getTriggerOptionsTemplate,
  tokenActionsTemplate,
} from './template';
import { merge } from 'lodash';
import { FormSetting } from '../../../../../components/global/ta-component/ta-template-form-core/data_form/form_setting';

const ComBpmNodeEditorApproval = defineComponent({
  name: 'ComBpmNodeEditorApproval',
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
      localNodeCopy.value.token_actions.actions,
    );

    const visiblePreinstalledTokenSource = ref(false);
    const preinstalledTokenSourceConfigOptions = Object.keys(preinstalledTokenSourceConfig).map(
      key => ({
        label: preinstalledTokenSourceConfig[key].name,
        value: key,
      }),
    );

    const onSelectPreinstalledTokenSource = () => {
      const defaultValue =
        preinstalledTokenSourceConfig[activePreinstalledTokenSource.value]?.defaultValue;
      if (defaultValue) {
        merge(localNodeCopy.value.token_source_options, defaultValue);
      }
      visiblePreinstalledTokenSource.value = false;
    };

    const activePreinstalledTokenSource = ref('');

    const visiblePreinstalledTokenSourceConfiguration = ref(false);

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
      approvalTemplate,
      getTransitionTypeTemplate,
      triggerOptionsTemplate,
      localNodeCopy,
      tokenActionsTemplate,
      activateOptionsTemplate,
      BpmPlaceTokenSourceOptionsTemplate,
      visiblePreinstalledTokenSource,
      preinstalledTokenSourceConfigOptions,
      onSelectPreinstalledTokenSource,
      activePreinstalledTokenSource,
      visiblePreinstalledTokenSourceConfiguration,
      dataFormOptions,
      collectionDataFormOptions,
    };
  },
});
export default ComBpmNodeEditorApproval;
</script>

<template lang="pug">
.com-bpm-node-editor-approval
  a-tabs(defaultActiveKey='1')
    a-tab-pane(tab='设置审批人', key='1')
      TaTemplateForm(
        :template='getTransitionTypeTemplate("审批")',
        v-model:modelValue='localNodeCopy',
        :context='{ workflowId: workflow.id }'
      )
      TaTemplateForm(
        :template='approvalTemplate',
        v-model:modelValue='localNodeCopy',
        :context='{ workflowId: workflow.id }'
      )

    //- a-tab-pane(tab='激活设置', key='4')
    //-   TaTemplateForm(
    //-     :template='activateOptionsTemplate',
    //-     v-model:modelValue='localNodeCopy',
    //-     :context='{ workflowId: workflow.id }'
    //-   )

    //- a-tab-pane(tab='节点创建对象设置', key='5')
    //-   .preinstalled-token-source-config.flex.items-center.justify-between.mb-2
    //-     .title.text-gray-900.font-medium 导入预设值
    //-     a-button(type='primary', @click='() => visiblePreinstalledTokenSource = true')
    //-       | 导入

    //-   .preinstalled-token-source-configuration-component.flex.items-center.justify-between.mb-2(
    //-     v-if='localNodeCopy.token_source_options?.options?.configuration_component',
    //-   )
    //-     .title.text-gray-900.font-medium 自定义配置
    //-     a-button(type='primary', @click='() => visiblePreinstalledTokenSourceConfiguration = true')
    //-       | 配置

    //-   TaTemplateForm(
    //-     :template='BpmPlaceTokenSourceOptionsTemplate',
    //-     v-model:modelValue='localNodeCopy',
    //-     :context='{ workflowId: workflow.id }'
    //-   )

    a-tab-pane(tab='表单操作权限', key='2')
      a-tabs
        a-tab-pane(v-for='opts in collectionDataFormOptions', :tab='opts.label', :key='opts.value')
          TaTemplateFormDesignerAccessibilityEditor(
            v-model:value='localNodeCopy.fields',
            :form='opts.meta?.form'
          )
        //- a-tab-pane(tab='工作流表单', key='workflow')
        //-   TaTemplateFormDesignerAccessibilityEditor(
        //-     v-model:value='localNodeCopy.fields',
        //-     :form='workflow.form'
        //-   )
        //- a-tab-pane(
        //-   tab='关联表单',
        //-   key='model_setting',
        //-   v-if='workflow?.model_setting?.ref_model_setting_form'
        //- )
        //-   TaTemplateFormDesignerAccessibilityEditor(
        //-     v-model:value='localNodeCopy.fields',
        //-     :form='workflow.model_setting.ref_model_setting_form'
        //-   )

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
      .place-form
        //- h3.title
        //-   span trigger_options
        //- TaTemplateForm(
        //-   :template='triggerOptionsTemplate',
        //-   v-model:modelValue='localNodeCopy',
        //-   :context='{ workflowId: workflow.id }'
        //- )
  //- a-modal(
  //-   v-model:visible='visiblePreinstalledTokenSource',
  //-   title='导入预设值',
  //-   @ok='onSelectPreinstalledTokenSource'
  //- )
  //-   a-select.w-full(
  //-     v-model:value='activePreinstalledTokenSource',
  //-     :options='preinstalledTokenSourceConfigOptions'
  //-   )

  //- TaNoPaddingModal(
  //-   v-if='localNodeCopy.token_source_options?.options?.configuration_component'
  //-   v-model:visible='visiblePreinstalledTokenSourceConfiguration'
  //-   :footer='false',
  //-   :closable='false',
  //-   width='70vw',
  //-   title='自定义配置'
  //- )
  //-   component(
  //-     :is='localNodeCopy.token_source_options.options.configuration_component',
  //-     v-model:value='localNodeCopy',
  //-   )
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
