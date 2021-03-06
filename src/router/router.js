import config from '@/utils/config';

// 判断是否显示CEP活动旧组件
const arr = location.origin.split('.');
const oldDomain = arr[arr.length - 1];
const isOld = oldDomain === '179';
let [path1, path2] = ['/depActivity', '/activity'];
if (isOld) {
    [path1, path2] = [path2, path1];
}

// 导航router
const MenuRouter = () => import('@/views/menu/MenuRouter');
// 概览
const Home = () => import('@/views/overview/Index');
// 外部概览iframe
const Outer = () => import('@/views/overview/Iframe');

// 数据
const TraitRouter = () => import('@/views/data/trait/Router');
const Trait = () => import('@/views/data/trait'); // 特性管理
const TraitDetail = () => import('@/views/data/trait/details'); // 特性管理详情
const EventRouter = () => import('@/views/data/event/Router');
const Event = () => import('@/views/data/event'); // 事件管理
const EventDetail = () => import('@/views/data/event/details'); // 事件管理
const Portrait = () => import('@/views/data/portrait'); // 画像管理


// 用户
const CrowdRouter = () => import('@/views/user/crowd/Router');
const Crowd = () => import('@/views/user/crowd/Index'); // 人群管理页
const CrowdDetail = () => import('@/views/user/crowd/details/Index'); // 人群管理页-详情页
const RFM = () => import('@/views/user/RFM'); // RFM页
const LifeWorth = () => import('@/views/user/lifeWorth'); // 生命价值分析
const UserProfile = () => import('@/views/user/userProfile'); // 用户档案

// 旧CEP活动组件-会废弃
const ActivityRouterOld = () => import('@/views/activityOld/manage/Router');
const ActivityListOld = () => import('@/views/activityOld/manage/Index'); // 活动管理
const AdvertisingListOld = () => import('@/views/activityOld/manage/List'); // 活动管理/投放管理
const AdvertisingDetailOld = () => import('@/views/activityOld/manage/details/Index'); // 活动管理/投放管理详情

// 活动
const ActivityRouter = () => import('@/views/activity/manage/Router');
const ActivityList = () => import('@/views/activity/manage/Index'); // 活动管理
const AdvertisingList = () => import('@/views/activity/manage/List'); // 活动管理/投放管理
const AdvertisingDetail = () => import('@/views/activity/manage/details/Index'); // 活动管理/投放管理详情

// 管理
// 1. 租户管理员
const TenantAccount = () => import('@/views/manage/account'); // 账号
const TenantChannel = () => import('@/views/manage/channel'); // 渠道
const TenantAuthorize = () => import('@/views/manage/account/Insight'); // 授权

// 2. 渠道管理员
const ChannelAuthorize = () => import('@/views/manage/systemAuthori'); // 授权
const ChannelAudit = () => import('@/views/manage/audit'); // 审核
const Role = () => import('@/views/manage/authorization'); // 角色

// 3. 运营专员
const OperationSpecialist = () => import('@/views/manage/authorization/group/OperationSpecialist.vue'); // 授权

// 4. 节点管理员
const Member = () => import('@/views/manage/member'); // 运营组

// 营销活动管理
const CalendarLife = () => import('@/views/markeCampaign/calendarLife'); // 生活日历
const OverallOverview = () => import('@/views/markeCampaign/overallOverview'); // 营销整体概览
const AnalysisManagement = () => import('@/views/markeCampaign/analysisManagement'); // 营销分析管理
const AnalysisContrastManagement = () => import('@/views/markeCampaign/analysisContrastManagement'); // 营销分析对比管理
const AnalysisKanban = () => import('@/views/markeCampaign/analysisKanban'); // 营销分析看板 主页
const Particulars = () => import('@/views/markeCampaign/analysisKanban/particulars'); // 营销分析看板
const ParticularsPage = () => import('@/views/markeCampaign/analysisKanban/particularsPage'); // 营销分析看板 详情页面


// 人群分析
const CrowdManagement = () => import('@/views/analysisPeople/crowdManagement'); // 营销人群管理
const CrowdContrastManagement = () => import('@/views/analysisPeople/crowdContrastManagement'); // 人群分析对比管理

