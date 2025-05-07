import { VObject, VStore } from '@/lib/vails';
import { plural } from 'pluralize';
import { ComEndpointsFetchDataByKeysApi } from '../apis/com/endpoint/fetch_data_by_keys.api';
import { cloneDeep } from 'lodash';
import { Ref } from 'vue';

// export interface TaCableCenterSubscription {
//   store: VStore;
// }

// {
//   "action": "update",
//   "target": {
//       "id": "5995",
//       "key": "IiM8VXNlcjoweDAwMDAwMDAxMTg1OWRkYTA+Ig==--35e8b31d33391534d45f9580601829122acc2b8e5867a46149241c3548dfcf62"
//   }
// }
export interface CableMessage {
  store: VStore<any>;
  message: CableMessageContent;
}

export interface CableMessageContent {
  action: 'create' | 'update' | 'destroy';
  target: VObject;
}

export interface TaCableStoreCenterSubscriptionOptions {
  callback?: { afterCreate?: (data: VObject) => void; afterUpdate?: (data: VObject) => void };
  taIndexViewRef?: Ref<any>;
  // afterUpdate?: (data: VObject) => void;
  // afterDelete?: (data: VObject) => void;
}

export default class TaCableStoreCenter {
  consumer: ActionCable.Consumer;
  // subscriptions: VStore[] = [];
  mapping = new Map<string, Map<number, Set<VStore>>>();
  storeSeq2SubscriptionOptions = new Map<number, TaCableStoreCenterSubscriptionOptions>();

  pendingMessages: CableMessage[] = [];
  timer: NodeJS.Timeout | null = null;

  constructor(consumer: ActionCable.Consumer) {
    this.consumer = consumer;
  }

  getStoreKey(store: VStore<any>) {
    return store.extra?.cable_key || plural(store.api.name);
  }

  registerMappingForStoreWithId(
    store: VStore,
    id: number,
    mode: 'collection' | 'member' = 'collection',
  ) {
    const key = [this.getStoreKey(store), mode].join(':');
    console.log(key, 'key');

    if (!this.mapping.has(key)) {
      this.mapping.set(key, new Map<number, Set<VStore<any>>>());
    }

    const subMap = this.mapping.get(key)!;

    if (!subMap.has(id)) {
      subMap.set(id, new Set<VStore<any>>());
    }

    subMap.get(id)!.add(store);

    if (key === 'serve_packs:member') {
      console.log(subMap, 'subMap');
    }
  }

  deleteMappingForStore(store: VStore<any>) {
    this.mapping.forEach(subMap => {
      subMap.forEach(stores => {
        stores.delete(store);
      });
    });
  }

  registerStore(store: VStore, options: TaCableStoreCenterSubscriptionOptions) {
    this.storeSeq2SubscriptionOptions.set(store.seq, options);

    const subscription = this.consumer.subscriptions.create(
      {
        channel: 'Com::StreamsChannel',
        signed_stream_name: this.getStoreKey(store),
      },
      {
        received: (data: any) => {
          this.processMessage(data, store);
        },
      },
    );

    const subscriptionExists =
      this.consumer.subscriptions['findAll'](subscription.identifier).length > 1;
    if (subscriptionExists) {
      this.consumer.subscriptions['confirmSubscription'](subscription.identifier);
    }

    store.afterIndex(async (res: VObject) => {
      (res.data[store.api.dataIndexKey] || []).forEach((item: VObject) => {
        this.registerMappingForStoreWithId(store, item.id, 'collection');
      });
    });

    store.afterFind(async (data: VObject) => {
      this.registerMappingForStoreWithId(store, data.data.id, 'member');
    });
  }

  processMessage(message: CableMessageContent, store: VStore<any>) {
    this.pendingMessages.push({ message, store });

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.processPendingMessages();
    }, 500);
  }

  getStoreById(store: VStore<any>, id: number, mode: 'collection' | 'member' = 'collection') {
    const key = [this.getStoreKey(store), mode].join(':');
    const subMap = this.mapping.get(key);

    if (subMap && subMap.has(id)) {
      return subMap.get(id);
    }

    return null;
  }

  async processPendingMessages() {
    const keys = this.pendingMessages.map(message => message.message.target?.key).filter(i => i);
    const { data } = await new ComEndpointsFetchDataByKeysApi().create(
      {},
      {
        data: {
          keys: keys.join(','),
        },
      },
    );

    this.pendingMessages.forEach(message => {
      const { message: messageContent, store } = message;
      const { action, target } = messageContent;
      const { key } = target;
      const id = Number(target.id);

      const obj = data[key];
      this.pendingMessages = [];
      this.timer = null;
      // console.log('processPendingMessages obj', obj, action);

      if (obj) {
        switch (action) {
          case 'create':
            // 创建时，id 未在前端注册
            // console.log('store', store, this.storeSeq2SubscriptionOptions.get(store.seq));

            if (this.storeSeq2SubscriptionOptions.get(store.seq)?.taIndexViewRef?.value) {
              this.storeSeq2SubscriptionOptions
                .get(store.seq)
                ?.taIndexViewRef?.value?.silenceRefresh?.();
            } else {
              this.storeSeq2SubscriptionOptions.get(store.seq)?.callback?.afterCreate?.(obj);
            }
            break;
          case 'update':
            this.getStoreById(store, id)?.forEach(s => {
              s.updateRecord(obj);
            });

            this.getStoreById(store, id, 'member')?.forEach(s => {
              s.updateRecord(obj);
            });

            this.storeSeq2SubscriptionOptions.get(store.seq)?.callback?.afterUpdate?.(obj);
            break;
          case 'destroy':
            this.getStoreById(store, id)?.forEach(s => {
              s.deleteRecord(obj.id);
            });

            this.getStoreById(store, id, 'member')?.forEach(s => {
              s.deleteRecord(obj.id);
            });
            break;
        }
      }
      // this.mapping.forEach((subMap, key) => {
      //   if (subMap.has(id)) {
      //     subMap.get(id)!.forEach(store => {
      //       switch (message.action) {
      //         case 'create':
      //           store.addRecord(target);
      //           break;
      //         case 'update':
      //           store.updateRecord(target);
      //           break;
      //         case 'delete':
      //           store.deleteRecord(target);
      //           break;
      //       }
      //     });
      //   }
      // });
    });
  }
}
