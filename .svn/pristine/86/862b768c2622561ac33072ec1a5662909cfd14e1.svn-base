<template>
    <div class="error-wrapper box-vercenter">
        <div class="error-content">
            <div class="error-icon"></div>
            <div class="error-tip">尚未授权登录角色，请联系管理员</div>
            <div class="logout-btn">
                <a class="logout-btn" href="javascript:;" @click="logout">重新登录</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {
            logout() {
                if (this.$config.sys_config.logout_url) {
                    window.location.replace(this.$config.sys_config.logout_url);
                }
            }
        },
        mounted() {}
    };
</script>
