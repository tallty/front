import { App } from 'vue';

const useGlobalComponents = (app: App) => {
  const requireComponent = require.context('./../../../components/global/', true, /\.vue$/);

  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName);
    app.component(
      componentConfig.default.name || componentConfig.default.__name,
      componentConfig.default,
    );
  });

  const requireEnginesGlobalComponent = require.context(
    './../../../engines/',
    true,
    /\/components\/global\/.+\.vue$/,
  );

  requireEnginesGlobalComponent.keys().forEach(fileName => {
    const componentConfig = requireEnginesGlobalComponent(fileName);
    app.component(
      componentConfig.default.name || componentConfig.default.__name,
      componentConfig.default,
    );
  });
};

export default useGlobalComponents;
