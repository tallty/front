# Tofu Engine

## 当有多个 tofu 配置一样的 url，可以在 layout 获取 tofu 接口的地方，进行过滤

```ts
const { fetchMenuTree } = useAutoMenu();
onMounted(() => {
  fetchMenuTree((item: VObject, ancestor: VObject[]) => {
    return item.name === '科佑' || ancestor.map(i => i.name).includes('科佑');
  });
});
```

## 当有 详情页的路由，不配在菜单中，但是需要显示菜单并在菜单中高亮，可在 route 配置中写 menuKey

```ts
// crm/user/targets/search 与 /crm/user/targets 菜单保持一致
{
  path: 'crm/user/targets/search',
  name: 'crmUserTargetsSearch',
  component: () =>
    import(
      /* webpackChunkName: "crmUserTargetsSearch" */ '@/engines/crm/views/crm/user/targets/Search.vue'
    ),
  meta: {
    title: '客户列表',
    menuKey: '/crm/user/targets',
  },
},
```
