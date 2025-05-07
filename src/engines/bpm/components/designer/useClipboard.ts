import { Ref, inject, provide, ref } from 'vue';
import { Place } from '../../bpm-core/types';

const Key = 'ClipboardKey';

export interface Clipboard {
  node?: Partial<Place>;
}

const useProvideClipboard = () => {
  const clipboard = ref<Clipboard>({});
  provide(Key, clipboard);
  return { clipboard };
};

const useInjectClipboard = () => {
  const clipboard = inject<Ref<Clipboard>>(Key);
  return { clipboard };
};

export { useProvideClipboard, useInjectClipboard };
