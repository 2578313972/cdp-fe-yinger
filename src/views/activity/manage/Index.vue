<template>
    <div class="container-padding10 activity-management">
        <Card dis-hover>
            <Tabs>
                <TabPane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.name1"></TabPane>
            </Tabs>
            <Row class="text-align-c">
                <Col span="6" v-for="(item,index) in state" :key="index" :class="(index!==3)?line:''" style="cursor:pointer">
                <div :class="[{active:index==ins},changeColor[index]]" class="activity-title" @click="activeState(index)">
                    <p class="f20">{{item.value}}</p>
                    <p class="pt10">
                        <span>{{item.name}}</span>
                    </p>
                </div>
                </Col>
            </Row>
        </Card>
        <Card dis-hover class="mt10">
            <Row type="flex">
                <Col span='2'>
                    <span class="icon-wrapper" :class="{'color-blue': iconActive === 'list'}" @click="changeIcon('list')">
                        <i class="fa fa-list-ul f18"></i>
                    </span>
                    <span class="icon-wrapper" :class="{'color-blue': iconActive === 'calendar'}" @click="changeIcon('calendar')">
                        <i class="fa fa-calendar f18"></i>
                    </span>
                </Col>
                <Col span='18'>
                    <template v-if="iconActive === 'list'">
                        <DatePicker type="daterange"  transfer placeholder="请选择活动时间" class="width300" :value="dateValue">
                        </DatePicker>
                    </template>
                    <div v-if="iconActive === 'calendar'" class="calendar-condition">
                        <RadioGroup v-model="calendarType" @on-change="handleChangeType" type="button" class="calendar-type">
                            <Radio label="month">月</Radio>
                            <Radio label="year">年</Radio>
                        </RadioGroup>
                        <div class="date-wrapper">
                            <Select v-model="year" not-found-text="暂无数据">
                                <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select v-model="month" v-if="calendarType === 'month'" not-found-text="暂无数据">
                                <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                    </div>
                    <Input class="dependant-search ml10 " @keyup.native.enter="debounceSearch" @on-change="debounceSearch" v-model="crowdName" placeholder="请输入活动名称" icon="ios-search"></Input>
                </Col>
                <Col span="4" class="create-activity">
                    <Button type="primary" icon="md-add" @click="creatActivity">新建营销活动</Button>
                </Col>
                <!-- 新建营销活动弹框 -->
                <Drawer v-model="activityCreat" width="800" :mask-closable="false">
                    <Creat v-if="activityCreat" @cancelCreateAcivity="cancel" @commitCreateAcivity="ok"></Creat>
                </Drawer>
            </Row>
            <activity-list v-if="iconActive === 'list'"></activity-list>
            <calendar-list v-if="iconActive === 'calendar'" :calendar-type="calendarType"></calendar-list>
        </Card>
    </div>
</template>

<script>
    import Creat from '@/views/activity/manage/CreatActivity';
    import ActivityList from './ActivityList.vue';
    import CalendarList from './Calendar/Index.vue';

    export default {
        data() {
            return {
                ins: 0,
                changeColor: ['all', 'waiting_start', 'underway', 'finished'],
                line: 'line',
                dateValue: ['2019-01-01', '2019-02-01'],
                crowdName: '',
                activityCreat: false,
                tabList: [{
                              name: 'name1',
                              label: '我的'
                          },
                          {
                              name: 'name2',
                              label: '运营组的'
                          },
                          {
                              name: 'name3',
                              label: '下级的'
                          }
                ],
                state: [{
                            name: '全部',
                            value: 29
                        },
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
                buttonList: [{
                                 value: '全部',
                                 key: 'all'
                             },
                             {
                                 value: '待开始',
                                 key: 'waiting_start'
                             },
                             {
                                 value: '进行中',
                                 key: 'underway'
                             },
                             {
                                 value: '已结束',
                                 key: 'finished'
                             }
                ],
                buttonActive: 'all',
                iconActive: 'list',
                year: '',
                yearList: [],
                month: '',
                monthList: [],
                calendarType: 'month'
            };
        },
        methods: {
            initData() {},
            activeFn(status) {
                this.buttonActive = status;
            },
            // 搜索
            searIconClick() {

            // this.changeCrowdList(this.crowd_id)
            },
            creatActivity() {
                this.activityCreat = true;
            },
            // 取消创建
            cancel(value) {
                this.activityCreat = value;
            },
            ok() {
                this.activityCreat = false;
            },
            activeState(num) {
                this.ins = num;
            },
            // 列表日历切换
            changeIcon(type) {
                this.iconActive = type;
            },
            // 年月且换
            handleChangeType(val) {
                this.calendarType = val;
            }
        },
        computed: {},
        watch: {

        },
        components: {
            Creat,
            ActivityList,
            CalendarList
        },
        mounted() {
            this.initData();
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceStatus = this.$lodash.debounce(this.activeFn, timer); // 切换状态
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, timer); // 搜索
        }
    };
</script>

<style scoped lang="less">
.activity-management {
    .calendar-condition {
        .date-wrapper {
            display: inline-block;
        }
    }
    .icon-wrapper{
        display: inline-block;
        line-height: 32px;
        padding-right: 5px;
    }
    .date-wrapper {
        padding-left: 20px;
        .ivu-select {
            display: inline-block;
            width: 80px;
        }
    }
    .create-activity {
        text-align: right;
    }
    .border-bottom {
            border-bottom: 1px solid;
        }
    .active {
        font-weight: 600;
        span {
            .border-bottom
        }
    }
    .activity-title {
        span {
            &:hover {
                .border-bottom
            }
        }
    }
    .line {
            border-right: 1px solid #dcdee2
    }
    .all {
        color: #515a6e
    }
    .waiting_start {
        color: #ff9900
    }
    .underway {
        color: #008cf8
    }
    .finished {
        color: #808695
    }
}
</style>
