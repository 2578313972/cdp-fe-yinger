<template>
    <div class="advertise-report">
        <Form>
            <Card dis-hover>
                <p slot="title">漏斗配置</p>
                <Row class="step-sub-title">
                    <Col span="5">
                        <span class="item">漏斗窗口期</span>
                        <InputNumber class="item" :max="90" :min="0" v-model="value"></InputNumber>
                        <span class="item">天</span>
                        <Tooltip max-width="200" transfer content="配置进入漏斗到最后一步的最大转化时间">
                            <i class="fa fa-question-circle-o f14"></i>
                        </Tooltip>
                    </Col>
                    <Col span="19" class="step-title-list-wrapper">
                        <transition name="fade">
                            <span v-if="!isShowConfig" class="step-title-list">
                                <span class="lite-detail" v-for="(item, index) in totalList" :key="index">
                                    <span key="name">步骤{{ index+1 }}：</span>
                                    <span key="content">{{ item.content }}&nbsp;&nbsp;&nbsp;</span>
                                </span>
                            </span>
                        </transition>
                        <Icon type="ios-arrow-forward"
                            size="18"
                            class="spread-icon"
                            :class="{'down': isShowConfig}"
                            @click="handleSpread('isShowConfig')"/>
                    </Col>
                </Row>
                <Divider v-show="!isShowConfig" class="line"/>
                <transition name="fade">
                    <div v-show="isShowConfig">
                        <template v-for="(item, index) in staticList">
                            <Card dis-hover :key="item.index" class="simple-step">
                                <span class="item">{{ item.name }}</span>
                                <span class="step-icon item">{{ index+1 }}</span>
                                <span class="item">{{ item.content }}</span>
                            </Card>
                        </template>
                        <Card dis-hover class="complex-step" v-for="(item, index) in dynamicList" :key="index">
                            <div class="complex-content-wrapper">
                                <div class="step-title">
                                    <span class="item">{{ item.name }}</span>
                                    <span class="step-icon item">{{ staticList.length+index+1 }}</span>
                                    <EditInput class="edit-title item"
                                        :content="item.content"
                                        :edit-show="item.isTitleView"
                                        @change-status="(status) => changeStatus(status, index)"
                                        @confirm-info="(labelName, val) => editStepName(labelName, val, index)"
                                    ></EditInput>
                                    <span class="icon-wrapper">
                                        <Icon type="ios-trash" size="18" @click="handleDelete(index)" class="item"/>
                                        <Icon type="ios-arrow-forward"
                                            size="18"
                                            class="item"
                                            :class="{'down': item.isSpread}"
                                            @click="handleSpread('isShowItem', index)"/>
                                    </span>
                                </div>
                                <transition name="fade">
                                    <Card dis-hover v-if="item.isSpread" class="step-content">
                                        <Row slot="title">
                                            <Col span="8">
                                                <span class="item">触发事件</span>
                                                <Select v-model="touchVal" class="event-choice item">
                                                    <Option v-for="item in touchList"
                                                        :value="item.value"
                                                        :key="item.value">{{ item.label }}</Option>
                                                </Select>
                                            </Col>
                                            <Col span="6" class="choice-item">
                                                <span class="item">是否精准</span>
                                                <Switch class="item" v-model="item.isExact" size="large">
                                                    <span slot="open">ON</span>
                                                    <span slot="close">OFF</span>
                                                </Switch>
                                                <Tooltip max-width="200" transfer content="打开后事件必须携带UID" class="item">
                                                    <i class="fa fa-question-circle-o f14"></i>
                                                </Tooltip>
                                            </Col>
                                            <Col span="10" class="choice-item">
                                                <span class="item">是否包含裂变</span>
                                                <Switch class="item" v-model="item.isFission" size="large">
                                                    <span slot="open">ON</span>
                                                    <span slot="close">OFF</span>
                                                </Switch>
                                                <Tooltip max-width="200" transfer content="打开后UID必须包含在上一个步骤中" class="item">
                                                    <i class="fa fa-question-circle-o f14"></i>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                        <div>
                                        <Strategy :isEdit="true" @on-change="syChange"></Strategy>
                                        </div>
                                    </Card>
                                </transition>
                            </div>
                        </Card>
                    </div>
                </transition>
                <Button type="primary" class="add-step" @click="addStep" :disabled="!isCanAddStep">添加步骤</Button>
            </Card>
        </Form>
    </div>
