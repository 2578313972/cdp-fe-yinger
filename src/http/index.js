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
    queryComparedTaskList: params => axios.get('/cdp-web/marketplugin/crowdAnalysis/queryComparedTaskList', { params })
};

/** 回访分析 */
// 回访看板
const visitKanban = {
    // 表格数据
    queryTaskList: params => axios.get('/cdp-web/marketplugin/resourcemarkt/queryTaskList', { params }),
    // 详情数据
    detail: data => axios.post(`/cdp-web/marketplugin/resourcemarkt/detail/${data.code}`, data.data, { headers: { 'Content-Type': 'application/json' } })
};
// /** 数据下载 */
// // 数据下载
// const dataDown = {

// }

export {
    calendarLife,
    overallOverview,
    analysisManagement,
    analysisContrastManagement,
    analysisKanban,


    crowdManagement,
    crowdContrastManagement,
    crowdKanban,

    visitKanban


    // dataDown
};
