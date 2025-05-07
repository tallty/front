<script lang="ts">
import { TaTemplateFormItem } from '@/components/global/ta-component/ta-template-form-core/types';
import { Place } from '@/engines/bpm/bpm-core/types';
import { PropType, computed, defineComponent, toRefs, onMounted } from 'vue';
import { TaConditionType } from '@/components/global/ta-component/actions/types';
import { TaAction, TaCondition } from '../../../../../components/global/ta-component/actions/types';
import { Workflow } from '../../../bpm-core/types';

export interface BpmNodeConditionOptField {
  name: string;
  seq: string;
  form: TaTemplateFormItem;
}

export const DEFAULT_ACTION_CONDITION: TaCondition = {
  actions: [
    {
      pipeline: {} as any,
      condition: {
        type: TaConditionType.Group,
        actions_relation_type: 'and',
        actions: [] as TaAction[],
      },
    },
  ],
  actions_relation_type: 'and',
  type: TaConditionType.Group,
};

const ComBpmNodeEditorCondition = defineComponent({
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
      type: Object as PropType<Workflow>,
      default: () => ({
        meta: {
          workflow_attributes: [],
        },
      }),
    },
  },
  emits: ['update:nodeCopy'],
  setup(props, { emit }) {
    // const workflowTemplate = computed<TaTemplateFormItem>(() => {
    //   const extraAttrs: TaTemplateFormItem[] = (props.workflow.meta.workflow_attributes || []).map(
    //     (o: any) => ({
    //       key: o.attr,
    //       name: o.name,
    //       layout: {},
    //       model: {
    //         attr_type: o.attr_type || 'number',
    //       },
    //     }),
    //   );

    //   return {
    //     ...props.workflow.form,
    //     fields: [...(props.workflow.form?.fields || []), ...extraAttrs],
    //   };
    // });

    // const fieldOpts = computed<BpmNodeConditionOptField[]>(() =>
    //   props.workflow.core.places
    //     .filter((place: Place) => place.place_form?.model_key)
    //     .map((place: Place) => ({
    //       name: place.name,
    //       seq: place.seq,
    //       form: place.place_form,
    //     })),
    // );
    // treeNode node
    const localNode = computed({
      get: () => props.nodeCopy,
      set: val => emit('update:nodeCopy', val),
    });

    const conditionRef = computed({
      get: () => localNode.value?.condition,
      set: val => {
        localNode.value.condition = val;
      },
    });

    onMounted(() => {
      if (!conditionRef.value?.is_default) {
        if (!conditionRef.value)
          conditionRef.value = {
            is_default: false,
            action_condition: DEFAULT_ACTION_CONDITION,
          };
        if (!conditionRef.value.action_condition)
          conditionRef.value.action_condition = DEFAULT_ACTION_CONDITION;
      }
    });

    return {
      ...toRefs(props),
      // fieldOpts,
      // workflowTemplate,
      conditionRef,
      localNode,
    };
  },
});

export default ComBpmNodeEditorCondition;
</script>

<template lang="pug">
.com-bpm-node-editor-condition
  a-alert(message='当审批同时满足以下条件时进入此流程', type='info', closeText='我知道了')
  //- a-alert(v-if="isFieldsChanged" message="表单已被修改，已自动更新当前条件" type="warning" closeText="我知道了")
  .rules
    strong 是否为默认条件：
    a-switch(:checked='conditionRef.is_default', :disabled='true')
  .rules.space-y-2(v-if='!localNode.condition.is_default')
    .w-full.overflow-auto
      TaConditionGroupEditorTree(
        v-for='(action, index) in conditionRef.action_condition?.actions'
        v-model:value='conditionRef.action_condition.actions[index].condition',
        :dataFormOptions='workflow.allDataFormOptions',
      )
</template>

<style lang="stylus" scoped>
.com-bpm-node-editor-condition
  padding 20px
  .rules
    padding 20px 0
    border-bottom 1px solid #ddd
</style>
