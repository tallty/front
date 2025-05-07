<script lang="ts">
import { VObject } from '@/lib/vails/model';
import { PropType, computed, defineComponent, provide, ref, toRefs } from 'vue';
import { InstanceModel } from '../bpm-core/apis/user/instance.api';
import useInstanceCreator, { flowableConfig } from '../bpm-core/useInstanceCreator';
import ComBpmInstanceDetailDialog from './ComBpmInstanceDetailDialog.vue';

const ComBpmInstanceCreator = defineComponent({
  name: 'ComBpmInstanceCreator',
  components: {
    ComBpmInstanceDetailDialog,
  },
  props: {
    workflowId: { type: Number, default: null },
    flowable: { type: Object as PropType<flowableConfig>, default: null },
    autoSubmit: { type: Boolean, default: false },
    initFormData: { type: Object, default: () => ({}) },
    context: { type: Object, default: () => ({}) },
    successCallback: { type: Function, default: null },
    okText: { type: String, default: '提交' },
    useModal: { type: Boolean, default: false },
    canSaveAndCreateNext: { type: Boolean, default: false },
  },
  emits: ['success', 'fail', 'close', 'afterSave'],
  setup(props, { emit }) {
    const { workflow, fakeRecord, onCreateInstance } = useInstanceCreator(props, emit, {
      success: (data: VObject, params = {}) => {
        visibleInstanceForm.value = false;
        if (typeof props.successCallback === 'function') {
          props.successCallback(data);
        } else {
          selectedInstanceId.value = data.id;
          visibleInstance.value = true;
        }
        emit('success', params);
      },
      fail: () => { },
      openForm: () => (visibleInstanceForm.value = true),
    });

    const visibleInstance = ref(false);
    const selectedInstanceId = ref(0);

    const visibleInstanceForm = ref(false);

    const onClose = () => {
      emit('close');
    };

    const afterSave = (value: VObject) => {
      emit('afterSave', value);
    };

    const editFormSteps = computed(() =>
      InstanceModel.getCreateSteps(workflow.value, props.flowable?.flowable_flag),
    );

    const computedWorkFlow = computed(() => workflow.value);

    provide('provideWorkflow', computedWorkFlow);

    return {
      ...toRefs(props),
      workflow,
      visibleInstanceForm,
      fakeRecord,
      visibleInstance,
      selectedInstanceId,
      onCreateInstance,
      onClose,
      afterSave,
      editFormSteps,
    };
  },
});

export default ComBpmInstanceCreator;
</script>

<template lang="pug">
.com-bpm-instance-creator
  .clickable(@click='onCreateInstance')
    slot
  component(
    v-if='visibleInstanceForm',
    :is='useModal ? "TaTemplateFormWithActionsModal" : "TaTemplateFormWithActionsDrawer"',
    v-model:visible='visibleInstanceForm',
    :title='workflow.name',
    :steps='editFormSteps',
    :record='fakeRecord',
    :canTemporaryStorage='true',
    :accessibility='fakeRecord.fields?.fields || []',
    :closeConfirm='true',
    :okText='okText',
    :context='context',
    :isPlane='true',
    :canSaveAndCreateNext='canSaveAndCreateNext',
    @afterSave='afterSave'
  )

  ComBpmInstanceDetailDialog(
    v-if='visibleInstance',
    v-model:visible='visibleInstance',
    :instanceId='selectedInstanceId',
    @close='onClose'
  )
</template>

<style lang="stylus" scoped>
.com-bpm-instance-creator
  .clickable
    cursor pointer
</style>
