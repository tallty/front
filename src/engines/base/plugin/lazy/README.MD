### 图片懒加载

#### 配置方式

在 main.js 中

```typescript
import lazyload from '@/engines/base/plugin/lazy/index';

...


app.use(lazyload,{
  loading?: 'loading图片',
  error?:'error图片',
  observerOptions?:'IntersectionObserver设置',
  uselog?:'是否日志打印 默认为true',
  logLevel?:'log级别',
  delay?:'图像加载延迟 单位ms - 可以理解为加载前图片loading可见时间,默认为0',
  lifecycle?:'生命周期函数'
})
```

<br/>

默认使用时，基本我们大多只需要设置 loading 即可，亦或者直接传入一个空对象

```typescript
app.use(lazyload, {});
```

<br/>
<br/>

#### 关于 lifecycle

<br/>

lifecycle 基本是一个预留接口，它的其中一个使用场景是当我们需要收集图片的加载日志的时候，可以通过 lifecycle 进行日志上报，当然，亦可以用来作其它用途。比如我们迫切需要在某个图片加载显示完成时，再进行某一个接口的请求，那么在这个时候，我们就可以使用这个 lifecycle 使用方式如下：

```typescript
app.use(lazyload, {
  lifecycle: {
    // 图片加载中
    loading: (v: HTMLElement) => {},
    // 图片加载完成
    loaded: (v: HTMLElement) => {},
    // 图片加载失败
    error: (v: HTMLElement) => {},
  },
});
```

<br/>

**lifecycle 的周期钩子会接受一个 htmlelement 作为参数，当然，我们是可以不使用它的，后续如果有其它的想法，可以自行修改相关逻辑，但是请务必在 README 中进行标注**

<br/>
<br/>

#### 具体使用方式

我们在具体使用时可以参考以下方式

```vue
/* 方式一，直接使用 */
<img v-lazy="图片地址" />

/* 方式二，使用时加入单独对象配置，可配置项参考 type.ts中的 ValueObject */
<img v-lazy="{src: 图片地址, loading:xxx, error:xxx,lifecycle:xxx ...}" />
```

<br/>

如果，对于 loading 我们不太满意，在某些单独的页面，亦或者全局想要 diy 一个 loading 样式，在每个使用了 v-lazy 指令的 img 标签，我们在它的每个生命周期都赋予了独特的 attribute,我们可通过这些 attr 来对样式进行覆写

- loading : `<img lazy='loading'/>`
- loaded : `<img lazy='loaded'/>`
- error : `<img lazy='error'/>`

### 使用 hook 的方式

使用 hook 和使用指令的方式略有不同

```typescript
// @/engines/base/plugin/lazy/types
interface LazyOptions {
  error?: string;
  loading?: string;
  observerOptions?: IntersectionObserverInit;
  uselog?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'log';
  lifecycle?: Lifecycle;
  delay?: number;
  loadingSizeBg?: string;
}
```

```vue
<script>
import useLazyLoadImg from '@/engines/base/hooks/useLazyLoadImg';
const src = ref('');
// or const src = ''

const lazy = useLazyLoadImg(src, {
  // 见上方interface LazyOptions
  ...{...},
});

return {
  lazy,
};
</script>

<template>
  <img ref="lazy" [...attrs] />
</template>
```
