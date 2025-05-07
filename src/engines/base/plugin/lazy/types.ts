/* eslint-disable no-unused-vars */
export enum LifecycleEnum {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

export type Lifecycle = {
  [v in LifecycleEnum]?: (el?: HTMLElement) => void;
};
export interface ValueObject {
  src: string;
  error?: string;
  loading?: string;
  lifecycle?: Lifecycle;
  delay?: number;
  loadingSizeBg?: string;
}

export interface LazyOptions {
  error?: string;
  loading?: string;
  observerOptions?: IntersectionObserverInit;
  uselog?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'log';
  lifecycle?: Lifecycle;
  delay?: number;
  loadingSizeBg?: string;
}
