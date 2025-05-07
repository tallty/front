<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { VObject, VStore } from '@/lib/vails';
import ComResAdminUserIndex from '@/engines/res/components/res/admin/users/ComResAdminUserIndex.vue';
import { ResAdminUsersApi } from '@/engines/res/res-core/apis/res/admin/users.api';
import { ResUserModel } from '@/engines/res/res-core/models/res/user';
import { ResMembershipModel } from '@/engines/res/res-core/models/res/membership';
import { ResAdminMembershipsApi } from '@/engines/res/res-core/apis/res/admin/memberships.api';
import { ResAdminMemberIdentityApi } from '@/engines/res/res-core/apis/res/admin/member_identity.api';
import { ResMemberIdentityModel } from '@/engines/res/res-core/models/res/member_identity';
import { ResAdminTagsRelationApi } from '@/engines/res/res-core/apis/res/admin/tags_relation.api';
import { ResTagsRelationModel } from '@/engines/res/res-core/models/res/tags_relation';
import { ResAdminMembersApi } from '@/engines/res/res-core/apis/res/admin/members.api';
import { ResMemberModel } from '@/engines/res/res-core/models/res/member';

const ResAdminUsersIndex = defineComponent({
  name: 'ResAdminUsersIndex',
  components: {
    ComResAdminUserIndex,
  },
  setup() {
    const store = new VStore(new ResAdminUsersApi(), ResUserModel);
    const memberStore = new VStore(new ResAdminMembersApi(), ResMemberModel);

    const membershipStore = new VStore(new ResAdminMembershipsApi(), ResMembershipModel);

    const identityStore = new VStore(new ResAdminMemberIdentityApi(), ResMemberIdentityModel);
    const tagRelationStore = new VStore(new ResAdminTagsRelationApi(), ResTagsRelationModel);

    const onIdentitySelect = (data: VObject) => {
      memberStore.api = new ResAdminMembersApi({
        params: { q: { member_identity_id_eq: data.identityId } },
      });
    };

    return {
      store,
      memberStore,
      membershipStore,
      identityStore,
      tagRelationStore,
      onIdentitySelect,
    };
  },
});

export default ResAdminUsersIndex;
</script>

<template lang="pug">
.res-admin-users-index
  ComResAdminUserIndex(
    :store='store',
    :memberStore='memberStore',
    :membershipStore='membershipStore',
    :identityStore='identityStore',
    :tagRelationStore='tagRelationStore',
    @onIdentitySelect='onIdentitySelect'
  )
</template>

<style lang="stylus" scoped>
.res-admin-users-index
  height 100%
  width 100%
</style>
