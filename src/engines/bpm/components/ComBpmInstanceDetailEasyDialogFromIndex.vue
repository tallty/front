<script lang="ts">
import {
  computed,
  defineComponent,
  toRefs,
  PropType,
  onMounted,
  ref,
  defineAsyncComponent,
} from 'vue';
import { VStore } from '@/lib/vails';
import { Instance } from '../bpm-core/types';
import { bpmInstanceDialogType2ComponentMapping } from './dialogType2ComponentMapping';

type dialogType =
  | 'plan_token'
  | 'plan_task'
  | 'exp_entry'
  | 'exp_entry_normal'
  | 'bpm_instance'
  | 'hr_entry'
  | 'travel_payment'
  | 'estate_contract'
  | 'pms_task';

const dialogType2SelectFn: Record<dialogType, (instance: Instance) => boolean> = {
  plan_token: (instance: Instance) => instance.flowable_type === 'Plan::Token',
  plan_task: (instance: Instance) =>
    instance.flowable_type === 'Plan::Task' && instance.flowable_flag !== 'create',
  exp_entry: (instance: Instance) =>
    instance.flowable_type === 'Exp::Entry' && instance.flowable_info.state_machine_id,
  exp_entry_normal: (instance: Instance) =>
    instance.flowable_type === 'Exp::Entry' && !instance.flowable_info.state_machine_id,
  hr_entry: (instance: Instance) => instance.flowable_type === 'Hr::Entry',
  travel_payment: (instance: Instance) => instance.flowable_type === 'Travel::Payment',
  estate_contract: (instance: Instance) =>
    instance.flowable_type === 'Estate::Contract' ||
    (instance.flowable_type === 'Estate::CompanyEmployeeQualify' &&
      (instance.flowable_info?.new_contract_id || instance.flowable_info?.source_contract_id)),
  pms_task: (instance: Instance) => instance.flowable_type === 'Pms::Task',
  bpm_instance: () => true,
};

const ComBpmInstanceDetailEasyDialogFromIndex = defineComponent({
  name: 'ComBpmInstanceDetailEasyDialogFromIndex',
  components: {
    ...bpmInstanceDialogType2ComponentMapping,
  },
  props: {
    instance: { type: Object as PropType<Instance>, required: true }, // instance from index
    visible: { type: Boolean, default: false },
  },
  emits: ['update:visible', 'close'],
  setup(props, { emit }) {
    const localVisible = computed({
      get: () => props.visible,
      set: val => emit('update:visible', val),
    });

    const dialogType = computed(() => {
      const type = (Object.keys(dialogType2SelectFn) as dialogType[]).find((key: dialogType) =>
        dialogType2SelectFn[key](props.instance),
      );
      return type || 'bpm_instance';
    });

    // const dialogType2ComponentMapping = ref<any>({});

    onMounted(async () => {
      // dialogType2ComponentMapping.value =
    });

    const dialogType2AttrsMapping = computed(() => {
      return {
        plan_token: {
          polymorphicType: 'token',
          task: props.instance.flowable_info?.task,
          token: props.instance.flowable_info,
        },
        plan_task: {
          polymorphicType: 'task',
          task: props.instance.flowable_info,
        },
        exp_entry: {
          id: props.instance.flowable_id,
        },
        exp_entry_normal: {
          entryId: props.instance.flowable_id,
          activityId: props.instance.flowable_info?.activity_id,
          instanceId: props.instance.id,
        },
        hr_entry: {
          id: props.instance.flowable_id,
        },
        travel_payment: {
          id: props.instance.flowable_id,
        },
        estate_contract: {
          id:
            props.instance?.flowable_info?.new_contract_id ||
            props.instance?.flowable_info?.source_contract_id ||
            props.instance.flowable_id,
        },
        pms_task: {
          id: props.instance.flowable_id,
        },
        bpm_instance: {
          instanceId: props.instance.id,
        },
      };
    });

    const onClose = () => {
      emit('close');
      localVisible.value = false;
    };

    return {
      ...toRefs(props),
      localVisible,
      onClose,
      dialogType,
      dialogType2AttrsMapping,
    };
  },
});
export default ComBpmInstanceDetailEasyDialogFromIndex;
</script>

<template lang="pug">
component.com-bpm-instance-detail-easy-dialog-from-index(
  v-bind='dialogType2AttrsMapping[dialogType]',
  :is='dialogType',
  v-model:visible='localVisible',
  @close='onClose',
)
</template>
<style lang="stylus" scoped></style>
