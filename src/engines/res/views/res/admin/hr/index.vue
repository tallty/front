<script lang="ts">
import { ref, defineComponent, toRefs } from 'vue';
import ComResAdminUserIndex from '@/engines/res/components/res/admin/users/ComResAdminUserIndex.vue';
import { VStore } from '@/lib/vails';
import { ResAdminMembersApi } from '@/engines/res/res-core/apis/res/admin/members.api';
import { ResAdminUsersApi } from '@/engines/res/res-core/apis/res/admin/users.api';
import { ResUserModel } from '@/engines/res/res-core/models/res/user';
import { ResAdminMembershipsApi } from '@/engines/res/res-core/apis/res/admin/memberships.api';
import { ResMemberModel } from '@/engines/res/res-core/models/res/member';
import { ResMembershipModel } from '@/engines/res/res-core/models/res/membership';
import { ResAdminMemberIdentityApi } from '@/engines/res/res-core/apis/res/admin/member_identity.api';
import { ResAdminTagsRelationApi } from '@/engines/res/res-core/apis/res/admin/tags_relation.api';
import { ResMemberIdentityModel } from '@/engines/res/res-core/models/res/member_identity';
import { ResTagsRelationModel } from '@/engines/res/res-core/models/res/tags_relation';
import { useRoute } from 'vue-router';
const hrResAdminIndex = defineComponent({
  name: 'hrResAdminIndex',
  components: { ComResAdminUserIndex },
  props: {},
  setup(props) {
    const store = new VStore(new ResAdminUsersApi(), ResUserModel);
    const memberStore = new VStore(new ResAdminMembersApi(), ResMemberModel);

    const membershipStore = new VStore(new ResAdminMembershipsApi(), ResMembershipModel);

    const identityStore = new VStore(new ResAdminMemberIdentityApi(), ResMemberIdentityModel);
    const tagRelationStore = new VStore(new ResAdminTagsRelationApi(), ResTagsRelationModel);
    const route = useRoute();
    console.log(route.params.id);
    const onIdentitySelect = (id: number) => {
      memberStore.api = new ResAdminMembersApi({
        params: { q: { member_identity_id_eq: id } },
      });
    };

    return {
      ...toRefs(props),
      store,
      memberStore,
      membershipStore,
      identityStore,
      tagRelationStore,
      onIdentitySelect,
      route,
    };
  },
});
export default hrResAdminIndex;
</script>

<template lang="pug">
.hr-res-admin-index
  ComResAdminUserIndex.admin-index(
    :store='store',
    :memberStore='memberStore',
    :membershipStore='membershipStore',
    :identityStore='identityStore',
    :tagRelationStore='tagRelationStore',
    @onIdentitySelect='onIdentitySelect',
    :memberIdentityId='route.params.id',
    leftHide=true,
    )
</template>

<style lang="stylus" scoped>
.hr-res-admin-index
  width 100%
  height 100%
  .admin-index
    >>>.right-side
      width 100% !important
</style>
