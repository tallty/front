import { VersionRelationshipsApi } from '../apis/version_relationships.api';
import { VStore } from '@/lib/vails';
import { VersionRelationshipModel } from '../models/version_relationships';

export const useVersionRelationships = (props: any) => {
  const namespace =
    props.namespace || props.store.api.getMemberPath(props.id || props.store.record.value.id);

  const relationshipStore = new VStore(
    new VersionRelationshipsApi({
      namespace,
    }),
    VersionRelationshipModel,
  );

  const fetchData = async () => {
    relationshipStore.index({ per_page: 999999, q: { s: ['created_at asc'] } });
  };

  return {
    versionRelationships: relationshipStore.records,
    relationshipStore,
    fetchData,
  };
};
