import Vue from 'vue';
import Router from 'vue-router';
import routers from './router';
import iView from 'iview';
import axios from '@/utils/axios';
import config from '@/utils/config';
import _ from 'lodash';
import WebsocketHeartbeatJs from 'websocket-heartbeat-js';

import StrategyApi from '@/components/strategy/strategyApi';


Vue.use(Router);


function Session(session) {
    return {
        getTabview() {
            return {
                public: '公共的',
                self: '私有的',
                group: '运营组的',
                node: '同节点其他的',
                subordinate: '下级的'
            };
        },
        getGroups() {
            return session.groups;
        },
        isInGroup(groupId) {
            return session.groups.find((item) => {
                if (item.group_id === groupId) {
                    return true;
                }
            });
        },
        isMyRes(res) {
            if (!!res && res.visibility === 'self') {
                return res.owner === session.user_info.user_id;
            }
            return false;
        },
        getCurrentChannelCode() {
            return session.cur_channel_id;
        },
        getOrgId() {
            return session.auth_info.org_id;
        },
        getHierarchyId() {
            return session.auth_info.org_hierarchy_id;
        },
        getViewScope(res) {
            if (!res) {
                return null;
            }
            if (res.visibility === 'public') {
                return 'public';
            }
            /**
             * 如果当前账号org_hierarchy_id不为空，节点管理员，节点运营专员
             */
            if (res.org_hierarchy_id) {
                if (res.org_hierarchy_id == this.getHierarchyId()) {
                    if (res.visibility == 'self') {
                        if (this.isMyRes(res)) {
                            return 'self';
                        }
                        return 'node';
                    }
                    if (res.visibility == 'group') {
                        if (this.isInGroup(res.group_id)) {
                            return 'group';
                        }
                        return 'node';
                    }
                    return res.visibility;
                }
                return 'subordinate';
            }
            /**
             *  渠道管理员 节点管理员 节点运营专员
             * 如果res.org_hierarchy_id为空 并且group_id为空 就是渠道管理员
             */

            if (!res.org_hierarchy_id) {
                if (this.isMyRes(res)) {
                    return 'self';
                }
                return 'node';
            }
            return 'subordinate';
        }
    };
}

const router = new Router({
    routes: routers,
    // fallback:true,
    scrollBehavior() {
        // 每次切换路由回顶部开始查看
        const mainRight = document.getElementsByClassName('main-right')[0];
        mainRight && (mainRight.scrollTop = 0);
    }
});

function splitCurRouter(toPath) {
    if (toPath.split('/').length > 2) {
        config.login_info.current_router = `/${toPath.split('/')[1]}`;
    } else {
        config.login_info.current_router = toPath;
    }
}

