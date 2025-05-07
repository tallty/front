import { defineAsyncComponent } from 'vue';
import { VObject } from '../../lib/vails/model/index';

const components: VObject = {};
let componentNames: string[] = [];
const requireContext = require.context('.', false, /\.vue$/i, 'sync');

componentNames = requireContext.keys().map((file: string) => file.replace(/(^.\/)|(\.vue$)/g, ''));

componentNames.forEach(component => {
  components[component] = defineAsyncComponent(() => import(`./${component}.vue`));
});

export default components;
