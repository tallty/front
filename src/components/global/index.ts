import { App } from 'vue';

const useGlobalComponents = (app: App) => {
  const requireComponent = require.context('./', true, /\.vue$/);

  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);
    app.component(componentConfig.default.name, componentConfig.default);
  });

  const requireEnginesGlobalComponent = require.context(
    './../../engines/',
    true,
    /\/components\/global\/.+\.vue$/,
  );

  requireEnginesGlobalComponent.keys().forEach(fileName => {
    const componentConfig = requireEnginesGlobalComponent(fileName);
    app.component(componentConfig.default.name, componentConfig.default);
  });
};

export default useGlobalComponents;