const CrowdKanban = () => import('@/views/analysisPeople/crowdKanban'); // 人群分析看板 主页
const Homepage = () => import('@/views/analysisPeople/crowdKanban/homepage'); // 人群分析看板
const DetailsCrowd = () => import('@/views/analysisPeople/crowdKanban/detailsCrowd'); // 人群分析看板 详情


// 回访分析
const VisitKanban = () => import('@/views/returnAnalysis/visitKanban'); // 回访看板 主页
const ReturnAnalysis = () => import('@/views/returnAnalysis/visitKanban/returnAnalysis'); // 回访看板
const ReturnAnalysisPage = () => import('@/views/returnAnalysis/visitKanban/returnAnalysisPage'); // 回访看板 详情页面
const StatisticsKanban = () => import('@/views/returnAnalysis/StatisticsKanban'); // 回访统计看板 主页
const StatisticsAnalysis = () => import('@/views/returnAnalysis/StatisticsKanban/returnAnalysis'); // 回访统计看板
const StatisticsAnalysisPage = () => import('@/views/returnAnalysis/StatisticsKanban/returnAnalysisPage'); // 回访统计看板 详情页面


// 数据下载
const DataDown = () => import('@/views/dataDownload/dataDown'); // 数据下载

// 监控视图
const DataEngineering = () => import('@/views/monitorUser/dataEngineering'); // 数据工程
const CdpReport = () => import('@/views/monitorUser/cdpReport'); // cdp报表

// 错误页面
const ErrorPage = () => import('@/views/errorPage');

// 预设iframe个数
const iframeCount = config.iframeCount;
const iframeList = [];
for (let index = 0; index < iframeCount; index++) {
    iframeList.push({
        path: `/outer${index}`,
        name: `outer${index}`, // 外部概览
        component: Outer
    });
}

