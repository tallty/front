import { ComputedRef, computed, inject, provide } from 'vue';
import { VObject } from '../../../../../lib/vails/model/index';
import { PlaceMenuTemplate } from '../../../bpm-core/types';

const Key = 'flowTreeRootProps';

interface rootProps {
  places: PlaceMenuTemplate[];
  activeNode: VObject;
  flowTreeComponent: any;
}

export const provideFlowTreeRootProps = (data: ComputedRef<rootProps>) => {
  provide(Key, data);
};

export const injectFlowTreeRootProps = () => {
  const rootProps = inject(Key) as ComputedRef<rootProps>;

  const emitterRef = computed(() => {
    return rootProps.value.flowTreeComponent.emitter;
  });

  return {
    rootProps,
    emitterRef,
  };
};
