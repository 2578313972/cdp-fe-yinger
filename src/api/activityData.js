import config from '@/utils/config';

const allColor = '#F04864';
const colorList = [
    '#FACC14',
    '#1890FF',
    '#2FC25B',
    '#223273',
    '#8453E0',
    '#13C2C2',
    '#3436C7'
];

export default {
    general: {
        name: '通用',
        data: {
            // 模式/报告step中事件列表
            eventList: [
                { value: 19, label: '点击控件' },
                { value: 20, label: '浏览页面' },
                { value: 21, label: '搜索' },
                { value: 22, label: '卡券核销' },
                { value: 23, label: '卡券领取' },
                { value: 24, label: '查看货品' },
                { value: 25, label: '移除购物车' },
                { value: 26, label: '添加购物车' },
                { value: 27, label: '购买' },
                { value: 28, label: '注册会员' },
                { value: 29, label: '绑定手机号' },
                { value: 30, label: '访问结束' },
                { value: 31, label: '访问开始' },
                { value: 32, label: '新用户' }
            ],

            // 内容step
            content: {
                // 文本内容默认提示
                defaultTip:
                    '亲爱的{名称}，您于{订单时间}购买的{商品名称}已发货，请您注意查收！',
                // 发送至手机列表数据
                userList: [
                    {
                        label: '周树天',
                        value: '31231231'
                    },
                    {
                        label: '李晓晴',
                        value: '31289231'
                    },
                    {
                        label: '孙笑笑',
                        value: '3124239231'
                    },
                    {
                        label: '孙笑笑1',
                        value: '3124239da231'
                    }
                ],
                // 预览默认展示内容
                previewContent:
                    '亲爱的周树天，您于2018/01/02号购买的好太太晾衣架已发货，请您注意查收！'
            },

            // 预览step
            preview: {
                // 投放时间
                advertiseTime: {
                    from: '2018-10-10 09:20:20',
                    to: '2018-10-30 09:20:20'
                },
                // 人群
                crowd: {
                    traitName: 'VIP金卡会员', // 所选人群特性
                    originNum: '760', // 人群总数
                    crowdType: '规则人群', // 人群类型
                    updateTime: '2018-02-14', // 最后更新时间
                    planNum: '700', // 计划投放人数
                    minusNum: '60' // 去除人数
                },
                // 触点
                touch: {
                    channelType: '通用渠道', // 渠道
                    touchType: '短信（腾讯云网关）', // 触点
                    planSendNum: '690', // 短信预计发送
                    touchRatio: '96' // 触达率
                },
                // 模式
                mode: {
                    interactiveMode: '单次通知', // 交互模式
                    sendTime: '2018-10-10 09:20:20', // 发出时间
                    condition: '购物金额大于500元' // 筛选条件
                },
                // 内容
                content:
                    '尊敬VIP客户，今天是阿迪会员日，特赠送满减券一张。马上使用地址：https：//sjfjdd.com',
                // 报告
                report: [
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：点击短链'
                    }
                ]
            },

            // 触达-触达网关下拉列表
            touchGateway: [
                {
                    value: '1',
                    label: '我的渠道',
                    children: [
                        {
                            value: '2',
                            label: '通用渠道',
                            children: [
                                {
                                    value: '3',
                                    label: '亿美投放渠道1'
                                },
                                {
                                    value: '4',
                                    label: '腾讯短信渠道2'
                                }
                            ]
                        }
                    ]
                }
            ],

            // 投放人群预估
            crowdPrediction: {
                type: '（短信）',
                target: 58600,
                exclude: 58125,
                plan: 54382
            },
            breadcrumb: [
                '年货节-超级秒杀日，最低1折起',
                '金卡会员活动期间满1000减80'
            ],
            // 活动列表
            activityList: [
                {
                    id: '1901',
                    name: '年货节-超级秒杀日，最低1折起',
                    time: '2019-01-13 至 2019-01-31',
                    send: 1,
                    creater: '李晓晴',
                    state: 'finished',
                    description:
                        '年货节期间，任意一笔满399元订单均可参加年货节大转盘抽奖活动，有几率赢取1折大奖！'
                },
                {
                    id: '1902',
                    name: '新装抢鲜，呼气春天，春装全面上市',
                    time: '2019-02-13 至 2019-03-31',
                    send: 1,
                    creater: '李晓晴',
                    state: 'finished'
                },
                {
                    id: '1903',
                    name: '四月踏青，魅力出行，缤纷春季购物节',
                    time: '2019-04-11 至 2019-04-31',
                    send: 1,
                    creater: '周树天',
                    state: 'finished'
                },
                {
                    id: '1904',
                    name: '五一钜惠，全场满立减，满包邮，满500送20',
                    time: '2019-05-01 至 2019-01-31',
                    send: 1,
                    creater: '李晓晴',
                    state: 'finished'
                },
                {
                    id: '1905',
                    name: '十周年庆，年中放价，全场满618减60',
                    time: '2019-06-11 至 2019-06-31',
                    send: 1,
                    creater: '周树天',
                    state: 'finished'
                },
                {
                    id: '1906',
                    name: '夏季初登场，购物送好礼',
                    time: '2019-07-01 至 2019-07-31',
                    send: 1,
                    creater: '孙笑笑',
                    state: 'finished'
                },
                {
                    id: '1907',
                    name: '仲夏大行动，全场9折起，满150再返20',
                    time: '2019-08-01 至 2019-08-31',
                    send: 1,
                    creater: '周树天',
                    state: 'finished'
                },
                {
                    id: '1908',
                    name: '开学季-领跑新学期，开学装备特惠专场',
                    time: '2019-09-01 至 2019-09-31',
                    send: 1,
                    creater: '孙笑笑',
                    state: 'finished'
                },
                {
                    id: '1909',
                    name: '尽享意外惊喜“国庆购物不花钱”',
                    time: '2019-10-01 至 2019-10-31',
                    send: 1,
                    creater: '周树天',
                    state: 'finished'
                },
                {
                    id: '1910',
                    name: '庆圣诞迎元旦 精选商品7折起 满400包邮',
                    time: '2019-12-20 至 2019-12-31',
                    send: 2,
                    creater: '孙笑笑',
                    state: 'finished'
                }
            ],
            // 活动状态统计信息
            state: [
                {
                    name: '待开始',
                    value: 3
                },
                {
                    name: '进行中',
                    value: 5
                },
                {
                    name: '已结束',
                    value: 21
                }
            ],
            // 投放单元列表
            unitList: [
                {
                    id: '1',
                    name: '金卡会员活动期间满1000减80',
                    crowd_name: '金卡会员',
                    crowd_count: '560901',
                    type: '单次通知',
                    type_val: '0',
                    start_date: '立即投放',
                    creater: '周树天',
                    channel_type: '短信',
                    state: '草稿',
                    marketingType: '0'
                },
                {
                    id: '2',
                    name: '银卡会员活动期间满500减30',
                    crowd_name: '银卡会员',
                    crowd_count: '679032',
                    type: '周期性通知',
                    type_val: '2',
                    start_date: '立即投放',
                    creater: '孙笑笑',
                    channel_type: '短信',
                    state: '待内审',
                    marketingType: '1'
                },
                {
                    id: '3',
                    name: '第3季度累计购物满2千抽腕表',
                    crowd_name: '普通会员',
                    crowd_count: '989224',
                    type: '日期通知',
                    type_val: '3',
                    start_date: '每月1日',
                    date: '2018-10-21  08:50',
                    creater: '张成立',
                    channel_type: '微信',
                    state: '待测试',
                    marketingType: '0'
                },
                {
                    id: '1',
                    name: '新用户关注公众号送20元优惠券',
                    crowd_name: '微信新用户',
                    crowd_count: '55922',
                    type: '事件响应',
                    type_val: '1',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '微信',
                    state: '投放中',
                    marketingType: '0'
                },
                {
                    id: '5',
                    name: '新用户公众号首次下单送20元优惠券',
                    crowd_name: '公众号首次下单微信用户',
                    crowd_count: '98925',
                    type: '旅程通知',
                    type_val: '5',
                    start_date: '每月1日',
                    date: '2018-10-21  08:50',
                    creater: '张成立',
                    channel_type: '微信',
                    state: '待测试',
                    marketingType: '1'
                },
                {
                    id: '4',
                    name: '金卡会员刷卡满1千送品牌围巾',
                    crowd_name: '金卡会员刷卡满1千',
                    crowd_count: '559220',
                    type: '旅程响应',
                    type_val: '4',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '微信',
                    state: '待外审',
                    marketingType: '0'
                },
                {
                    id: '1',
                    name: '金卡会员当月购物满2千抽大奖',
                    crowd_name: '刷卡满2千金卡会员',
                    crowd_count: '5800',
                    type: '事件响应',
                    type_val: '1',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '微信',
                    state: '暂停中',
                    marketingType: '1'
                },
                {
                    id: '2',
                    name: '银卡会员当月购物满5次送50元券',
                    crowd_name: '刷卡满5次银卡会员',
                    crowd_count: '70922',
                    type: '周期性通知',
                    type_val: '2',
                    start_date: '每月1日',
                    date: '2018-10-21  08:50',
                    creater: '李晓晴',
                    channel_type: '短信',
                    state: '待开始',
                    marketingType: '0'
                },
                {
                    id: '0',
                    name: '普通会员购物满3免1',
                    crowd_name: '普通会员',
                    crowd_count: '90228',
                    type: '单次通知',
                    type_val: '0',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '短信',
                    state: '已过期',
                    marketingType: '1'
                }
            ],

            // 活动详情
            activity_detail: {
                id: 'CM19011469',
                creater: '李晓晴',
                creat_time: '2019-01-12',
                activity_date: '2019-01-13 至 2019-01-31',
                description: '年货节期间，任意一笔满399元订单均可参加年货节大转盘抽奖活动，有几率赢取1折大奖！'
            },
            // 投放单元——修改信息
            editContent: {
                activity: '年货节-超级秒杀日，最低1折起',
                name: '名称',
                marketingType: 'marketing', // 非营销 un_marketing
                interactiveType: config.interactive_type,
                putType: ['拉新'],
                description: 'sdfsdf'
            },
            // 活动详情进度条上数值
            put_plan: {
                target: 56665555, // 目标数
                plan: 40665555, // 计划数
                actual: 30665555 // 实际数
            },
            // 投放单元总览
            put_unit: {
                total: 55, // 总数
                not_started: 3, // 未开始
                under_way: 7, // 进行中
                suspend: 1, // 暂停
                end: 19, // 结束
                overdue: 1 // 过期
            },
            // step结果-柱状图数据
            stepBarData: {
                xData: ['1.目标触达', '2.计划触达', '3.实际发送', '4.点击短链'],
                yData1: [150, 115, 90, 70],
                yData2: ['', 35, 25, 20] // 第一项为100%始终为: ''
            },
            downItemList: [
                {
                    label: '活动ID',
                    value: 1
                },
                {
                    label: '投放单元ID',
                    value: 2
                },
                {
                    label: '用户ID',
                    value: 3
                },
                {
                    label: '渠道触点',
                    value: 4
                },
                {
                    label: '权益包ID',
                    value: 5
                },
                {
                    label: '转化状态',
                    value: 6
                },
                {
                    label: '转化时间',
                    value: 7
                },
                {
                    label: '转化时长',
                    value: 8
                },
                {
                    label: '首次点击时间',
                    value: 9
                },
                {
                    label: '漏斗第一节点事件',
                    value: 10
                },
                {
                    label: '漏斗第二节点事件',
                    value: 11
                },
                {
                    label: '漏斗第三节点事事件',
                    value: 12
                },
                {
                    label: '到达漏斗第一节点时间',
                    value: 13
                },
                {
                    label: '到达漏斗第二节点时间',
                    value: 14
                },
                {
                    label: '到达漏斗第三节点时间',
                    value: 15
                },
                {
                    label: '到达漏斗第四节点时间',
                    value: 16
                }
            ],
            subTabList: [
                {
                    value: '转化115人(70%)',
                    key: 'putIn'
                },
                {
                    value: '流失80人(30%)',
                    key: 'putOut'
                }
            ],
            stepLineData: {
                xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                yData: [
                    {
                        name: '整体',
                        type: 'line',
                        smooth: true,
                        color: allColor,
                        data: [220, 232, 151, 84, 100, 330, 190]
                    },
                    {
                        name: '1.目标触达',
                        type: 'line',
                        smooth: true,
                        color: colorList[0],
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '2.计划触达',
                        type: 'line',
                        smooth: true,
                        color: colorList[1],
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '3.实际发送',
                        type: 'line',
                        smooth: true,
                        color: colorList[2],
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '4.点击短链',
                        type: 'line',
                        smooth: true,
                        color: colorList[3],
                        data: [180, 332, 101, 114, 160, 230, 300]
                    }
                ]
            }
        }
    },
    secruities1: {
        name: '新客理财',
        data: {
            // 模式/报告step中事件列表
            eventList: [
                { value: 19, label: '银证转账' },
                { value: 20, label: '行情板块' },
                { value: 21, label: '自选股' },
                { value: 22, label: '交易登陆' },
                { value: 23, label: '普通买入' },
                { value: 24, label: '融资买入' },
                { value: 25, label: '理财购买' },
                { value: 26, label: '基金申购' },
                { value: 27, label: '首页点击' },
                { value: 28, label: '资讯浏览' },
                { value: 29, label: '相似K线查询' },
                { value: 30, label: '其他页面访问' },
                { value: 31, label: '启动APP' },
                { value: 32, label: '注册APP' },
                { value: 33, label: '开户' },
                { value: 34, label: '访问结束' },
                { value: 35, label: '访问开始' },
                { value: 36, label: '新用户' },
                { value: 37, label: '点击短链' },
                { value: 38, label: '浏览页面' },
                { value: 39, label: '点击购买' },
                { value: 40, label: '购买成功' }
            ],

            // 内容step
            content: {
                // 文本内容默认提示
                defaultTip:
                    '尊敬的{客户姓名}{称谓}，非常荣幸选择XX证券成为您财富增值伙伴！特推出新客户专享理财{产品名称}，收益高于6.0%的14天理财产品：{短链}。',
                // 发送至手机列表数据
                userList: [
                    {
                        label: '周树天',
                        value: '31231231'
                    },
                    {
                        label: '李晓晴',
                        value: '31289231'
                    },
                    {
                        label: '孙笑笑',
                        value: '3124239231'
                    },
                    {
                        label: '孙笑笑1',
                        value: '3124239da231'
                    }
                ],
                // 预览默认展示内容
                previewContent:
                    '尊敬的周树天先生，非常荣幸选择XX证券成为您财富增值伙伴！特推出新客户专享理财AA理财基金，收益高于6.0%的14天理财产品：https：//sjfjdd.com。'
            },

            // 预览step
            preview: {
                // 投放时间
                advertiseTime: {
                    from: '2019-01-01 09:20:20',
                    to: '2019-12-30 09:20:20'
                },
                // 人群
                crowd: {
                    traitName: '新开户客群_新增人群', // 所选人群特性
                    originNum: '10,754', // 人群总数
                    crowdType: '规则人群', // 人群类型
                    updateTime: '2019-02-16', // 最后更新时间
                    planNum: '10,754', // 计划投放人数
                    minusNum: '200' // 去除人数
                },
                // 触点
                touch: {
                    channelType: '证券渠道', // 渠道
                    touchType: '短信', // 触点
                    planSendNum: '10,754', // 短信预计发送
                    touchRatio: '87' // 触达率
                },
                // 模式
                mode: {
                    interactiveMode: '周期性通知', // 交互模式
                    sendTime: '在2019-01-01到2019-12-30期间，在每周一，人群更新完成后10:00:00发送', // 发出时间
                    condition: '' // 筛选条件
                },
                // 内容
                content:
                    '尊敬的{客户姓名}{称谓}，非常荣幸选择XX证券成为您财富增值伙伴！特推出新客户专享理财{产品名称}，收益高于6.0%的14天理财产品：https：//sjfjdd.com。',
                // 报告
                report: [
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：点击短链'
                    },
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '五',
                        title: '触发事件：浏览页面'
                    },
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：点击购买'
                    },
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：购买成功'
                    }
                ]
            },

            // 触达-触达网关下拉列表
            touchGateway: [
                {
                    value: '1',
                    label: '证券渠道',
                    children: [
                        {
                            value: '2',
                            label: '短信'
                        },
                        {
                            value: '3',
                            label: '电话客服'
                        }
                    ]
                },
                {
                    value: '4',
                    label: '微信公众号渠道',
                    children: [
                        {
                            value: '2',
                            label: '微信公众号'
                        }
                    ]
                }
            ],

            // 投放人群预估
            crowdPrediction: {
                type: '（短信）',
                target: 10754,
                exclude: 200,
                plan: 10554
            },
            breadcrumb: [
                '投资理财产品推荐',
                '新开户客群，新手理财推荐'
            ],
            // 活动列表
            activityList: [
                {
                    id: '1901',
                    name: '投资理财产品推荐',
                    time: '2019-01-01 至 2019-12-31',
                    send: 1,
                    creater: '李晓晴',
                    state: 'finished',
                    description:
                        '成功开户新客群，推荐较高收益的短期理财产品，促进入金'
                }
            ],
            // 活动状态统计信息
            state: [
                {
                    name: '待开始',
                    value: 3
                },
                {
                    name: '进行中',
                    value: 5
                },
                {
                    name: '已结束',
                    value: 21
                }
            ],
            // 投放单元列表
            unitList: [
                {
                    id: '1',
                    name: '新开户客群，新手理财推荐',
                    crowd_name: '新开户客群_新增人群',
                    crowd_count: '10,754',
                    type: '周期性通知',
                    type_val: '2',
                    start_date: '立即投放',
                    creater: '周树天',
                    channel_type: '短信',
                    state: '草稿',
                    marketingType: '0'
                },
                {
                    id: '2',
                    name: '高端理财推荐',
                    crowd_name: '资金流出客群',
                    crowd_count: '10,754',
                    type: '事件响应',
                    type_val: '1',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '微信',
                    state: '草稿',
                    marketingType: '0'
                },
                {
                    id: '3',
                    name: '对理财购买意向客群推荐',
                    crowd_name: '资金流出客群中有购买意向的',
                    crowd_count: '10,754',
                    type: '事件响应',
                    type_val: '1',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '电话客服',
                    state: '草稿',
                    marketingType: '1'
                }
            ],

            // 活动详情
            activity_detail: {
                id: 'CM19011469',
                creater: '李晓晴',
                creat_time: '2019-01-01',
                activity_date: '2019-01-01 至 2019-12-31',
                description: '投资理财产品推荐'
            },
            // 投放单元——修改信息
            editContent: {
                activity: '新开户客群，新手理财推荐',
                name: '名称',
                marketingType: 'marketing', // 非营销 un_marketing
                interactiveType: config.interactive_type,
                putType: ['促活'],
                description: '成功开户新客群，推荐较高收益的短期理财产品，促进入金'
            },
            // 活动详情进度条上数值
            put_plan: {
                target: 21508, // 目标数
                plan: 21108, // 计划数
                actual: 18712 // 实际数
            },
            // 投放单元总览
            put_unit: {
                total: 3, // 总数
                not_started: 3, // 未开始
                under_way: 0, // 进行中
                suspend: 0, // 暂停
                end: 0, // 结束
                overdue: 0 // 过期
            },
            // step结果-柱状图数据
            stepBarData: {
                xData: ['3.实际发送', '4.点击短链', '5.浏览页面', '6.点击购买', '7.购买成功'],
                yData1: [9356, 6932, 5403, 2832, 1221],
                yData2: ['', 2424, 1529, 2571, 1350] // 第一项为100%始终为: ''
            },
            downItemList: [
                {
                    label: '活动ID',
                    value: 1
                },
                {
                    label: '投放单元ID',
                    value: 2
                },
                {
                    label: '用户ID',
                    value: 3
                },
                {
                    label: '渠道触点',
                    value: 4
                },
                {
                    label: '权益包ID',
                    value: 5
                },
                {
                    label: '转化状态',
                    value: 6
                },
                {
                    label: '转化时间',
                    value: 7
                },
                {
                    label: '转化时长',
                    value: 8
                },
                {
                    label: '首次点击时间',
                    value: 9
                },
                {
                    label: '漏斗第一节点事件',
                    value: 10
                },
                {
                    label: '漏斗第二节点事件',
                    value: 11
                },
                {
                    label: '漏斗第三节点事事件',
                    value: 12
                },
                {
                    label: '到达漏斗第一节点时间',
                    value: 13
                },
                {
                    label: '到达漏斗第二节点时间',
                    value: 14
                },
                {
                    label: '到达漏斗第三节点时间',
                    value: 15
                },
                {
                    label: '到达漏斗第四节点时间',
                    value: 16
                }
            ],
            subTabList: [
                {
                    value: '转化1,221人(13%)',
                    key: 'putIn'
                },
                {
                    value: '流失8,135人(87%)',
                    key: 'putOut'
                }
            ],
            stepLineData: {
                xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                yData: [
                    {
                        name: '3.实际发送',
                        type: 'line',
                        smooth: true,
                        color: colorList[0],
                        data: [9356, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '4.点击短链',
                        type: 'line',
                        smooth: true,
                        color: colorList[1],
                        data: [6590, 3500, 1838, 2879, 3876, 4120, 2790]
                    },
                    {
                        name: '5.浏览页面',
                        type: 'line',
                        smooth: true,
                        color: colorList[2],
                        data: [5422, 2713, 1023, 1400, 3210, 3742, 1232]
                    },
                    {
                        name: '6.点击购买',
                        type: 'line',
                        smooth: true,
                        color: colorList[3],
                        data: [2638, 1285, 792, 593, 2059, 2593, 890]
                    },
                    {
                        name: '7.购买成功',
                        type: 'line',
                        smooth: true,
                        color: colorList[4],
                        data: [323, 390, 104, 77, 444, 372, 188]
                    }
                ]
            }
        }
    },
    secruities2: {
        name: '资金流出超过30W',
        data: {
            // 模式/报告step中事件列表
            eventList: [
                { value: 19, label: '银证转账' },
                { value: 20, label: '行情板块' },
                { value: 21, label: '自选股' },
                { value: 22, label: '交易登陆' },
                { value: 23, label: '普通买入' },
                { value: 24, label: '融资买入' },
                { value: 25, label: '理财购买' },
                { value: 26, label: '基金申购' },
                { value: 27, label: '首页点击' },
                { value: 28, label: '资讯浏览' },
                { value: 29, label: '相似K线查询' },
                { value: 30, label: '其他页面访问' },
                { value: 31, label: '启动APP' },
                { value: 32, label: '注册APP' },
                { value: 33, label: '开户' },
                { value: 34, label: '访问结束' },
                { value: 35, label: '访问开始' },
                { value: 36, label: '新用户' },
                { value: 37, label: '点击短链' },
                { value: 38, label: '浏览页面' },
                { value: 39, label: '点击购买' },
                { value: 40, label: '购买成功' }
            ],

            // 内容step
            content: {
                // 文本内容默认提示
                defaultTip:
                    '尊敬的{客户姓名}{称谓}，为您推出高收益热销理财产品{产品名称}，购买请戳{短链}。',
                // 发送至手机列表数据
                userList: [
                    {
                        label: '周树天',
                        value: '31231231'
                    },
                    {
                        label: '李晓晴',
                        value: '31289231'
                    },
                    {
                        label: '孙笑笑',
                        value: '3124239231'
                    },
                    {
                        label: '孙笑笑1',
                        value: '3124239da231'
                    }
                ],
                // 预览默认展示内容
                previewContent:
                    '尊敬的周树天先生，为您推出高收益热销理财产品豪富基金，购买请戳https：//sjfjdd.com。'
            },

            // 预览step
            preview: {
                // 投放时间
                advertiseTime: {
                    from: '2019-01-01 09:20:20',
                    to: '2019-12-30 09:20:20'
                },
                // 人群
                crowd: {
                    traitName: '资金流出客群', // 所选人群特性
                    originNum: '10,754', // 人群总数
                    crowdType: '规则人群', // 人群类型
                    updateTime: '2019-02-16', // 最后更新时间
                    planNum: '10,754', // 计划投放人数
                    minusNum: '200' // 去除人数
                },
                // 触点
                touch: {
                    channelType: '证券渠道', // 渠道
                    touchType: '微信公众号', // 触点
                    planSendNum: '10,754', // 短信预计发送
                    touchRatio: '87' // 触达率
                },
                // 模式
                mode: {
                    interactiveMode: '事件响应', // 交互模式
                    sendTime: '在2019-01-01到2019-12-30期间，由理财购买事件触发后，延迟2天发出', // 发出时间
                    condition: '理财产品到期日距今天数小于等于7天' // 筛选条件
                },
                // 内容
                content:
                    '尊敬的{客户姓名}{称谓}，为您推出高收益热销理财产品{产品名称}，购买请戳{短链}。',
                // 报告
                report: [
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：点击短链'
                    },
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '五',
                        title: '触发事件：浏览页面'
                    },
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：点击购买'
                    },
                    // step: 步骤节点数; title: 步骤节点名（前三步骤固定，从第4开始）
                    {
                        step: '四',
                        title: '触发事件：购买成功'
                    }
                ]
            },

            // 触达-触达网关下拉列表
            touchGateway: [
                {
                    value: '1',
                    label: '证券渠道',
                    children: [
                        {
                            value: '2',
                            label: '短信'
                        },
                        {
                            value: '3',
                            label: '电话客服'
                        }
                    ]
                },
                {
                    value: '4',
                    label: '证券小程序渠道',
                    children: [
                        {
                            value: '2',
                            label: '微信小程序'
                        }
                    ]
                }
            ],

            // 投放人群预估
            crowdPrediction: {
                type: '',
                target: 10754,
                exclude: 200,
                plan: 10554
            },
            breadcrumb: [
                '投资理财产品推荐',
                '高端理财推荐'
            ],
            // 活动列表
            activityList: [
                {
                    id: '1901',
                    name: '投资理财产品推荐',
                    time: '2019-01-01 至 2019-12-31',
                    send: 1,
                    creater: '李晓晴',
                    state: 'finished',
                    description:
                        '当日转出金额超过30W的，推荐高端理财产品'
                }
            ],
            // 活动状态统计信息
            state: [
                {
                    name: '待开始',
                    value: 3
                },
                {
                    name: '进行中',
                    value: 5
                },
                {
                    name: '已结束',
                    value: 21
                }
            ],
            // 投放单元列表
            unitList: [
                {
                    id: '1',
                    name: '新开户客群，新手理财推荐',
                    crowd_name: '新开户客群_新增人群',
                    crowd_count: '10,754',
                    type: '周期性通知',
                    type_val: '2',
                    start_date: '立即投放',
                    creater: '周树天',
                    channel_type: '短信',
                    state: '草稿',
                    marketingType: '0'
                },
                {
                    id: '2',
                    name: '高端理财推荐',
                    crowd_name: '资金流出客群',
                    crowd_count: '10,754',
                    type: '事件响应',
                    type_val: '1',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '微信公众号',
                    state: '草稿',
                    marketingType: '0'
                },
                {
                    id: '3',
                    name: '对理财购买意向客群推荐',
                    crowd_name: '资金流出客群中有购买意向的',
                    crowd_count: '10,754',
                    type: '事件响应',
                    type_val: '1',
                    start_date: '立即投放',
                    creater: '李晓晴',
                    channel_type: '电话客服',
                    state: '草稿',
                    marketingType: '1'
                }
            ],

            // 活动详情
            activity_detail: {
                id: 'CM19011469',
                creater: '李晓晴',
                creat_time: '2019-01-01',
                activity_date: '2019-01-01 至 2019-12-31',
                description: '投资理财产品推荐'
            },
            // 投放单元——修改信息
            editContent: {
                activity: '高端理财推荐',
                name: '名称',
                marketingType: 'marketing', // 非营销 un_marketing
                interactiveType: config.interactive_type,
                putType: ['促活'],
                description: '当日转出金额超过30W的，推荐高端理财产品'
            },
            // 活动详情进度条上数值
            put_plan: {
                target: 21508, // 目标数
                plan: 21108, // 计划数
                actual: 18712 // 实际数
            },
            // 投放单元总览
            put_unit: {
                total: 3, // 总数
                not_started: 3, // 未开始
                under_way: 0, // 进行中
                suspend: 0, // 暂停
                end: 0, // 结束
                overdue: 0 // 过期
            },
            // step结果-柱状图数据
            stepBarData: {
                xData: ['3.实际发送', '4.点击短链', '5.浏览页面', '6.点击购买', '7.购买成功'],
                yData1: [9356, 6932, 5403, 2832, 1221],
                yData2: ['', 2424, 1529, 2571, 1350] // 第一项为100%始终为: ''
            },
            downItemList: [
                {
                    label: '活动ID',
                    value: 1
                },
                {
                    label: '投放单元ID',
                    value: 2
                },
                {
                    label: '用户ID',
                    value: 3
                },
                {
                    label: '渠道触点',
                    value: 4
                },
                {
                    label: '权益包ID',
                    value: 5
                },
                {
                    label: '转化状态',
                    value: 6
                },
                {
                    label: '转化时间',
                    value: 7
                },
                {
                    label: '转化时长',
                    value: 8
                },
                {
                    label: '首次点击时间',
                    value: 9
                },
                {
                    label: '漏斗第一节点事件',
                    value: 10
                },
                {
                    label: '漏斗第二节点事件',
                    value: 11
                },
                {
                    label: '漏斗第三节点事事件',
                    value: 12
                },
                {
                    label: '到达漏斗第一节点时间',
                    value: 13
                },
                {
                    label: '到达漏斗第二节点时间',
                    value: 14
                },
                {
                    label: '到达漏斗第三节点时间',
                    value: 15
                },
                {
                    label: '到达漏斗第四节点时间',
                    value: 16
                }
            ],
            subTabList: [
                {
                    value: '转化1,221人(13%)',
                    key: 'putIn'
                },
                {
                    value: '流失8,135人(87%)',
                    key: 'putOut'
                }
            ],
            stepLineData: {
                xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                yData: [
                    {
                        name: '3.实际发送',
                        type: 'line',
                        smooth: true,
                        color: colorList[0],
                        data: [9356, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '4.点击短链',
                        type: 'line',
                        smooth: true,
                        color: colorList[1],
                        data: [6590, 3500, 1838, 2879, 3876, 4120, 2790]
                    },
                    {
                        name: '5.浏览页面',
                        type: 'line',
                        smooth: true,
                        color: colorList[2],
                        data: [5422, 2713, 1023, 1400, 3210, 3742, 1232]
                    },
                    {
                        name: '6.点击购买',
                        type: 'line',
                        smooth: true,
                        color: colorList[3],
                        data: [2638, 1285, 792, 593, 2059, 2593, 890]
                    },
                    {
                        name: '7.购买成功',
                        type: 'line',
                        smooth: true,
                        color: colorList[4],
                        data: [323, 390, 104, 77, 444, 372, 188]
                    }
                ]
            }
        }
    }
};
