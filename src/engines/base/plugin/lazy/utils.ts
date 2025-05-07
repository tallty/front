export const inBrowser = typeof window !== 'undefined' && window !== null;

export const checkIntersectionObserver = () => {
  if (
    inBrowser &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get() {
          return this.intersectionRatio > 0;
        },
      });
    }
    return true;
  }
  return false;
};
export const canUseIntersectionObserve = checkIntersectionObserver();
