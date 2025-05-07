### 新登录（暂时仅有验证码登录和密码登录）

##### process.env 配置

```env
VUE_APP_ICON=https://
```

#### theme 配置

```styl
$primary-color = #1890ff // 主题色
```

### 使用说明

在登录页引入 ComNewLogin,传入 loginBgConfig,appName 和 appId 即可

### 其他说明

传入的 loginBgConfig 有特殊处理，将会把 key(如：mainBg)转化为名为 --main-bg 的 css 变量; 这样，想要开放其他样式的修改时,可以传入 loginBgConfig(如:{rightColor:'#fff'},然后在对应的 style 中 color:var(--right-icon,默认值))

背景图左侧有图案时，可以不配置 VUE_APP_ICON,这样左侧的图标和 appName 都不会显示