</template>
<script>
    import EditInput from '@/components/EditInput.vue';
    import Strategy from '@/components/condition/strategy.vue';

    export default {
        name: 'Report',
        components: {
            EditInput,
            Strategy
        },
        computed: {
            totalList() {
                return this.staticList.concat(this.dynamicList);
            },
            isCanAddStep() {
                const totalList = this.staticList.length + this.dynamicList.length;
                return totalList !== 7;
            }
        },
        data() {
            return {
                value: 1,
                title: '',
                touchVal: '',
                isShowConfig: true,
                touchList: this.$activity.eventList,
                staticList: [{
                    name: '步骤',
                    content: '计划发送'
                }, {
                    name: '步骤',
                    content: '预计发送'
                }, {
                    name: '步骤',
                    content: '发送成功'
                }],
                dynamicList: [{
                    name: '步骤',
                    content: '触发事件：点击短链',
                    isSpread: true,
                    isTitleView: true,
                    isExact: false,
                    isFission: false
                }],
                conditions: []
            };
        },
        methods: {
            editStepName(labelName, val, index) {
                this.dynamicList[index] = Object.assign(this.dynamicList[index], {
                    content: val,
                    isTitleView: true
                });
            },
            changeStatus(status, index) {
                this.dynamicList[index].isTitleView = status;
            },
            handleSpread(name, index) {
                if (typeof index === 'undefined') {
                    this[name] = !this[name];
                } else {
                    this.dynamicList[index].isSpread = !this.dynamicList[index].isSpread;
                }
            },
            handleDelete(index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: `确认删除步骤${index}吗`,
                    onOk: () => {
                        this.dynamicList.splice(index, 1);
                    }
                });
            },
            addStep() {
                const totalList = this.staticList.length + this.dynamicList.length;
                if (totalList < 7) {
                    this.dynamicList.push({
                        name: '步骤',
                        content: '触发事件：点击短链',
                        isSpread: true,
                        isTitleView: true,
                        isExact: false,
                        isFission: false
                    });
                    this.isShowConfig = true;
                }
            },
            syChange() {

            }
        }
    };
</script>
<style lang="less" scoped>
.advertise-report {
    .item {
        margin-right: 6px;
    }
    .down {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
    }
    .is-show {
        display: none;
    }
    .step-sub-title {
        margin-bottom: 16px;
        font-weight: bold;
        color: #17233d;
        line-height: 34px;
        .spread-icon {
            line-height: 32px;
            float: right;
        }
        .lite-detail {
            font-weight: normal;
            padding-left: 12px;
            display: inline-block;
        }
    }
    .line {
        margin: 8px 0 16px;
    }
    .simple-step, .complex-step {
        margin: 16px 0;
        .step-icon {
            display: inline-block;
            width: 18px;
            height: 18px;
            color: #fff;
            line-height: 18px;
            text-align: center;
            background-color: #2d8cf0;
            border-radius: 50%;
        }
    }
    .complex-step  {
        .complex-content-wrapper {
            .icon-wrapper {
                float: right;
                line-height: 38px;
            }
            .step-content {
                margin-top: 16px;
            }
            .edit-title {
                margin-bottom: 0;
                vertical-align: baseline;
                display: inline-block;
                width: 30%;
            }
            .event-choice {
                width: 60%;
            }
            .choice-item {
                line-height: 34px;
            }
        }
    }
}
</style>
