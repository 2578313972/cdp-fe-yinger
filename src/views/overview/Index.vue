<template>
    <component :is="roleMap[userId]"></component>
</template>
<script>
    import Admin from './Admin.vue';
    import AdminInsight from './AdminInsight.vue';
    import Channel from './Channel.vue';
    import Node from './Node.vue';
    import NodeOperator from './NodeOperator.vue';

    export default {
        name: 'Overview',
        components: {
            Admin,
            AdminInsight,
            Channel,
            Node,
            NodeOperator
        },
        data() {
            return {
                userId: this.$config.login_info.auth_info.role_id,
                roleMap: {
                    ROLE_C_ADMIN: Channel,
                    ROLE_T_ADMIN: Admin,
                    ROLE_T_VIEWER: AdminInsight,
                    ROLE_D_ADMIN: Node,
                    ROLE_D_OPERATOR: NodeOperator
                }
            };
        }
    };
</script>
