import { WritableComputedRef, inject, provide } from 'vue';
import { Workflow } from '../../bpm-core/types';

const UseWorkflowKey = 'workflow';

const useProvideWorkflow = (workflow: WritableComputedRef<Workflow>) => {
  provide(UseWorkflowKey, workflow);
};

const useInjectWorkflow = () => {
  const workflowRef = inject<WritableComputedRef<Workflow>>(UseWorkflowKey);
  return { workflowRef };
};

export { useProvideWorkflow, useInjectWorkflow };
