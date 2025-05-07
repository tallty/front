import { TaTemplateFormStepsStep } from '@/components/global/ta-component/ta-template-form-core/types';
import useProcessFields from '@/components/global/ta-component/ta-template-form-core/useProcessFields';
import { VObject } from '@/lib/vails/model/index';
import { VStore } from '@/lib/vails/store/index';
import { message } from 'ant-design-vue';
import { cloneDeep, merge, set } from 'lodash-es';
import { ref, watch } from 'vue';
import { WorkflowModel } from './apis/admin/workflow.api';
import { BpmFlowableInstances } from './apis/flowable/instance.api';
import { BpmFlowableModelSettingsApi } from './apis/flowable/model_settings.api';
import { BpmUserInstances } from './apis/user/instance.api';
import { BpmUserWorkflows } from './apis/user/workflowl.api';

export interface flowableConfig {
  flowable_type: string;
  flowable_id: number;
  flowable_flag: string;
}

const useInstanceCreator = (
  props: any,
  emit: any,
  callback: {
    success: (data: VObject) => void;
    fail: () => void;
    openForm: () => void;
  },
) => {
  const workflowStore = new VStore(new BpmUserWorkflows(), WorkflowModel);

  const flowableModelSettingStore = new VStore(
    new BpmFlowableModelSettingsApi({
      parents: [
        {
          type: props.flowable?.flowable_type,
          id: props.flowable?.flowable_id,
        },
      ],
      params: { flowable_flags: props.flowable?.flowable_flag },
    }),
  );

  watch(
    () => props.flowable,
    () => {
      flowableModelSettingStore.api = new BpmFlowableModelSettingsApi({
        parents: [
          {
            type: props.flowable?.flowable_type,
            id: props.flowable?.flowable_id,
          },
        ],
        params: { flowable_flags: props.flowable?.flowable_flag },
      });
    },
    { deep: true },
  );

  const instanceStore = new VStore(new BpmUserInstances());

  const fakeRecord = ref<any>({
    formData: {
      payload: {},
      flowable_info: {},
      cache_payload: {},
    },
    fields: {
      fields: [],
    },
    configCache: {} as VObject,
    // dirty: () => {
    //   return fakeRecord.value.formData.payload;
    // },
    storageConfigCache: (key: string, val: any) => {
      fakeRecord.value.configCache[key] = val;
    },
    save: () => {
      return new Promise((resolve, reject) => {
        const params = merge(cloneDeep(props.initFormData), {
          // payload: fakeRecord.value.formData.payload,
          // flowable_info: fakeRecord.value.formData.flowable_info,
          // cache_payload: fakeRecord.value.formData.cache_payload,
          data_form_payload: fakeRecord.value.formData.data_form_payload,
          level: fakeRecord.value.formData.level,
          auto_submit: fakeRecord.value.configCache.onTemporaryStorage ? false : props.autoSubmit,
          flowable_flag: props.flowable?.flowable_flag,
          flowable_id: props.flowable?.flowable_id,
          flowable_type: props.flowable?.flowable_type,
        });

        // 兼容老代码
        if (Object.values(params.data_form_payload || {}).filter(i => i).length === 0) {
          merge(params, {
            payload: fakeRecord.value.formData.payload,
          });
        }

        instanceStore
          .create(params)
          .then(data => {
            callback.success(data);

            emit('success', data);
            resolve({ ...data, notBack: true });
          })
          .catch(err => {
            callback.fail();
            emit('fail');
            reject(err);
          });
      });
    },
  });

  const workflow = ref<any>({});

  watch(
    workflow,
    () => {
      fakeRecord.value.fields.fields = workflow.value.startPlace?.fields?.fields || [];
    },
    {
      deep: true,
      immediate: true,
    },
  );

  const { getFormAllAccessibilityHidden } = useProcessFields();

  const onCreateInstance = async () => {
    fakeRecord.value.formData = {
      payload: cloneDeep(props.initFormData) || {},
      data_form_payload: {},
      flowable_info: {},
      cache_payload: {},
    };

    await (typeof props.workflowId === 'number'
      ? workflowStore.find(props.workflowId).then(() => {
          workflow.value = workflowStore.record.value;
          instanceStore.api = new BpmUserInstances({
            parents: [{ type: 'workflows', id: workflow.value.id }],
          });
        })
      : flowableModelSettingStore.index().then(() => {
          if (flowableModelSettingStore.records.value[0]) {
            workflow.value = new WorkflowModel(
              {
                ...flowableModelSettingStore.records.value[0].workflow,
                model_setting: flowableModelSettingStore.records.value[0],
              },
              workflowStore,
            );
            instanceStore.api = new BpmFlowableInstances({
              parents: [
                {
                  type: props.flowable.flowable_type,
                  id: props.flowable.flowable_id,
                },
              ],
              params: {
                instance: { flowable_flag: props.flowable.flowable_flag },
              },
            });
          }
        }));

    if (!workflow.value.id) return;

    if (workflow.value.can_submit == false) {
      message.error('当前流程已达限制');
      return;
    }
    if (!(workflow.value.formSetting && workflow.value.formSetting.isEmpty)) {
      // const formAllAccessibilityHidden =
      //   getFormAllAccessibilityHidden(
      //     workflow.value.form,
      //     {},
      //     workflow.value.accessibility || [],
      //   ) &&
      //   getFormAllAccessibilityHidden(
      //     workflow.value.instanceFlowableForm,
      //     {},
      //     workflow.value.accessibility || [],
      //   );
      if (!workflow.value.formAllAccessibilityHidden) {
        workflow.value.formSetting.steps.forEach((step: TaTemplateFormStepsStep) => {
          set(fakeRecord.value.formData, step.modelKeyPrefix!, cloneDeep(props.initFormData));
        });
        callback.openForm();
        return;
      }
    }
    fakeRecord.value.save();
  };

  return {
    workflow,
    fakeRecord,
    onCreateInstance,
  };
};

export default useInstanceCreator;
