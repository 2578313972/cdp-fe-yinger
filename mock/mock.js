// mock 服务
const express = require('express');
const fs = require('fs');

const app = express();
URIList = [
    /* ---- 样例及说明 ------------------------- Start ------------------------------ */
    // {                   // API说明
    //     type:"get",     // 提交方式
    //     url:"...",      // Api的地址
    //     path:"...",     // 数据文件、和content字段互斥，优先path
    //     content:"..."   // 当path没有内容时，使用Content
    // },
    /* ---- 样例及说明 ------------------------- End ------------------------------ */

    /* ---- ywchen ------------------------- Start ------------------------------ */

    { // 统计数列表
        type: 'get',
        url: '/cdp-web/crowds-analytics/weixin/items/1',
        path: './board/text.json'
        // content:"｛id：123｝"
    },
    { // 统计数详情
        type: 'get',
        url: '/cdp-web/crowds-analytics/weixin/items/2',
        path: './board/text.json'
    },
    { // 性别分布
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/items/123',
        path: './board/123.json'
    },
    { // 年龄分布
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/items/456',
        path: './board/456.json'
    },
    { // 性别分布
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/items/*',
        path: './board/xxx.json'
    },
    { // 长期跟踪分析和其它特性
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/tracking/*',
        path: './board/xxx.json'
    },
    { // 特性饱和度分析
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/traits/*',
        path: './board/xxx.json'
    },
    { // 人群数据
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001',
        path: './board/xxx.json'
    },
    { // 人群数据
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/contrast',
        path: './board/xxx.json'
    },
    { // 人群分析里的页面配置
        type: 'get',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/configuration',
        path: './board/configuration.json'
    },
    { // 删除长期跟踪中的某特性
        type: 'delete',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/tracking/*',
        content: ''
    },
    { // 人群分析里的页面配置
        type: 'post',
        url: '/cdp-web/crowds-analytics/CROWD201812210001/tracking/*',
        content: '{"tracking": [{"trait_code": "TS20190000001","trait_name": "年龄"}, {"trait_code": "TS20190000002","trait_name": "性别"}, {"trait_code": "TS20190000003","trait_name": "会员级别"}, {"trait_code": "TS20190000004","trait_name": "居住地址"}, {"trait_code": "TS20190000005","trait_name": "身高"}]}'
    },

    /* ---- ywchen ------------------------- End ------------------------------ */

	/* ---- zkk ------------------------- Start ------------------------------ */
    {
        type: 'get',
        url: '/cdp-web/res-auth/statistics',
        path: './systemAuthori/innerList.json'
    },
    {
        type: 'get',
        url: '/cdp-web/res-auth/source-channel/cur-channel/target-channel/c3/events-auth',
        path: './systemAuthori/eventDetail.json'
    },
    {
        type: 'put',
        url: '/cdp-web/res-auth/source-channel/cur-channel/target-channel/c3/events-auth',
        path: './systemAuthori/eventDetail.json'
	},
	{
        type: 'get',
        url: '/cdp-web/res-auth/source-channel/cur-channel/target-channel/c3/traits-auth',
        path: './systemAuthori/traitDetail.json'
    },
	{
        type: 'put',
        url: '/cdp-web/res-auth/source-channel/cur-channel/target-channel/c3/traits-auth',
        path: './systemAuthori/traitDetail.json'
    },
	/* ---- zkk ------------------------- End ------------------------------ */

    {
        type: 'get', // 外部系统授权账户列表
        url: '/cdp-web/open-platform/auth/list',
        path: './manage/auth/list.json'
    },
    {
        type: 'put', // 外部系统授权账户-授权特性
        url: '/cdp-web/open-platform/auth/modify/*',
        path: './manage/auth/authTrait.json'
    },
    {
        type: 'get', // 人群导出审核详情
        url: '/cdp-web/api/audit/*',
        path: './audit/auditDetail.json'
    },
    {
        type: 'get', // 审核列表
        url: '/cdp-web/api/audit*',
        path: './audit/list.json'
    },
    {
        type: 'get', // 概览-特性/人群数
        url: '/cdp-web/board/resources/preview',
        path: './overview/overview.json'
    },
    {
        type: 'get', // 概览-特性分析列表
        url: '/cdp-web/board/portraits',
        path: './overview/traitList.json'
    },
    {
        type: 'post', // 概览-增加特性
        url: '/cdp-web/board/portraits/traits/*',
        path: './overview/addTrait.json'
    },
    {
        type: 'delete', // 概览-删除特性
        url: '/cdp-web/board/portraits/traits/*',
        content: ''
    },
    {
        type: 'get', // 概览-待审核数
        url: '/cdp-web/board/audit/number?*',
        path: './overview/audit.json'
    },
    {
        type: 'put', // 管理-架构-拖拽接口
        url: '/cdp-web/sys/orgs/*/weight',
        path: './manage/drag.json'
    }
];

URIList.map((item) => {
    app[item.type](item.url, (req, res) => {
        // let rootPath = process.cwd();
        const path = item.path;
        const content = item.content;

        if (path == null || path == '') {
            res.send(content);
            return;
        }

        delete require.cache[require.resolve(path)];
        fs.readFile(require.resolve(path), (err, data) => {
            if (err) {
                throw err;
            }

            res.send(data.toString());
        });

        // delete require.cache[require.resolve(path)]
        // const config = require(path);
        // res.send(config);
    });
});

// 左侧菜单config
app.all('/cdp-web/sys/config', (req, res) => {
    const config = require('./config.json');
    res.send(config);
});
app.all('/cdp-web/user/session', (req, res) => {
    const channel = require('./session.json');
    res.send(channel);
});
app.all('/cdp-web/types/cache', (req, res) => {
    const cache = require('./cache.json');
    res.send(cache);
});

// 左侧菜单项
app.all('/cdp-web/user/channel', (req, res) => {
    const channel = require('./tenantManager.json'); // 租户管理员
    // const channel = require('./channelManager.json');    // 渠道管理员
    res.send(channel);
});

// 获取全部站内信
app.get('/cdp-web/sys/messages/list/all', (req, res) => {
    const messageList = require('./sysMessage/messageList.json');
    res.send(messageList);
});

// 获取未读站内信数
app.get('/cdp-web/sys/messages/count/unread', (req, res) => {
    res.json(4);
});

// 将未读站内信设置为已读
app.put('/cdp-web/sys/messages/read/message-list', (req, res) => {
    res.json();
});

// 渠道管理员-运营架构树
app.get('/cdp-web/sys/orgs/list-orgs', (req, res) => {
    const listOrgs = require('./manage/operationTree.json');
    res.send(listOrgs);
});

// 渠道管理员-运营架构树根节点
app.get('/cdp-web/sys/orgs/list-root-orgs', (req, res) => {
    const listRootOrgs = require('./manage/operationTreeRoot.json');
    res.send(listRootOrgs);
});

// 渠道管理员-修改节点信息
app.put('/cdp-web/sys/orgs/*', (req, res) => {
    res.json();
});

// 渠道管理员-运营资源-资源转移
app.put('/cdp-web/sys/resource/*', (req, res) => {
    const transResource = require('./manage/transResource.json');
    res.send(transResource);
});

// 渠道管理员-运营资源-资源转移-原所属人
app.get('/cdp-web/sys/resource/list-original-operator?*', (req, res) => {
    const oriList = require('./manage/oriList.json');
    res.send(oriList);
});

// 渠道管理员-运营资源-资源转移-目标所属人
app.get('/cdp-web/sys/resource/list-target-operator?*', (req, res) => {
    const targetList = require('./manage/targetList.json');
    res.send(targetList);
});

// 渠道管理员-运营资源-资源转移-原运营组
app.get('/cdp-web/sys/resource/list-original-group?*', (req, res) => {
    const oriGroupList = require('./manage/oriGroupList.json');
    res.send(oriGroupList);
});

// 渠道管理员-运营资源-资源转移-目标运营组
app.get('/cdp-web/sys/resource/list-target-group?*', (req, res) => {
    const targetGroupList = require('./manage/targetGroupList.json');
    res.send(targetGroupList);
});

// 渠道管理员-新增架构节点
app.post('/cdp-web/sys/orgs/dept', (req, res) => {
    res.json('38123189');
});

// 审核-审核控制列表
app.get('/cdp-web/api/audit/query-configs', (req, res) => {
    const auditList = require('./audit/auditControl.json');
    res.send(auditList);
});

// 审核-审核开关控制
app.put('/cdp-web/api/audit/update-config?*', (req, res) => {
    res.json();
});

// 租户管理员-获取渠道数据集
app.get('/cdp-web/sys/channels/', (req, res) => {
    const channelList = require('./manage/channelList.json');
    res.send(channelList);
});

// 租户管理员-取消授权渠道管理员
app.delete('/cdp-web/sys/auth/channels/*', (req, res) => {
    res.json();
});

// 租户管理员-修改渠道名称
app.put('/cdp-web/sys/channels/*', (req, res) => {
    res.json();
});

// 租户管理员-查询已授权管理员
app.get('/cdp-web/sys/auth/channels/*', (req, res) => {
    const managerList = require('./manage/getAuthManager.json');
    res.send(managerList);
});

// 租户管理员-查询需要被授权的渠道管理员
app.get('/cdp-web/sys/auth/channels/*/users', (req, res) => {
    const needManagerList = require('./manage/getNeedManager.json');
    res.send(needManagerList);
});

// 租户管理员-新增授权的渠道管理员
app.post('/cdp-web/sys/auth/channels/*', (req, res) => {
    res.json();
});

// 租户管理员-查询渠道类型
app.get('/cdp-web/sys/channels/type', (req, res) => {
    const channelType = require('./manage/channelType.json');
    res.send(channelType);
});

// 租户管理员-增加渠道
app.post('/cdp-web/sys/channels', (req, res) => {
    res.json();
});

// 渠道管理员-获取公共特性
app.get('/cdp-web/traits?size=-1&type_code=STRING&type_code=STRING_SET&visibility=public', (req, res) => {
    const traitsConfigList = require('./manage/traitsConfigList.json');
    res.send(traitsConfigList);
});

// 数据-特性管理列表
app.get('/cdp-web/traits', (req, res) => {
    const list = require('./trait/list.json');
    res.send(list);
});

// 数据-特性管理详情
app.get('/cdp-web/traits/*', (req, res) => {
    const strategy = require('./trait/strategy.json');
    res.send(strategy);
});

// 用户-人群管理列表
app.get('/cdp-web/crowds', (req, res) => {
    const list = require('./user/list.json');
    res.send(list);
});

// 用户-人群管理详情
app.get('/cdp-web/crowds/combination/*', (req, res) => {
    const crowd = require('./user/crowd.json');
    res.send(crowd);
});

// 节点管理员-新增运营组
app.post('/cdp-web/sys/groups', (req, res) => {
    res.json();
});

// 节点管理员-修改运营组
app.put('/cdp-web/sys/groups', (req, res) => {
    res.json();
});

// 节点管理员-删除运营组
app.delete('/cdp-web/sys/groups/*', (req, res) => {
    res.json();
});

// 节点管理员-查询运营组列表
app.get('/cdp-web/sys/groups', (req, res) => {
    const groupList = require('./group/groupList.json');
    res.send(groupList);
});

// 节点管理员-新增运营组-运营组成员列表
app.get('/cdp-web/sys/groups/org-members', (req, res) => {
    const groupMemberList = require('./group/groupMemberList.json');
    res.send(groupMemberList);
});


const server = app.listen(3000, () => {
  console.log('mock app listening at http://localhost:3000');
});