/** 获取当前用户的所有信息 */
function getSession(to, from, next) {
    axios
        .get(`${config.apiDomain}/user/session`)
        .then((res) => {
            hideLoading();
            // 菜单为空时跳转到没有权限错误页
            if (
                !(
                    res.data.role_view
                    && res.data.role_view.menus
                    && !!res.data.role_view.menus.length
                )
            ) {
                noAuthFlag = true;
                hideErrorPage();
                splitCurRouter('/home');
                next({
                    path: '/error'
                });
                return;
            }

            /** 添加新的菜单tab页 */
            if (res.data.cur_channel_id === 'c2') {
                const markeCampaign = {
                    children: [
                        { name: '生活日历', path: '/calendarLife' },
                        { name: '营销整体概览', path: '/overallOverview' },
                        { name: '营销分析管理', path: '/analysisManagement' },
                        { name: '营销分析对比管理', path: '/analysisContrastManagement' },
                        { name: '营销分析看板', path: '/analysisKanban' }
                    ],
                    icon: 'md-chatbubbles',
                    name: '营销活动管理',
                    path: ''
                };
                const analysisPeople = {
                    children: [
                        { name: '营销人群管理', path: '/crowdManagement' },
                        { name: '人群分析对比管理', path: '/crowdContrastManagement' },
                        { name: '人群分析看板', path: '/crowdKanban' }
                    ],
                    icon: 'ios-people',
                    name: '人群分析',
                    path: ''
                };
                const returnAnalysis = {
                    children: [
                        { name: '回访看板', path: '/visitKanban' }
                    ],
                    icon: 'ios-sync',
                    name: '回访分析',
                    path: ''
                };

                const dataDownload = {
                    children: [
                        { name: '数据下载', path: '/dataDown' }
                    ],
                    icon: 'md-download',
                    name: '数据下载',
                    path: ''
                };
            //    res.data.role_view.menus.push(markeCampaign, returnAnalysis);
               res.data.role_view.menus.push(markeCampaign, analysisPeople, returnAnalysis, dataDownload);
            }


            wsSession(res.data.session_id);

            getBaseTypeOperationCache();
            setVueSession(res.data);
            setLoginInfo(res.data);

            setMenuList(res.data);
            setButtonItems(res.data);

            splitCurRouter(to.path);

            // 当用户已登录，访问了没有权限的页面，跳转到首页
            const curPath = config.login_info.current_router;
            if (config.login_info.menuListArr.indexOf(curPath) != -1) {
                next();
            } else {
                next('/');
            }
        })
        // 若session接口返回401，则跳到error页面
        .catch((err) => {
            hideLoading();
            showErrorPage();

            if (
                err.response
                && (err.response.status == 401 || err.response.status == 403)
                && to.path != '/error'
            ) {
                hideErrorPage();
                next({
                    path: '/error'
                });
            } else {
                hideErrorPage();
                // 登录过期时，跳转到登录页面不需要next()，防止浏览器有报错
                if (err.response && err.response.status != 401) {
                    next();
                }
            }
        });
}
// 加载策略缓存数据
function getBaseTypeOperationCache() {
    StrategyApi.initBaseTypeOperationCache()
        .then(() => {})
        .catch(() => {});
}
function setVueSession(data) {
    Vue.prototype.$session = global.$session = Session(data);
}
function setButtonItems(data) {
    const buttonList = data.role_view.buttons || [];
    const buttonItems = {};
    buttonList.forEach((button) => {
        buttonItems[button.id] = button;
    });
    config.login_info.buttonItems = buttonItems;
}
function setLoginInfo(data) {
    data.role_view.menus.forEach((item, index) => {
        item.idx = index;
        if (item.children) {
            (function setIndex(i) {
                i.children.forEach((sItem, sIndex) => {
                    sItem.idx = `${i.idx}-${sIndex}`;
                    if (sItem.children) setIndex(sItem);
                });
            }(item));
        }
    });
    // 添加current_router防止beforeEach重连ws
    data.current_router = config.login_info.current_router;
    config.login_info = data;
    /** 此处添加 c2权限的路由  防止在跳路由时回到 /home */
    // if (config.login_info.cur_channel_id === 'c2') {
    //     config.login_info.menuListArr.push(
    //         '/calendarLife',
    //         '/overallOverview',
    //         '/analysisManagement',
    //         '/analysisContrastManagement',
    //         '/analysisKanban'
    //     );
    // }
}
/** 设置菜单栏的数组数据 */
function setMenuList(data) {
    const menuList = data.role_view.menus;
    const menuArr = [];
    let _index = 0;
    data.iframeUrl = [];
    (function findOpen(list = []) {
        list.map((item) => {
            // 添加外部概览iframe，!item.children过滤目录不可点击
            if (item.type === 'outer' && !item.children) {
                if (data.iframeUrl.length >= config.iframeCount) {
                    // 大于指定iframe个数，设置name为空来做判断处理
                    item.name = '';
                } else {
                    const cloneItem = _.cloneDeep(item);
                    const hasDomain = cloneItem.path.indexOf('http') !== -1;
                    data.iframeUrl.push(hasDomain ? cloneItem.path : `${window.location.protocol}//${cloneItem.path}`);
                    item.path = `/outer${_index++}`;
                }
            }
            if (item.path != '' && !item.children && item.name) {
                menuArr.push(item.path);
            } else if (item.children) findOpen(item.children);
        });
    }(menuList));
    config.login_info.menuListArr = menuArr;
    // debugger;
}
/** 重新设置时才会触发 */
function resetSession() {
    axios.get(`${config.apiDomain}/user/session`).then((res) => {
        setVueSession(res.data);
        setLoginInfo(res.data);
        setMenuList(res.data);
        setButtonItems(res.data);
    });
}

function hideLoading() {
    const loadingEl = document.getElementById('loading');
    loadingEl && (loadingEl.style.display = 'none');
}

const errorEl = document.getElementById('error-page');
function showErrorPage() {
    errorEl && (errorEl.style.display = 'block');
    iView.Message.destroy();
    iView.LoadingBar.error();
}

function hideErrorPage() {
    errorEl && (errorEl.style.display = 'none');
}

document.getElementById('reload-page').addEventListener('click', () => {
    window.location.reload();
});

// 长连接监听权限是否有变化
// 断网重连可以考虑检测网络 https://github.com/hubspot/offline
// let Socket = window.MozWebSocket || window.WebSocket
// 避免ws重复连接
// let lockReconnect = false;
// let websocket_connected_count = 0;
// function wsSession(session_id) {
//     let websocket = null;
//     // 判断当前环境是否支持websocket
//     if (!!Socket) {
//         if (!websocket) {
//             let ws_url = `${config.apiDomain}/socket/user/session/${session_id}`.replace("http", "ws");
//             websocket = new Socket(ws_url);
//         }
//     } else {
//         console.log("not support websocket");
//     }

//     // 连接成功建立的回调方法
//     websocket.onopen = function (e) {
//         // 成功建立连接后，重置心跳检测
//         heartCheck.reset().start();
//         console.log("connected successfully")
//     }

