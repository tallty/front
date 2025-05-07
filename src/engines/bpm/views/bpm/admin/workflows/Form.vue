<script lang="ts">
import { defineComponent, toRefs, ref, computed } from 'vue';
import { VStore } from '@/lib/vails';
import ComBpmFlowTreeEditor from '@/engines/bpm/components/designer/ComBpmFlowTreeEditor.vue';
import { useRoute } from 'vue-router';
import { BpmAdminWorkflows } from '@/engines/bpm/bpm-core/apis/admin/workflow.api';
import { message } from 'ant-design-vue';
import { getWorkflowTemplate } from './template';
import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';
import useNavigateTab from '@/components/global/ta-component/useNavigateTab';
import { VObject } from '@/lib/vails/model';
import useSystemClipboard from '@/components/global/ta-component/TaTemplateForm/designer/useImportExportDesignerConfig';
import { FormSetting } from '../../../../../../components/global/ta-component/ta-template-form-core/data_form/form_setting';
import { getBpmWorklfowFormSteps } from '../../../../components/template';

let seq = 0;

const BpmAdminWorkflowsForm = defineComponent({
  name: 'BpmAdminWorkflowsForm',
  components: {
    ComBpmFlowTreeEditor,
  },
  props: {},
  setup(props) {
    const copyId = `BpmAdminWorkflowsForm-copy-button-${seq++}`;

    const store = new VStore(new BpmAdminWorkflows());
    const route = useRoute();
    const editRecord = ref<any>(null);
    const workflowTemplate = ref<null | TaTemplateFormItem>(null);

    const { updateTitle } = useNavigateTab();

    if (route.params.id) {
      store
        .find(Number(route.params.id))
        .then(() => {
          editRecord.value = store.record.value;
          workflowTemplate.value = getWorkflowTemplate(store.record.value.token_actions.actions);
        })
        .then(() => {
          updateTitle(store.record.value.name, route.fullPath);
        });
    } else {
      editRecord.value = store.new({ form: {}, form_setting: FormSetting.initFormSettingValue });
      // @ts-ignore
      workflowTemplate.value = getWorkflowTemplate();
    }

    const onSaveToDraft = () => {
      const isCreate = !editRecord.value.id;
      editRecord.value
        .save()
        .then(() => {
          if (isCreate) onCreateSuccess();
          message.success('保存草稿箱成功');
        })
        .catch(() => {
          message.error('保存草稿箱失败');
        });
    };

    const steps = computed(() =>
      getBpmWorklfowFormSteps(workflowTemplate.value!, editRecord.value),
    );

    const taTabTabs = computed(() =>
      steps.value.map((step: VObject, index: number) => ({
        label: step.title,
        key: index,
      })),
    );

    // const stepValues = computed({
    //   get: () => [
    //     editRecord.value.formData,
    //     editRecord.value.formData.form,
    //     editRecord.value.formData,
    //   ],
    //   set: val => {
    //     Object.assign(editRecord.value.formData, val[0]); // val[0] 与 val[2] 指向同一个对象
    //     editRecord.value.formData.form = val[1];
    //   },
    // });

    const onComplete = (isCreate: boolean) => {
      message.success('提交成功');
      if (isCreate) onCreateSuccess();
    };
    const onFail = () => message.error('提交失败');

    const onSave = () => {
      if (!['done', 'archived'].includes(editRecord.value.formData.state)) {
        editRecord.value.formData.state = 'done';
      }
      editRecord.value
        .save()
        .then(() => onComplete(isCreate.value))
        .catch(onFail);
    };

    const onTemporarySave = () => {
      editRecord.value.formData.state = 'todo';
      editRecord.value
        .save()
        .then(() => onComplete(isCreate.value))
        .catch(onFail);
    };

    const stepForm = ref<any>(null);

    const onPreview = () => {
      stepForm.value.activeComponentRefs[1].onPreview();
    };

    const { closeCurrentTabAndNavigateTo } = useNavigateTab();

    const onCancel = () => closeCurrentTabAndNavigateTo('/bpm/admin/workflows');

    const onCreateSuccess = () => {
      closeCurrentTabAndNavigateTo(`/bpm/admin/workflows/${editRecord.value.id}/edit`);
    };

    const { copyToClipboard, pasteFormClipboardAsync } = useSystemClipboard();

    const pasteStringValidator = (str: string) => {
      let result = true;
      try {
        const json = JSON.parse(str);
        if (!(json.core && json.form)) {
          result = false;
        }
      } catch {
        result = false;
      }
      return result;
    };

    const onPaste = () => {
      pasteFormClipboardAsync(pasteStringValidator).then((str: string) => {
        const json = JSON.parse(str);
        editRecord.value.formData.core = json.core;
        editRecord.value.formData.form = json.form;
        onSave();
      });
    };

    copyToClipboard(`#${copyId}`, () =>
      JSON.stringify({
        core: editRecord.value.core,
        form: editRecord.value.form,
        form_setting: editRecord.value.form_setting,
      }),
    );

    const isCreate = computed(() => !editRecord.value.id);

    return {
      ...toRefs(props),
      editRecord,
      onSaveToDraft,
      workflowTemplate,
      steps,
      onComplete,
      onFail,
      onCancel,
      onSave,
      taTabTabs,
      stepForm,
      onPreview,
      onTemporarySave,
      onPaste,
      copyId,
      isCreate,
    };
  },
});
export default BpmAdminWorkflowsForm;
</script>

<template lang="pug">
.bpm-admin-workflows-form(v-if='editRecord && workflowTemplate')
  .buttons
    a-button.button(v-if='stepForm?.current === 1', @click='onPreview') 预览
    a-button.button(@click='onCancel') 取消
    a-button.button(:id='copyId', v-if='!isCreate') 复制到剪切板
    a-button.button(v-else, @click='onPaste') 从剪切板粘贴
    a-button.button(@click='onTemporarySave') 暂存
    a-button.button(type='primary', @click='onSave') 发布
  TaTemplateFormSteps(
    ref='stepForm',
    :record='editRecord',
    v-model:values='editRecord.formData',
    :steps='steps',
    :clickable='true',
    :actionable='false'
  )
    template(#steps='{ current, click }')
      .steps
        TaTab.tabs(:tabs='taTabTabs', :value='current', @update:value='click')
</template>

<style lang="stylus" scoped>
.bpm-admin-workflows-form
  position relative
  width 100%
  height 100%
  padding 0
  .buttons
    position absolute
    right 40px
    top 0px
    z-index 1000
    .button
      margin-right 12px
  >>> .step-content
    height calc(100vh - 116px) !important
  .footer
    position absolute
    bottom 0
    background white
    border-top 1px solid #e8e8e8
    display flex
    justify-content flex-end
    padding 10px 40px
    .button
      margin-left 10px
  .steps
    z-index 99
    border-bottom 1px solid #F0F0F0
    height 50px
    .tabs
      display flex
      justify-content center
      // width fit-content
      >>> .tab
        height auto
        line-height 34px
        padding-bottom 20px
</style>
