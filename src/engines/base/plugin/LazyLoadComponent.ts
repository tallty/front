import {
  Component,
  AsyncComponentLoader,
  defineAsyncComponent,
  onMounted,
  ref,
  defineComponent,
  h,
  VNode,
} from 'vue';

type ComponentResolverFn = (component: Component) => void;

export const LazyLoadComponent = ({
  componentLoader,
  loadingComponent,
  errorComponent,
}: {
  componentLoader: AsyncComponentLoader;
  loadingComponent: Component;
  errorComponent?: Component;
}) => {
  let componentResolver: ComponentResolverFn;
  return defineAsyncComponent({
    loader: () => {
      return new Promise(resolve => {
        componentResolver = resolve as ComponentResolverFn;
      });
    },
    loadingComponent: defineComponent({
      setup() {
        const ELEMENT = ref();
        const loadComponentFn = async () => {
          const COMPONENT = await componentLoader();
          componentResolver(COMPONENT);
        };
        onMounted(async () => {
          // 不存在IntersectionObserver直接加载
          if (!('IntersectionObserver' in window)) {
            await loadComponentFn();
            return;
          }
          // 进入observer可视区域则加载
          const OBSERVER = new IntersectionObserver(async entries => {
            if (!entries?.[0]?.isIntersecting) return;
            OBSERVER.unobserve(ELEMENT.value);
            await loadComponentFn();
          });
          OBSERVER.observe(ELEMENT.value);
        });
        return () => {
          return h('div', { ref: ELEMENT }, loadingComponent as VNode);
        };
      },
    }),
    errorComponent,
  });
};
