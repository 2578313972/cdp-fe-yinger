<template>
    <component :is="roleMap[userId]"></component>
</template>
<script>
    import ChannelMember from './ChannelMember.vue';
    import Specialist from '@/views/manage/authorization/Specialist.vue';

    export default {
        name: 'Member',
        components: {
            ChannelMember,
            Specialist
        },
        data() {
            return {
                userId: this.$config.login_info.auth_info.role_id,
                roleMap: {
                    ROLE_D_ADMIN: ChannelMember,
                    ROLE_C_ADMIN: Specialist
                }
            };
        }
    };
</script>
<style lang="less" scoped>

</style>
