<template>
<div class="warpper-box">
    <div class="header-menu">
        <div class="header-left">
            <div class="left-logo">
                <div class="single-graph"></div>
                <!-- <img src="@/assets/images/logo-min.jpg">
                <span class="text-hide">{{ siteName }}</span> -->
            </div>
        </div>
        <div class="header-right">
            <div class="hr-box">
                <div class="hr-left" v-if="authInfo.role_id==='ROLE_C_ADMIN'||authInfo.role_id==='ROLE_D_ADMIN'||authInfo.role_id==='ROLE_D_OPERATOR'">
                    <Dropdown trigger="click" placement="bottom-start" @on-click="changeRole">
                        <a class="hr-menu-text" href="javascript:void(0)">
                            <span class="iconfont icon-device_widgets"></span>
                            <span class="hr-menu-name">{{channel_name}}</span>
                            <span class="iconfont icon-nav_arrow_drop_down"></span>
                        </a>
                        <DropdownMenu slot="list" style="max-height:433px;overflow-y:auto;">
                            <DropdownItem v-for="(item,index) in channelList" :key="index" :name="item.channel_id" :selected="item.channel_id === channelId">
                                <div class="role-list-box">
                                    <i class="role-icon" :class="item.icon_type"></i>
                                    <div class="role-name-box">
                                        <p class="channel-title">{{item.channel_name}}（{{item.channel_id}}）</p>
                                        <p class="channel-name">
                                            {{item.role_name}}
                                            <span v-if="item.org_id">( {{item.org_name}} )</span>
                                        </p>
                                    </div>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div class="hr-right">
                    <span @click="handleMsg">
                        <Badge dot :count="unReadNum">
                            <Icon color="#CCE1FA" size="24" type="md-notifications" />
                        </Badge>
                    </span>
                    <Drawer v-model="f_notice" width="600" :mask-closable="false">
                        <div slot="title"></div>
                        <prompt v-if="f_notice" :unread="unReadNum" v-on:get-unread-msg="getUnreadMsg"></prompt>
                    </Drawer>

                    <Dropdown placement="bottom-end" @on-click="userDropdown">
                        <span class="hr-avatar">{{userName.charAt()}}</span>
                        <DropdownMenu slot="list" style="padding:10px 0;">
                            <DropdownItem style="pt10">
                                <span class="hr-avatar l-avatar">{{userName.charAt()}}</span><span class="hr-username-box">{{userName}}（<i class="role-name">{{roleName}}</i>）</span>
                            </DropdownItem>
                            <DropdownItem v-role-button="`modify_password_button`" name="0">
                                <span class="user-icon f24 iconfont icon-action_settings"></span>
                                修改密码
                            </DropdownItem>
                            <DropdownItem name="1">
                                <span class="user-icon f24 iconfont icon-action_exit_to_app"></span>
                                退出登录
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Drawer v-model="f_changePassword" width="600" :mask-closable="false">
                        <div slot="title"></div>
                        <password v-if="f_changePassword" @cancel="cancel"></password>
                    </Drawer>
                </div>
            </div>
        </div>
    </div>
    <div class="main-box">
        <div class="main-left">
            <Layout
            :style="{minHeight: '100vh'}"
            class="td-layout-light"
            >
                <Sider
                        collapsible
                        :collapsed-width="78"
                        v-model="isCollapsed"
                        @on-collapse="layoutCollapse"
                        width="220px"
                        >
                        <div
                            class="left-submenu"
                            :style="{bottom: menu_bottom_height}"
                            ref="menu-scrollbar"
                            v-if="menu.list.length">
                            <Menu
                                ref="menu"
                                :active-name="menu.activeName"
                                :open-names="menu.openName"
                                accordion
                                @on-open-change="openChange"
                                @on-select="submenuChange"
                                style="width:100%;">
                                <template v-for="(item,index) in menu.list">
                                    <router-link :to="item.path" :key="index" v-if="!item.children">
                                        <MenuItem v-el-title="item.name" :name="`${item.idx}`">
                                            <Icon :type="item.icon||'md-list-box'"></Icon>{{item.name}}
                                        </MenuItem>
                                    </router-link>
                                    <ItemMenu v-else :key="index" :data="item" hasIcon></ItemMenu>
                                </template>
                            </Menu>
                        </div>
                </Sider>
            </Layout>
        </div>
        <div class="main-right">
            <div class="container-min-width">
                <router-view></router-view>
            </div>
        </div>
    </div>
