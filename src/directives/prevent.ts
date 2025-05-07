export default {
  beforeMount(el: HTMLElement) {
    el.addEventListener('click', event => event.preventDefault());
    el.addEventListener('focus', event => event.preventDefault());
    el.addEventListener('mousedown', event => event.preventDefault());
    el.blur();
  },
};
