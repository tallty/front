import antd from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment/locale/zh-cn';
import bpms from './bpms-zh-CN';

const locales = {
  localeName: 'zhCN',
  momentLocaleName: 'zh-cn',
  antd,
  moment,
  ...bpms,
};

export default {
  ...locales,
};
