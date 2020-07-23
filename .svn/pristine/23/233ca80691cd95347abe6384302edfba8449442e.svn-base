<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
        <Menu class="pl24" mode="horizontal" theme="light" :active-name="activeName" @on-select="debounceSelect">
            <MenuItem name="innerChannel" v-role-button="`cross_channel_access_auth`">跨渠道访问授权</MenuItem>
            <MenuItem name="outerSystem">外部系统访问授权</MenuItem>
        </Menu>
    </div>
    <div class="channel-manage page-content page-content-tab container-padding24">
        <component :name="activeName" :is="activeName"></component>
    </div>
    </div>
</template>

<script>
    import innerChannel from './internal/Index.vue';
    import outerSystem from './outer';

    export default {
        name: 'SystemAuthori',
        components: {
            innerChannel,
            outerSystem
        },
        data() {
            return {
                active_name: null
                // activeName: 'outerSystem'
            };
        },
        computed: {
            activeName() {
                if (this.active_name) {
                    return this.active_name;
                }
                const role_view = this.$config.login_info.role_view.buttons;
                let isFinded = false;
                for (let i = 0; i < role_view.length; i++) {
                    if (role_view[i].id === 'cross_channel_access_auth') {
                        isFinded = true;
                        if (!role_view[i].visible) {
                            return 'outerSystem';
                        }
                        return 'innerChannel';
                    }
                }
                if (!isFinded) {
                    return 'outerSystem';
                }
            }
        },
        created() {
            this.debounceSelect = this.$lodash.debounce(this.tabChange, this.$config.debounce_wait);
        },
        methods: {
            tabChange(name) {
                this.activeName = name;
            }
        },
        watch: {},
        destroyed() {}
    };
</script>

<style lang="less" scoped>

</style>
