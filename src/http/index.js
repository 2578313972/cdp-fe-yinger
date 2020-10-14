/**
 * 二次开发原型接口
 */
import axios from '@/utils/axios';

/** 营销活动管理 */
// 生活日历
const calendarLife = {
    // 数据
    queryList: params => axios.get('/cdp-web/marketplugin/calendarManagement/queryList', { params }),
    // 删除
    delete: code => axios.delete(`/cdp-web/marketplugin/calendarManagement/delete/${code}`),
    // 添加
    addActivity: data => axios.post('/cdp-web/marketplugin/calendarManagement/addActivity', data, { headers: { 'Content-Type': 'application/json' } })
};
// 营销整体概览
const overallOverview = {
    // 数据
    overview: () => axios.get('/cdp-web/marketplugin/orderAnalysis/overview')
};
// 营销分析管理
const analysisManagement = {
    // 数据
    queryOrderList: params => axios.get('/cdp-web/marketplugin/orderAnalysis/queryOrderList', { params }),
    // 删除
    deleteOrderAnalysis: code => axios.delete(`/cdp-web/marketplugin/orderAnalysis/deleteOrderAnalysis/${code}`),
    // 渠道、区域
    allQueryType: () => axios.all([
        axios.get('/cdp-web/marketplugin/orderAnalysis/queryChannelOptions?queryType=brand'),
        axios.get('/cdp-web/marketplugin/orderAnalysis/queryChannelOptions?queryType=areaChannels')
    ]),
    // 门店
    queryChannelOptions: params => axios.get('/cdp-web/marketplugin/orderAnalysis/queryChannelOptions', { params }),
    // 添加
    addOrderAnalysis: data => axios.post('/cdp-web/marketplugin/orderAnalysis/addOrderAnalysis', data)
};
// 营销分析对比管理
const analysisContrastManagement = {
    // 数据
    queryOrderList: params => axios.get('/cdp-web/marketplugin/orderAnalysis/queryOrderList', { params }),
    // 添加对比任务
    addOrderComparedTask: data => axios.post('/cdp-web/marketplugin/orderAnalysis/addOrderComparedTask', data, { headers: { 'Content-Type': 'application/json' } })
};
// 营销分析看板
const analysisKanban = {
    // 表格数据
    queryComparedTasks: params => axios.get('/cdp-web/marketplugin/orderAnalysis/queryComparedTasks', { params }),
    // 详情数据
    detailView: params => axios.get('/cdp-web/marketplugin/orderAnalysis/detailView', { params })
};

/** 人群分析 */
// 营销人群管理
const crowdManagement = {
    // 表格数据
    queryMarketingCrowdList: params => axios.get('/cdp-web/marketplugin/crowdAnalysis/queryMarketingCrowdList', { params }),
    // 人群下拉框
    visible: () => axios.get('/cdp-web/crowds/drop/list/visible'),
    // 添加
    addMarketingCrowd: data => axios.post('/cdp-web/marketplugin/crowdAnalysis/addMarketingCrowd', data, { headers: { 'Content-Type': 'application/json' } }),
    // 删除
    deleteMarketingCrowd: code => axios.delete(`/cdp-web/marketplugin/crowdAnalysis/deleteMarketingCrowd/${code}`)
};
// 人群分析对比管理
const crowdContrastManagement = {
    // 表格数据
    queryMarketingCrowdList: params => axios.get('/cdp-web/marketplugin/crowdAnalysis/queryMarketingCrowdList', { params }),
    // 添加
    addCrowdComparedTask: data => axios.post('/cdp-web/marketplugin/crowdAnalysis/addCrowdComparedTask', data, { headers: { 'Content-Type': 'application/json' } })
};
// 人群分析看板
const crowdKanban = {
    // 表格数据
    queryComparedTaskList: params => axios.get('/cdp-web/marketplugin/crowdAnalysis/queryCrowdComparedTasks', { params }),
    // 下载
    exportCrowdTemplate: params => axios.get('/cdp-web/marketplugin/crowdAnalysis/exportCrowdTemplate', { params }),
    // 详情数据
    crowdDetailView: params => axios.get('/cdp-web/marketplugin/crowdAnalysis/crowdDetailView', { params })
};

/** 回访分析 */
// 回访看板
const visitKanban = {
    // 表格数据
    queryTaskList: params => axios.get('/cdp-web/marketplugin/resourcemarkt/queryTaskList', { params }),
    // 下载
    exportResourceDetail: params => axios.get('/cdp-web/marketplugin/resourcemarkt/exportResourceDetail', { params }),
    // 详情数据
    detail: data => axios.post(`/cdp-web/marketplugin/resourcemarkt/detail/${data.code}`, data.data, { headers: { 'Content-Type': 'application/json' } }),
    // 统计查询
    result: data => axios.post(`/cdp-web/marketplugin/resourcemarkt/result/${data.code}`, data.data)
};

// 回访统计看板
const statisticsKanban = {
    // 回访统计资源列表
    queryTotalTaskList: params => axios.get('/cdp-web/marketplugin/resourcemarkt/queryTotalTaskList', { params }),
    // 回访统计资源类型查询
    querySourceType: () => axios.get('/cdp-web/marketplugin/resourcemarkt/querySourceType'),
    // 回访统计报表分析接口
    queryTotalDetailByFIds: data => axios.post('/cdp-web/marketplugin/resourcemarkt/detail/queryTotalDetailByFIds', data),
    // 回访统计效果统计分析接口
    queryTotalResultByFIds: data => axios.post('/cdp-web/marketplugin/resourcemarkt/result/queryTotalResultByFIds', data)
};

/** 数据下载 */
// 数据下载
const dataDown = {
    // 表格数据
    queryDownLoadList: params => axios.get('/cdp-web/marketplugin/downLoad/queryDownLoadList', { params })
};

export {
    calendarLife,
    overallOverview,
    analysisManagement,
    analysisContrastManagement,
    analysisKanban,

    crowdManagement,
    crowdContrastManagement,
    crowdKanban,

    visitKanban,
    statisticsKanban,

    dataDown
};
