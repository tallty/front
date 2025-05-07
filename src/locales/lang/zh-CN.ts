import globals from './global/zh-CN';
import routes from './routes/zh-CN';
import pages from './pages/zh-CN';
import antd from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment/locale/zh-cn';

const locales = {
  localeName: 'zhCN',
  momentLocaleName: 'zh-cn',
  antd,
  moment,

  ...globals,
  ...routes,
  ...pages,
};

export default {
  ...locales,
};
