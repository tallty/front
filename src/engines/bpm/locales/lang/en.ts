import antd from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment/locale/zh-cn';
import bpms from './bpms-EN';

const locales = {
  localeName: 'en',
  momentLocaleName: 'en',
  antd,
  moment,
  ...bpms,
};

export default {
  ...locales,
};
