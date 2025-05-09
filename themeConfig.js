const less = require('less');
const { getLessOptions } = require('less-loader/dist/utils');
const { getThemeVariables } = require('ant-design-vue/dist/theme');
const customTheme = require('./theme.js');

const themeConfig = [
  {
    theme: 'dark',
    htmlThemeAttr: 'antdv-pro-theme-dark',
    modifyVars: { ...getThemeVariables({ dark: true }), 'text-color': 'fade(@white, 65%)' },
  },
  {
    theme: 'custom',
    htmlThemeAttr: 'antdv-pro-theme-custom',
    modifyVars: { ...getThemeVariables(), ...customTheme },
  },
];
const additionalData = async (content, loaderContext) => {
  const themePromises = themeConfig.map(async t => {
    const { htmlThemeAttr, modifyVars = {} } = t;
    const options = getLessOptions(loaderContext, {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars,
      },
    });
    try {
      const { css } = await less.render(content, options);
      let res = '';
      if (htmlThemeAttr && css) {
        res = `
        [data-pro-theme=${htmlThemeAttr}] {
          ${css}
        }
        `;
      }
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(content);
    }
  });
  let res = content;
  for (const themePromise of themePromises) {
    const theme = await themePromise;
    res += theme;
  }
  return res;
};

module.exports = {
  themeConfig,
  additionalData,
};
