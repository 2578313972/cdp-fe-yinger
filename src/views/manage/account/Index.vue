<template>
    <div class="channel-manage page-warpper">
        <div class="page-title bottom-shadow page-title-tab">
            <Menu class="pl24" mode="horizontal" theme="light" :active-name="activeName" @on-select="debounceChange">
                <!-- <MenuItem
                    v-for="(item,index) in tabList"
                    :key="index"
                    v-role-button="`${item.roleId}`"
                    :name="`${item.name}`">
                    {{item.roleId}}
                    {{item.label}}
                </MenuItem> -->
                <!-- 因需要对员工账号加控制权限，所以将循环拆开 -->
                <MenuItem
                    v-role-button="`user_account_tab`"
                    key="0"
                    name="innerAccount">
                    员工账号
                </MenuItem>
                <MenuItem
                    key="1"
                    name="outerAccount">
                    外部系统账号
                </MenuItem>
            </Menu>
        </div>
        <div class="page-content page-content-tab container-padding24">
            <component :name="activeName" :is="activeName"></component>
        </div>
    </div>
</template>

<script>
    import innerAccount from './Account.vue';
    import outerAccount from './OuterAccount.vue';

    export default {
        name: 'Account',
        components: {
            innerAccount,
            outerAccount
        },
        data() {
            return {
                active_name: null,
                tabList: [{
                              label: '员工账号',
                              name: 'innerAccount'
                          },
                          {
                              label: '外部系统账号',
                              name: 'outerAccount'
                          }]
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
                    if (role_view[i].id === 'user_account_tab') {
                        isFinded = true;
                        if (!role_view[i].visible) {
                            return 'outerAccount';
                        }
                        return 'innerAccount';
                    }
                }
                if (!isFinded) {
                    return 'outerAccount';
                }
            }
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceChange = this.$lodash.debounce(this.tabChange, timer);
        },
        methods: {
            tabChange(name) {
                this.active_name = name;
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
