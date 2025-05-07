## 全局主题色

./theme.styl

```stylus
@import './src/engines/base/base-core/stylus/index.styl'
```

## cable

package.json

```json
"@types/rails__actioncable": "^6.1.10",
"@rails/actioncable": "^7.1.3-2",
```

main.ts

```ts
import { TaCable } from './engines/base/channels/cable';

App.use(TaCable);
```

.env

VUE_APP_API_BASE_WSS_URL=ws://api.innomatch.net/cable

关于 development:

```markdown
**Check your config/cable.yml, if the adapter is async (the default value), your browser could only receive broadcasting from rails server process.**
```

使用：

```ts
store.extra.cable_key = 'serve_messages';
useCable(store, { callback: { afterCreate: () => store.index() } });
// 或者
useCable(store, { taIndexViewRef: taIndexViewRef });
```

后端部分:

```ruby
class ModelSetting < ApplicationRecord
  include Com::Model::ModelSetting

  sync_broadcasts
  # or
  broadcasts
end
```

redis.rb

```ruby
$broadcast_redis = Redis::Namespace.new(:broadcast, redis: $redis)
```

nginx

```nginx
# WebSocket support
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```
