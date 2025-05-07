/* eslint-disable no-unused-vars */
import { assign } from 'lodash-es';
import type { App, DirectiveBinding } from 'vue-demi';
import { canUseIntersectionObserve } from './utils';
import { LazyOptions, Lifecycle, LifecycleEnum, ValueObject } from './types';

const DEFAULT_LOADING = 'https://innomatch.oss-cn-shanghai.aliyuncs.com/loging_gif_2.gif';
const DEFAULT_ERROR = '';

const ATTR_LAZY_TIMEOUT_ID = 'attr-lazy-timeout-id';

const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0,
};

export class Lazy {
  private _images: WeakMap<HTMLElement, IntersectionObserver> = new WeakMap();

  public options: LazyOptions = {
    loading: DEFAULT_LOADING,
    error: DEFAULT_ERROR,
    observerOptions: DEFAULT_OBSERVER_OPTIONS,
    uselog: true,
    lifecycle: {},
    logLevel: 'error',
    loadingSizeBg: '40px 40px',
  };

  constructor(options?: LazyOptions) {
    this.initConfig(options);
  }

  public initConfig(options = {}) {
    assign(this.options, options);
  }

  public formatValue(v: ValueObject | string): ValueObject {
    let src = v as string;
    let { loading, error, lifecycle, delay, loadingSizeBg } = this.options;
    if (Object.prototype.toString.call(v) === '[object Object]') {
      const res = { ...(v as ValueObject) };
      src = res.src;
      loading = res.loading || this.options.loading;
      error = res.error || this.options.error;
      lifecycle = res.lifecycle || this.options.lifecycle;
      delay = res.delay || this.options.delay;
      loadingSizeBg = res.loadingSizeBg || this.options.loadingSizeBg;
    }
    return {
      src,
      loading,
      error,
      lifecycle,
      delay,
      loadingSizeBg,
    };
  }

  private _logger(msg: string, ...v: any[]) {
    if (this.options.logLevel === 'warn') {
      console.warn(msg, v);
      return;
    }
    if (this.options.logLevel === 'info') {
      console.info(msg, v);
      return;
    }
    if (this.options.logLevel === 'debug') {
      console.debug(msg, v);
      return;
    }
    console.error(msg, v);
  }

  public logger(logCb: () => void): void {
    if (this.options.uselog) {
      logCb();
    }
  }

  public checkLifeCycle(v: LifecycleEnum, lifecycle?: Lifecycle, element?: HTMLElement): void {
    if (v === LifecycleEnum.LOADING) {
      element?.setAttribute('lazy', LifecycleEnum.LOADING);
      if (lifecycle?.loading) lifecycle.loading(element);
      return;
    }
    if (v === LifecycleEnum.LOADED) {
      element?.setAttribute('lazy', LifecycleEnum.LOADED);
      if (lifecycle?.loaded) lifecycle.loaded(element);
      return;
    }
    if (v === LifecycleEnum.ERROR) {
      element?.setAttribute('lazy', LifecycleEnum.LOADED);
      if (lifecycle?.error) lifecycle.error(element);
    }
  }

  public imgListener(
    img: HTMLImageElement,
    success: ((this: GlobalEventHandlers, ev: Event) => any) | null,
    error: OnErrorEventHandler,
  ) {
    img.onload = success;
    img.onerror = error;
  }

  public relayObserver(element: HTMLElement): IntersectionObserver | undefined {
    return this._images.get(element);
  }

  public setSureImg(element: HTMLElement, src: string, error?: string, life?: Lifecycle): void {
    if (src) {
      const pre = element.getAttribute('src');
      if (pre !== src) {
        element.setAttribute('src', src);
        // element.style.backgroundImage = '';
      }
    }
    this.imgListener(
      element as HTMLImageElement,
      () => {
        this.checkLifeCycle(LifecycleEnum.LOADED, life, element);
      },
      () => {
        element.onload = null;
        this.checkLifeCycle(LifecycleEnum.ERROR, life, element);
        this.relayObserver(element)?.disconnect();
        if (error) {
          const _src = element.getAttribute('src');
          if (_src !== error) {
            element.setAttribute('src', error);
            // element.style.backgroundImage = '';
          }
        }
        this.logger(() => {
          this._logger(`图片加载失败，图片路径：${src} `);
        });
      },
    );
  }