//     // 接受到服务端关闭连接时的回调方法
//     websocket.onclose = function () {
//         console.log("onclose断开连接");
//         reconnect(session_id)
//     }

//     // 连接发生错误
//     websocket.onerror = function () {
//         console.log("onerror连接发生错误")
//         reconnect(session_id)
//     }
//     // 接受到消息的回调方法
//     websocket.onmessage = function (e) {
//         // 如果获取到消息，说明连接是正常的，重置心跳检测
//         heartCheck.reset().start();
//         let message = e.data;
//         if (message) {
//             console.log('session change');
//             iView.Modal.confirm({
//                 title: '权限更新',
//                 okText: '重新载入',
//                 cancelText: '忽略',
//                 content: '您当前的角色权限已发生变更，建议重新载入页面',
//                 onOk: () => {
//                     location.reload();
//                 }
//             });
//             resetSession();
//         }
//     }

//     // 监听窗口事件，当窗口关闭时，主动断开websocket连接，防止连接没断开就关闭窗口，server端报错
//     window.onbeforeunload = function () {
//         websocket.close();
//     }

//     // 连接断开/错误时会继续尝试发起连接（尝试10次）
//     let reconnect = function (session_id) {
//         lockReconnect = true;
//         if (!lockReconnect && ++websocket_connected_count <= 10) {
//             wsSession(session_id)
//             lockReconnect = false;
//         }
//     }

//     // 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连
//     // 30s发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间
//     let heartCheck = {
//         timeout: 30000,
//         serverTimeoutObj: null,
//         reset: function () {
//             clearTimeout(this.serverTimeoutObj);
//             return this;
//         },
//         start: function () {
//             this.serverTimeoutObj = setTimeout(function () {
//                 if (websocket.readyState == 1) {
//                     console.log("连接状态，发送消息保持连接");
//                     websocket.send("ping");
//                     // 如果获取到消息，说明连接是正常的，重置心跳检测
//                     heartCheck.reset().start();
//                 } else {
//                     console.log("断开状态，尝试重连");
//                     wsSession(session_id);
//                 }
//             }, this.timeout)
//         }
//     }
// }

// 使用websocket-heartbeat-js优化断网情况重连
function wsSession(session_id) {
    const websocketHeartbeatJs = new WebsocketHeartbeatJs({
        url: `${config.apiDomain}/socket/user/session/${session_id}`.replace(
            'http',
            'ws'
        ),
        pingTimeout: 30 * 60 * 1000,
        pongTimeout: 29 * 60 * 1000,
        reconnectTimeout: 30000
    });
    websocketHeartbeatJs.onopen = function () {
        console.log('connect success');
    };
    websocketHeartbeatJs.onreconnect = function () {
        console.log('reconnecting...');
    };
    websocketHeartbeatJs.onmessage = function (e) {
        const message = e.data;
        if (message) {
            console.log(`onmessage: ${e.data}`);
            iView.Modal.warning({
                title: '权限更新',
                okText: '返回概览页面',
                cancelText: '忽略',
                content: '您当前的角色权限已发生变更，建议返回概览页面',
                onOk: () => {
                    window.location.href = window.location.origin + window.location.pathname;
                },
                onCancel: () => {
                    // 有权限变更通知时，点击“忽略”主动更新session信息
                    resetSession();
                }
            });
        }
    };
}

let noAuthFlag = false;
function delayRouter(to, from, next, path) {
    // 防止从其他路由切换到 home 概览页菜单卡顿
    if (to.path === '/home' || to.path.indexOf('/outer') !== -1) {
        clearTimeout(delayRouterTimer);
        let delayRouterTimer = setTimeout(() => {
            next(path);
        }, 300);
    } else {
        next(path);
    }
}
router.beforeEach((to, from, next) => {
    // 防止人群、特性切换路由-添加tabView参数时，执行两遍（trait => trait?tabView='xxx'）
    if (
        (to.path === '/crowd' || to.path === '/trait')
        && !!to.query.tabView
        && !!from.name
    ) {
        config.login_info.current_router = to.path;
        delayRouter(to, from, next);
        return;
    }

    if (config.login_info.current_router) {
        splitCurRouter(to.path);
        const currentRouter = config.login_info.current_router;
        if (
            (currentRouter == '/error' || config.login_info.menuListArr.indexOf(currentRouter) == -1) && !noAuthFlag
        ) {
            delayRouter(to, from, next, '/');
        } else {
            delayRouter(to, from, next);
        }
        return;
    }
    axios
        .get(`${config.apiDomain}/sys/config`)
        .then(({ data }) => {
            hideLoading();

            config.sys_config = data;
            config.status_config = data.display_dic;
            config.status_config = _.assign(
                config.status_config,
                data.display_dic
            );
            getSession(to, from, next);
        })
        .catch(() => {
            hideLoading();
            showErrorPage();
        });
});

export default router;