const Routers = {
    path: '/',
    name: 'nav',
    redirect: '/home',
    component: MenuRouter,
    children: [
        {
            path: '/home',
            name: 'home', // 概览
            component: Home
        },
        ...iframeList,
        // 旧CEP活动组件
        {
            path: path1, // 活动
            component: ActivityRouterOld,
            children: [{
                path: '', // 活动管理
                name: 'ActivityListOld',
                component: ActivityListOld
            }, {
                path: 'list', // 活动/投放管理
                name: 'AdvertisingListOld',
                component: AdvertisingListOld
            },
            {
                path: 'detail', // 活动/投放管理/详情
                name: 'AdvertisingDetailOld',
                component: AdvertisingDetailOld
            }
            ]
        },
        // 新CEP活动组件
        {
            path: path2, // 活动
            component: ActivityRouter,
            children: [{
                path: '', // 活动管理
                name: 'activitylist',
                component: ActivityList
            }, {
                path: 'list', // 活动/投放管理
                name: 'advertisinglist',
                component: AdvertisingList
            },
            {
                path: 'detail', // 活动/投放管理/详情
                name: 'advertisingdetail',
                component: AdvertisingDetail
            }
            ]
        },
        {
            path: '/event', // 数据/事件管理
            component: EventRouter,
            children: [{
                path: '', // 数据/特性管理
                name: 'event',
                component: Event,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'detail', // 数据/特性管理/详情
                name: 'eventdetail',
                component: EventDetail,
                meta: {
                    keepAlive: false
                }
            }
            ]
        },
        {
            path: '/portrait', // 数据/画像管理
            name: 'portrait',
            component: Portrait
        },
        {
            path: '/trait', // 数据/特性管理
            component: TraitRouter,
            children: [{
                path: '', // 数据/特性管理
                name: 'trait',
                component: Trait,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'detail', // 数据/特性管理/详情
                name: 'traitdetail',
                component: TraitDetail,
                meta: {
                    keepAlive: false
                }
            }
            ]
        },
        {
            path: '/crowd',
            component: CrowdRouter,
            children: [{
                path: '', // 用户/人群管理
                name: 'crowd',
                component: Crowd
            },
            {
                path: 'detail', // 用户/人群管理/详情
                name: 'crowddetail',
                component: CrowdDetail
            }
            ]
        },
        {
            path: '/rfm', // 用户/RFM
            name: 'rfm',
            component: RFM
        },
        {
            path: '/lifeworth', // 用户/生命价值分析
            name: 'lifeworth',
            component: LifeWorth
        },
        {
            path: '/userprofile', // 用户/用户档案
            name: 'userprofile',
            component: UserProfile
        },
        {
            path: '/tenantaccount', // 管理/账户管理
            name: 'tenantaccount',
            component: TenantAccount
        },
        {
            path: '/tenantchannel', // 管理/租户渠道管理
            name: 'tenantchannel',
            component: TenantChannel
        },
        {
            path: '/tenantauthorize', // 管理/租户授权管理
            name: 'tenantauthorize',
            component: TenantAuthorize
        },
        {
            path: '/channelauthorize', // 管理/渠道管理员/授权
            name: 'channelauthorize',
            component: ChannelAuthorize
        },
        {
            path: '/assisauthorize', // 管理/运营专员授权管理
            name: 'assisauthorize',
            component: OperationSpecialist
        },
        {
            path: '/channelaudit', // 管理/审核管理
            name: 'channelaudit',
            component: ChannelAudit
        },
        {
            path: '/role', // 管理/渠道管理员/角色
            name: 'role',
            component: Role
        },
        {
            path: '/member', // 管理/运营组(节点管理员)
            name: 'member',
            component: Member
        },
        {
            path: '/calendarLife', // 生活日历
            name: 'calendarLife',
            component: CalendarLife
        },
        {
            path: '/overallOverview', // 营销整体概览
            name: 'overallOverview',
            component: OverallOverview
        },
        {
            path: '/analysisManagement', // 营销分析管理
            name: 'analysisManagement',
            component: AnalysisManagement
        },
        {
            path: '/analysisContrastManagement', // 营销分析对比管理
            name: 'analysisContrastManagement',
            component: AnalysisContrastManagement
        },
        {
            path: '/analysisKanban', // 营销分析看板
            component: AnalysisKanban,
            children: [
                {
                    path: '', // 营销分析看板
                    name: 'particulars',
                    component: Particulars
                },
                {
                    path: 'particularsPage', // 详情页面
                    name: 'particularsPage',
                    component: ParticularsPage
                }
            ]
        },
        {
            path: '/crowdManagement', // 营销人群管理
            name: 'crowdManagement',
            component: CrowdManagement
        },
        {
            path: '/crowdContrastManagement', // 人群分析对比管理
            name: 'crowdContrastManagement',
            component: CrowdContrastManagement
        },
        {
            path: '/crowdKanban', // 人群分析看板
            component: CrowdKanban,
            children: [
                {
                    path: '',
                    name: 'homepage',
                    component: Homepage
                },
                {
                    path: 'detailsCrowd',
                    name: 'detailsCrowd',
                    component: DetailsCrowd
                }
            ]
        },
        {
            path: '/visitKanban', // 回访看板
            component: VisitKanban,
            children: [
                { path: '', name: 'returnAnalysis', component: ReturnAnalysis },
                { path: 'ReturnAnalysisPage', name: 'returnAnalysisPage', component: ReturnAnalysisPage }
            ]
        },
        {
            path: '/statisticsKanban', // 回访统计看板
            component: StatisticsKanban,
            children: [
                { path: '', name: 'statisticsAnalysis', component: StatisticsAnalysis },
                { path: 'statisticsAnalysisPage:id', name: 'statisticsAnalysisPage', component: StatisticsAnalysisPage }
            ]
        },
        {
            path: '/dataDown', // 数据下载
            name: 'dataDown',
            component: DataDown
        },
        {
            path: '/dataEngineering', // 数据工程
            name: 'dataEngineering',
            component: DataEngineering
        },
        {
            path: '/cdpReport', // cdp报表
            name: 'cdpReport',
            component: CdpReport
        }

    ]
};

const routers = [
    Routers,
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/error',
        name: 'errorpage',
        component: ErrorPage
    }
];

export default routers;