</div>

</template>

<script>
    import ItemMenu from './ItemMenu';
    import Password from '@/views/home/Password';
    import Prompt from '@/views/home/Prompt';

    export default {
        data() {
            return {
                channelList: [],
                channelId: '',
                isCollapsed: false,
                siteName: '',
                userName: '',
                roleName: '', // 角色名
                channel_name: '', // 渠道名
                authInfo: {}, // 节点管理员信息
                isChannelPointer: !!this.$config.login_info.user_channels.length,
                menu: {
                    activeName: '',
                    openName: [],
                    list: []
                },
                f_notice: false, // 消息提醒
                f_changePassword: false, // 修改密码
                unReadNum: 0
            };
        },
        components: {
            ItemMenu,
            Prompt,
            Password
        },
        created() {
            this.getUnreadMsg();
            setInterval(this.getUnreadMsg, 600000);
        },
        mounted() {
            this.init();
        },
        watch: {
            $route(to) {
                // 特性管理依赖关系详情跳转至人群管理（高亮）详情，或后退时高亮特性
                if (to.path === '/crowd/detail' || to.path === '/trait/detail') {
                    this.$config.login_info.current_router = `/${to.path.split('/')[1]}`;
                } else if (to.path === '/home') {
                    // 访问没有权限或者错误路由时，跳转到首页并高亮
                    this.$config.login_info.current_router = '/home';
                } else if (to.path.split('/').length > 2) {
                    return;
                }
                this.getActiveMenu();
            }
        },
        methods: {
            layoutCollapse(data) {
                if (data) {
                    this.menu.openName = [];
                    this.$nextTick(() => {
                        this.$refs.menu.updateOpened();
                    });
                }
            },

            init() {
                // init username
                this.getUserName();
                // init menu
                this.getMemuList();
                // 获取渠道
                this.getChanneList();
            },

            getChanneList() {
                this.channelId = this.$config.login_info.cur_channel_id;
                const user_channels = this.$config.login_info.user_channels;
                user_channels.forEach((item) => {
                    if (item.channel_id == this.channel_id) this.$set(item, 'active', true);
                });
                this.channelList = user_channels;
            },

            changeRole(id) {
                if (this.channelId == id) return; // 当前角色
                this.$axios.put(`${this.$config.apiDomain}/user/channel?channel_id=${id}&is_setting_default=false`)
                    .then(() => {
                        window.location.href = window.location.origin + window.location.pathname;
                    });
            },

            getUserName() {
                this.siteName = this.$config.sys_config.themes.title || 'Smart Marketing Hub';
                this.roleName = this.$config.login_info.role_name;
                this.userName = this.$config.login_info.user_info.name;
                this.channel_name = this.$config.login_info.cur_channel_name;
                this.authInfo = this.$config.login_info.auth_info;
            },

            userDropdown(name) {
                if (name === '0') { // 修改密码
                    this.f_changePassword = true;
                }
                if (name === '1') {
                    // 退出
                    if (this.$config.sys_config.logout_url) {
                        window.location.replace(this.$config.sys_config.logout_url);
                    }
                }
            },

            // get菜单list
            getMemuList() {
                this.menu.list = this.$config.login_info.role_view.menus;
                this.$nextTick(() => {
                    // init menu scroll
                    this.getActiveMenu();
                    this.Scrollbar.init(this.$refs['menu-scrollbar']);
                });
            },

            // update active menu
            getActiveMenu() {
                const curPath = this.$config.login_info.current_router;
                const menuList = this.$config.login_info.role_view.menus;
                let openMenu = [];
                let activeMenu = '';
                (function findOpen(list = []) {
                    list.map((item) => {
                        if (item.path === curPath) {
                            activeMenu = `${item.idx}`;
                            if (activeMenu.indexOf('-') < 0) {
                                openMenu = [];
                                return;
                            }
                            const x = activeMenu.split('-');
                            openMenu = [];
                            for (let i = 0; i < x.length - 1; i++) {
                                (i == 0) ? (openMenu.push(`${x[i]}`)) : (openMenu.push(`${openMenu[i - 1]}-${x[i]}`));
                            }
                        } else if (item.children) findOpen(item.children);
                    });
                }(menuList));

                // 判断菜单是否是折叠状态，是：只更新状态，防止路由改变时展开二级菜单
                if (!this.isCollapsed) {
                    this.menu.openName = openMenu;
                }
                this.menu.activeName = activeMenu;
                this.$nextTick(() => {
                    if (!this.isCollapsed) {
                        !this.isCollapsed && this.$refs.menu.updateOpened();
                    }
                    this.$refs.menu.updateActiveName();
                });
            },

            // open menu
            openChange(arr) {
                this.menu.openName = arr;
                if (arr.length) {
                    this.isCollapsed = false;
                }
            },

            // click menu
            submenuChange(val) {
                if (val === '0') {
                    this.menu.openName = [];
                    this.$nextTick(() => {
                        this.$refs.menu.updateOpened();
                    });
                }
            },

            // 取消划窗
            cancel(f) {
                this.f_changePassword = f;
            },

            // 点击消息图标触发
            handleMsg() {
                this.f_notice = true;
                this.getUnreadMsg();
            },

            // 获取未读消息数
            getUnreadMsg() {
                const url = `${this.$config.apiDomain}/sys/messages/count/unread`;
                this.$axios
                    .get(url)
                    .then(({ data }) => {
                        this.unReadNum = data.result || 0;
                    });
            }
        },
        computed: {
            // menu_bottom_height 左侧菜单和个人名称兰
            menu_bottom_height() {
                return '112px';
                // if (this.authInfo.role_id === 'ROLE_D_OPERATOR' || this.authInfo.role_id === 'ROLE_D_ADMIN') { // 节点管理员或节点运营专员
                //     return '142px';
                // } if (this.authInfo.role_id === 'ROLE_C_ADMIN') { // 渠道管理员
                //     return '108px';
                // } // 租户洞察与或租户管理员
                // return '74px';
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "~@/assets/styles/menu.less";
    .hr-username-box{
        white-space: nowrap;
        // margin-left: 58px;
    }
    .l-avatar{
        float: left;
    }
    .channel-box{
        transition: all .2s ease-in-out;
        color: rgba(255,255,255,.7);
        position: relative;
        pointer-events: none;
        // border-top: 1px rgba(200, 200, 200, 0.1) solid;
        // border-bottom: 1px rgba(200, 200, 200, 0.1) solid;
        &.channel-box-active{
            pointer-events: auto;
            cursor: pointer;
            &:hover{
                color: #fff;
            }
        }
        .channel-box-item{
            position: relative;
            margin: 0 40px 0 10px;
            line-height: 32px;
            &+.channel-box-item{
                // border-top: 1px rgba(200, 200, 200, 0.1) dashed;
            }
            i{
                width: 20px;
                position: absolute;
                line-height: 32px;
                display: block;
            }
            span{
                padding-left: 22px;
                width: 100%;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .channel-box-arrow{
            position: absolute;
            right: 10px;
            top: 50%;
            margin-top: -9px;
            font-size: 18px;
        }
    }
    .role-name{
        color: rgba(23,35,61,0.55);
        font-style: normal;
    }
</style>