  public setImg(element: HTMLElement, src: string, error?: string, life?: Lifecycle): void {
    if (element.tagName.toLowerCase() === 'img') {
      this.setSureImg(element, src, error, life);
    } else {
      element.style.backgroundImage = `url('${src}')`;
    }
  }

  public loadImg(element: HTMLElement, src: string, error?: string, life?: Lifecycle): void {
    this.setImg(element, src, error, life);
  }

  private intersectionCb(
    element: HTMLElement,
    entry: IntersectionObserverEntry,
    src: string,
    error?: string,
    life?: Lifecycle,
  ): void {
    if (entry.isIntersecting) {
      this.relayObserver(element)?.unobserve(entry.target);
      this.setImg(element, src, error, life);
    }
  }

  private delayIntersectionCb(
    element: HTMLElement,
    entry: IntersectionObserverEntry,
    delay: number,
    src: string,
    error?: string,
    life?: Lifecycle,
  ): void {
    if (entry.isIntersecting) {
      if (entry.target.hasAttribute(ATTR_LAZY_TIMEOUT_ID)) return;
      const timeoutId = setTimeout(() => {
        this.intersectionCb(element, entry, src, error, life);
        entry.target.removeAttribute(ATTR_LAZY_TIMEOUT_ID);
      }, delay);
      entry.target.setAttribute(ATTR_LAZY_TIMEOUT_ID, String(timeoutId));
    } else {
      if (entry.target.hasAttribute(ATTR_LAZY_TIMEOUT_ID)) {
        clearTimeout(Number(entry.target.getAttribute(ATTR_LAZY_TIMEOUT_ID)));
        entry.target.removeAttribute(ATTR_LAZY_TIMEOUT_ID);
      }
    }
  }

  public initIntersectionObserver(
    element: HTMLElement,
    src: string,
    error?: string,
    lifecycle?: Lifecycle,
    delay?: number,
  ): void {
    const obsOptions = this.options.observerOptions;
    this._images.set(
      element,
      new IntersectionObserver(entries => {
        [...entries].forEach(entry => {
          if (delay && delay > 0)
            this.delayIntersectionCb(element, entry, delay, src, error, lifecycle);
          else this.intersectionCb(element, entry, src, error, lifecycle);
        });
      }, obsOptions),
    );
    this.relayObserver(element)?.observe?.(element);
  }

  public mount(
    element: HTMLElement,
    binding: string | DirectiveBinding<string | ValueObject>,
  ): void {
    if (!element) return;
    const { src, loading, error, lifecycle, delay, loadingSizeBg } = this.formatValue(
      typeof binding === 'string' ? binding : binding.value,
    );
    this.checkLifeCycle(LifecycleEnum.LOADING, lifecycle, element);
    // element.setAttribute('src', loading || DEFAULT_LOADING);
    element.style.backgroundImage = `url('${loading || DEFAULT_LOADING}')`;
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center';
    element.style.backgroundSize = loadingSizeBg || '40px 40px';
    if (!canUseIntersectionObserve) {
      this.loadImg(element, src, error, lifecycle);
      this.logger(() => {
        this._logger('IntersectionObserver不支持');
      });
    }
    this.initIntersectionObserver(element, src, error, lifecycle, delay);
  }

  public update(
    element: HTMLElement,
    binding: string | DirectiveBinding<string | ValueObject>,
  ): void {
    if (element) {
      this.relayObserver(element)?.unobserve?.(element);
      const { src, error, lifecycle, delay } = this.formatValue(
        typeof binding === 'string' ? binding : binding.value,
      );
      this.initIntersectionObserver(element, src, error, lifecycle, delay);
    }
  }

  public unmount(element: HTMLElement) {
    if (element) {
      this.relayObserver(element)?.observe?.(element);
      this._images.delete(element);
    }
  }
}

export default {
  install(Vue: App, options: LazyOptions): void {
    const lazy = new Lazy(options);
    Vue.config.globalProperties.$LazyLoad = lazy;
    Vue.provide('LazyLoad', lazy);
    Vue.directive('lazy', {
      mounted: lazy.mount.bind(lazy),
      updated: lazy.update.bind(lazy),
      unmounted: lazy.unmount.bind(lazy),
    });
  },
};
