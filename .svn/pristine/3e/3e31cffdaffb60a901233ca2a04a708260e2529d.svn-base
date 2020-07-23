<template>
    <div class="advertise-mode">
        <Card dis-hover class="mt20">
            <p slot="title">发送模式</p>
            <!-- 单次通知 -->
            <div v-show="interActiveType==0">
                <RadioGroup v-model="noticData.modeVal">
                    <Radio label="immediate">
                        立即发送
                        <Tooltip transfer max-width="200" content="活动时间内，审核通过后立即发送" placement="top">
                            <i class="fa fa-question-circle-o"></i>
                        </Tooltip>
                    </Radio>
                    <Radio class="ml10" label="diytime">
                        指定在
                    </Radio>
                    <DatePicker @on-change="noticeDateSelect" format="yyyy-MM-dd HH:mm" v-model="noticData.dateTime" type="datetime" placeholder="选择时间"></DatePicker>
                    发出
                    <Tooltip transfer max-width="200" content="受发送渠道资源影响，发送的具体时间可能会被延后" placement="top">
                        <i class="fa fa-question-circle-o"></i>
                    </Tooltip>
                </RadioGroup>
                <div class="mt16">
                    <Strategy :isEdit="true" @on-change="syChange"></Strategy>
                </div>
            </div>
            <!-- 事件响应 -->
            <div v-show="interActiveType==1">
                <div>
                    在
                    <DatePicker :editable="false" @on-change="eventDateSelect" v-model="eventData.timeRange" style="width:280px;" type="daterange" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间区间"></DatePicker>
                    期间 由
                    <Select v-model="eventData.eventVal" style="width:180px;">
                            <Option v-for="item in eventData.eventList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select> 触发发出
                </div>
                <div class="mt20">发送时机：
                    <RadioGroup v-model="eventData.modeVal">
                        <Radio label="immediate">
                            立即发送
                        </Radio>
                        <Radio class="ml10" label="delay">
                            延迟发送
                        </Radio>
                        延迟
                        <Input v-model="eventData.delayTime" style="width:110px;">
                        <Select v-model="eventData.timeType" slot="append" style="width:60px">
                                <Option value="0">小时</Option>
                                <Option value="1">天</Option>
                            </Select>
                        </Input>
                        <Tooltip transfer max-width="200" content="最大延迟期限30天" placement="top">
                            <i class="fa fa-question-circle-o"></i>
                        </Tooltip>
                    </RadioGroup>
                </div>
                <div class="mt20">次数限定：
                    <RadioGroup v-model="eventData.countVal">
                        <Radio label="noLimit">
                            不限
                        </Radio>
                        <Radio class="ml10" label="putIn">
                            投放内仅
                            <InputNumber v-model.number="eventData.putInVal" style="width:50px;"></InputNumber>
                            次
                        </Radio>
                        <Radio class="ml10" label="daily">
                            每天最多
                            <InputNumber v-model.number="eventData.dailyVal" style="width:50px;"></InputNumber>
                            次
                        </Radio>
                    </RadioGroup>
                </div>
                <div class="mt16">
                    <Strategy :isEdit="true" @on-change="syChange"></Strategy>
                </div>
            </div>
            <!-- 周期性通知 -->
            <div v-show="interActiveType==2">
                <div>
                    人群更新周期为每月1号，在
                    <DatePicker :editable="false" @on-change="tripDateSelect" v-model="cycleData.timeRange" style="width:280px;" type="daterange" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间区间"></DatePicker>
                    期间，人群更新完成后，在指定发送时间发送
                </div>
                <div class="mt20">
                    指定发送时间：
                    <TimePicker v-model="cycleData.cycleTime" format="HH:mm" placeholder="选择时间" style="width: 112px"></TimePicker>
                </div>
                <div class="mt16">
                    <Strategy :isEdit="true" @on-change="syChange"></Strategy>
                </div>
            </div>
            <!-- 日期通知 -->
            <div v-show="interActiveType==3">
                <div>
                    在
                    <DatePicker :editable="false" @on-change="dateDateSelect" v-model="dateData.timeRange" style="width:280px;" type="daterange" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间区间"></DatePicker>
                    期间 由
                    <Select v-model="dateData.dateType" slot="append" style="width:100px">
                            <Option v-for="item in dateData.dateTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select> 到达触发发出
                    <div class='mt20'>
                        发送时机：
                        <RadioGroup v-model="dateData.countVal">
                            <Radio label="today">
                                当天发出
                            </Radio>
                            <Radio class="ml10" label="putIn">
                                提前
                            </Radio>
                            <Select v-model="dateData.putInVal" style="width:50px;">
                                    <Option v-for='item in dateData.sevenDay' :key='item.value' :value="item.value">{{item.label}}</Option>
                                </Select> 天发出
                            <Radio class="ml10" label="daily">
                                延后
                            </Radio>
                            <Select v-model="dateData.dailyVal" style="width:50px;">
                                    <Option v-for='item in dateData.sevenDay' :key='item.value' :value="item.value">{{item.label}}</Option>
                                </Select> 天发出
                        </RadioGroup>
                    </div>
                </div>
                <div class="mt20">
                    指定发送时间：
                    <TimePicker v-model="dateData.cycleTime" format="HH:mm" placeholder="选择时间" style="width: 112px"></TimePicker>
                </div>
                <div class="mt16">
                    <Strategy :isEdit="true" @on-change="syChange"></Strategy>
                </div>
            </div>
            <!-- 旅程响应 -->
            <div v-show="interActiveType==4">
                <div>
                    在旅程期间
                    <DatePicker disabled v-model="tripResData.timeRange" style="width:280px;" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间区间"></DatePicker>
                    由
                    <!-- 在旅程期间 2018-12-01 09:20:00 至 2018-12-06 23:59:59 由 -->
                    <Select disabled v-model="tripResData.eventVal" style="width:180px;">
                            <Option v-for="item in tripResData.eventList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select> 触发发出
                </div>
                <div class="mt20">发送时机：
                    <RadioGroup v-model="tripResData.modeVal">
                        <Radio label="immediate">
                            立即发送
                        </Radio>
                        <Radio class="ml10" label="delay">
                            延迟发送
                        </Radio>
                        延迟
                        <Input v-model="tripResData.delayTime" style="width:110px;">
                        <Select v-model="tripResData.timeType" slot="append" style="width:60px">
                                <Option value="0">小时</Option>
                                <Option value="1">天</Option>
                            </Select>
                        </Input>
                        <Tooltip transfer max-width="200" content="最大延迟期限30天" placement="top">
                            <i class="fa fa-question-circle-o"></i>
                        </Tooltip>
                    </RadioGroup>
                </div>
                <div class="mt20">次数限定：
                    <RadioGroup v-model="tripResData.countVal">
                        <Radio label="noLimit">
                            不限
                        </Radio>
                        <Radio class="ml10" label="putIn">
                            投放内仅
                            <InputNumber v-model.number="tripResData.putInVal" style="width:50px;"></InputNumber>
                            次
                        </Radio>
                        <Radio class="ml10" label="daily">
                            每天最多
                            <InputNumber v-model.number="tripResData.dailyVal" style="width:50px;"></InputNumber>
                            次
                        </Radio>
                    </RadioGroup>
                </div>
            </div>
            <!-- 旅程通知 -->
            <div v-show="interActiveType==5">
                <div>
                    XX投放单元第N步漏出/转化/裂变人群旅程
                    <p class="mt10">
                        起止时间：2018-12-01 08:50:00 至 2018-12-06 23:59:59
                        <Tooltip transfer max-width="200" content="发送时间必须在该旅程完全结束后" placement="top">
                            <i class="fa fa-question-circle-o"></i>
                        </Tooltip>
                    </p>
                </div>
                <div class="mt20">
                    <RadioGroup v-model="tripNoticData.modeVal">
                        <Radio label="immediate">
                            立即发送<span style="color:#999;">（审核通过后，且活动开始时）</span>
                            <Tooltip transfer max-width="200" content="审核通过后，所选旅程完全结束后立即发送" placement="top">
                                <i class="fa fa-question-circle-o"></i>
                            </Tooltip>
                        </Radio>
                        <Radio class="ml10" label="diytime">
                            指定在
                            <DatePicker format="yyyy-MM-dd HH:mm" v-model="tripNoticData.dateTime" type="datetime" placeholder="选择时间"></DatePicker>
                            发出
                            <Tooltip transfer max-width="200" content="受发送渠道资源影响，发送的具体时间可能会被延后" placement="top">
                                <i class="fa fa-question-circle-o"></i>
                            </Tooltip>
                        </Radio>
                    </RadioGroup>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    import Strategy from '@/components/condition/strategy.vue';

    export default {
        name: 'Mode',
        components: {
            Strategy
        },
        data() {
            return {
                interActiveType: this.$config.interactive_type,
                // interActiveType: '0',
                noticData: {
                    modeVal: 'diytime',
                    dateTime: '2018-08-08 12:24'
                },
                eventData: {
                    timeRange: [],
                    eventList: this.$activity.eventList,
                    eventVal: '0',
                    modeVal: 'delay',
                    delayTime: 2,
                    timeType: '1',
                    countVal: 'daily',
                    putInVal: 3,
                    dailyVal: 4
                },
                cycleData: {
                    timeRange: [],
                    cycleTime: '09:09'
                },
                dateData: {
                    timeRange: [],
                    delayTime: 2,
                    dateTypeList: [{
                        value: '0',
                        label: '开户日'
                    }, {
                        value: '1',
                        label: '客户生日'
                    }],
                    dateType: '1',
                    countVal: 'putIn',
                    sevenDay: [{
                        value: '1',
                        label: '1'
                    }, {
                        value: '2',
                        label: '2'
                    }, {
                        value: '3',
                        label: '3'
                    }, {
                        value: '4',
                        label: '4'
                    }, {
                        value: '5',
                        label: '5'
                    }, {
                        value: '6',
                        label: '6'
                    }, {
                        value: '7',
                        label: '7'
                    }],
                    putInVal: '1',
                    dailyVal: '5',
                    cycleTime: '10:10'
                },
                tripResData: {
                    timeRange: ['2019-01-01 00:00:00', '2019-01-15 23:59:59'],
                    eventList: this.$activity.eventList,
                    eventVal: '1',
                    modeVal: 'delay',
                    delayTime: 3,
                    timeType: '0',
                    countVal: 'daily',
                    putInVal: 7,
                    dailyVal: 2
                },
                tripNoticData: {
                    modeVal: 'diytime',
                    dateTime: '2018-08-08 12:24'
                }
            };
        },
        methods: {
            noticeDateSelect() {
            },
            eventDateSelect(val) {
                this.eventData.timeRange = [val[0], `${val[1].substring(0, 10)}23:59:59`];
            },
            tripDateSelect(val) {
                this.cycleData.timeRange = [val[0], `${val[1].substring(0, 10)}23:59:59`];
            },
            dateDateSelect(val) {
                this.dateData.timeRange = [val[0], `${val[1].substring(0, 10)}23:59:59`];
            },
            syChange() {
            }
        }
    };
</script>

<style lang="less" scoped>
    .advertise-mode {}
</style>
