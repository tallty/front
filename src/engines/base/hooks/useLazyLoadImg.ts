import { Lazy } from '../plugin/lazy/index';
import type { Ref } from 'vue-demi';
import { LazyOptions } from '../plugin/lazy/types';
import { isRef, onMounted, onUnmounted, ref, watch } from 'vue';

export default function useLazyLoadImg(
  src: Ref<string> | string,
  options?: LazyOptions,
): Ref<HTMLElement | null> {
  const resRef = ref<HTMLElement | null>(null);
  const lazy = new Lazy(options);
  onMounted(() => {
    if (resRef?.value) {
      lazy.mount(resRef.value, isRef(src) ? src.value : src);
    }
  });
  watch(
    () => src,
    () => {
      if (isRef(src) ? src.value : src) {
        lazy.update(resRef.value!, isRef(src) ? src.value : src);
      }
    },
  );
  onUnmounted(() => {
    if (resRef?.value) {
      lazy.unmount(resRef.value);
    }
  });
  return resRef;
}
