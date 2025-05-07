## 关于更新的小程序端打印工作流 与 小程序端支持 pc 上传文件

1. package.json

```sh
yarn add dom-to-image @tybys/jweixin
yarn add docxtemplater pizzip
```

2. router/index.ts，将下列路由放在布局之外

```ts
{
  path: '/bpm/user/files/new',
  name: 'bpmUserFilesNew',
  component: () =>
    import(
      /* webpackChunkName: "bpmUserFilesNew" */ '@/engines/bpm/views/bpm/user/files/New.vue'
    ),
  meta: {
    title: '文件上传',
  },
},
{
  path: '/bpm/user/instances/:instanceId/print',
  name: 'bpmUserInstancePrint',
  component: () =>
    import(
      /* webpackChunkName: "bpmUserInstancePrint" */ '@/engines/bpm/views/bpm/user/instances/Print.vue'
    ),
  meta: {
    title: '流程打印',
  },
},
```

3. 修改 MyApi，支持 query 上 token 直接访问

```ts
const getQueryStringParameter = (href: string, name: string) => {
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(href);
  if (results == null) {
    return '';
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
};

...

request.interceptors.request.use(
  (config: any) => {
    if (!config.headers.authorization) {
      const token = getQueryStringParameter(location.href, 'token');
      Object.assign(config.headers, {
        authorization: `Token ${token || localStorage.get(STORAGE_TOKEN_KEY)}`,
      });
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
```

## 关于工作流二维码

1. 需要配置环境变量 VUE_APP_DOMAIN，并安装 `qrcode`，且在 global.d.ts 中添加 declare module 'qrcode';
2. 在 nginx 中，需配置：

```nginx
location ~/short/instances {
        if ($http_user_agent ~* "(mobile|nokia|iphone|ipad|android|samsung|htc|blackberry)") {
                rewrite ^/short/instances/(\d+) https://plan.tallty.com/h5/#/bpm-mobile/pages/instance/show/index?id=$1;
        }

        rewrite ^/short/instances/(\d+) https://plan.tallty.com/bpm/user/instances/$1;
}
```
