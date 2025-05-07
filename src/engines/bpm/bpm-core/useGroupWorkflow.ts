import { ref } from 'vue';
import { Workflow } from './types';
import { VModel } from '@/lib/vails/model/index';

export interface WorkflowGroup {
  key: string;
  workflows: Workflow[];
}

const useGroupWorkflow = () => {
  const groupBy = (array: any[], func: any): any => {
    return array.map(typeof func === 'function' ? func : val => val[func]).reduce(
      (group: any, val: any, index: number) => ({
        ...group,
        [val]: (group[val] || []).concat(array[index]),
      }),
      {},
    );
  };

  const groups = ref<WorkflowGroup[]>([]);

  const updateWorkflowGroups = (workflows: (VModel<Workflow> | Workflow)[]) => {
    const cache: Record<string, Workflow[]> = groupBy(
      workflows,
      (record: Workflow) => record.catalog_name || '其他',
    );
    const otherGroups: WorkflowGroup[] = [{ key: '其他', workflows: cache['其他'] }];
    delete cache['其他'];
    const mainGroups: WorkflowGroup[] = Object.entries(cache).map((ary: any) => ({
      key: ary[0],
      workflows: ary[1],
    }));
    // @ts-ignore
    groups.value = mainGroups.concat(otherGroups);
  };

  return {
    groups,
    updateWorkflowGroups,
  };
};

export default useGroupWorkflow;
