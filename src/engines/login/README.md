### 自定认登录功能使用

**使用需要与 baes（git@git.tallty.com:ta-vue/base.git） engine 配合使用**

`"vue-i18n": "9.0.0",`

> `CODE` 验证码登录 / `PASSWORD` 密码登录 / `WECHAT` 微信扫码登录 / `REGISTER` 注册 / `EMAIL_REGISTER` 邮箱注册 / `FORGET` 忘记密码

#### 弹窗式

##### process.env 配置

```env
VUE_APP_LOGIN_DISPLAY_TYPE = MODAL
VUE_APP_LOGIN_TYPE = 'CODE,PASSWORD,WECHAT,REGISTER,EMAIL_REGISTER,FORGET'
VUE_APP_LOGIN_MODAL_BG = https://
VUE_APP_LOGIN_ICON = https://
VUE_APP_LOGIN_ICON_SIZE = 50%
VUE_APP_LOGIN_SPEECH = Hi,欢迎来到InnoMath
VUE_APP_LOGIN_FOOTER_TITLE = 数字化 | 智能化 | 生态化
VUE_APP_LOGIN_FOOTER_SUBTITLE = 打造技术、人才、服务、资本整合的创新生态圈
VUE_APP_LOGIN_MODAL_BG_TYPE = FILL | CONTENT

```

> 释义：
>
> - VUE_APP_LOGIN_DISPLAY_TYPE `展示类型 MODAL 弹窗登录时固定此值`
> - VUE_APP_LOGIN_TYPE `登录类型`
> - VUE_APP_LOGIN_MODAL_BG `背景图片地址`
> - VUE_APP_LOGIN_ICON `icon地址`
> - VUE_APP_LOGIN_ICON_SIZE `icon大小，不配置则默认为50%`
> - VUE_APP_LOGIN_SPEECH `欢迎词`
> - VUE_APP_LOGIN_FOOTER_TITLE `底部主标题`
> - VUE_APP_LOGIN_FOOTER_SUBTITLE `底部副标题`
> - VUE_APP_LOGIN_MODAL_BG_TYPE `弹窗背景展示模式分为FILL(以充满模态框的形式填充) CONTENT(仅填充左侧部分)`

#### them 配置

```styl
$primary-color = #1890ff // 登录等类似的主题钯
$link-color = #1890ff // 登录时的文字链接色

```

---

#### 特定登录页式

##### **router/index.ts** 配置

> staticRoutes 数组中，将下面的对象放到里面

```typescript
  {
    path: '/login',
    meta: { icon: 'HistoryOutlined', title: '登录' },
    component: (): Component => import('@/engines/login/views/login/index.vue'),
  },
```

##### process.env 配置

```env
VUE_APP_LOGIN_DISPLAY_TYPE = REDIRECT
VUE_APP_LOGIN_TYPE = 'CODE,PASSWORD,WECHAT,REGISTER,EMAIL_REGISTER,FORGET'
VUE_APP_LOGIN_REDIRECT_BG = https://
VUE_APP_LOGIN_ICON = https://
VUE_APP_LOGIN_SPEECH = Hi,欢迎来到InnoMath
VUE_APP_LOGIN_FOOTER_TITLE = 数字化 | 智能化 | 生态化
VUE_APP_LOGIN_FOOTER_SUBTITLE = 打造技术、人才、服务、资本整合的创新生态圈

```

> 释义：
>
> - VUE_APP_LOGIN_DISPLAY_TYPE `展示类型 REDIRECT 为跳转登录页时固定项`
> - VUE_APP_LOGIN_TYPE `登录类型`
> - VUE_APP_LOGIN_REDIRECT_BG `背景图片地址 => REDIRECT模式`
> - VUE_APP_LOGIN_ICON `icon地址`
> - VUE_APP_LOGIN_SPEECH `欢迎词`
> - VUE_APP_LOGIN_FOOTER_TITLE `底部主标题`
> - VUE_APP_LOGIN_FOOTER_SUBTITLE `底部副标题`

#### them 配置

```styl
$primary-color = #1890ff // 登录等类似的主题钯
$link-color = #1890ff // 登录时的文字链接色

```

各类颜色配置

```
VUE_APP_LOGIN_MODAL_SPEECH_COLOR  左侧欢迎词 左下关键词
VUE_APP_LOGIN_THEME_MODE 登录主题 DARK-暗色调 LIGHT-亮色调
```
