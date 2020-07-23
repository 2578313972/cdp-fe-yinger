<template>
    <div class="advertising-detail w100 h100">
        <Row class="details-title" type="flex" justify="space-between">
            <Col>
            <Breadcrumb>
                <BreadcrumbItem :to="returnList">返回列表</BreadcrumbItem>
                <BreadcrumbItem :to="returnList">{{breadcrumb[0]}}</BreadcrumbItem>
                <BreadcrumbItem>{{breadcrumb[1]}}</BreadcrumbItem>
            </Breadcrumb>
            </Col>
        </Row>
        <div class="scroll-wrap">
            <Card class="detail-box m10" dis-hover>
                <Form label-position="left" ref="formArea" :model="formItem">
                    <Row>
                        <Col span="16">
                        <Row style="line-height:29px">
                            <Col span="3"> 投放单元名称：
                            </Col>
                            <Col span="10">
                            <edit-input :max-length="20" label="" default-placeholder="请输入名称，20字以内" style="margin-bottom: 0;" label-name="name" :tipContent="formItem.name" :content="formItem.name" :edit-show="nameEditShow" v-on:cancel-edit="cancelEdit" v-on:confirm-info="confirmInfo"
                                v-on:change-status="(status) => changeStatus(status, 'nameEditShow')">
                            </edit-input>
                            </Col>
                            <Col span="2"><span>所属活动：</span></Col>
                            <Col span="6">
                            <Tooltip :content="editContent.activity">
                                <p class="ml10 ellipsis color-blue">{{editContent.activity}}</p>
                            </Tooltip>
                            </Col>
                        </Row>
                        <Row class="detail-height">
                            <Col span="3"><span>投放单元ID：</span></Col>
                            <Col span="10"><span class="ml10 color-blue">DU19011469</span></Col>
                            <Col span="2"><span>交互类型：</span></Col>
                            <Col span="6"><span class="ml10 color-blue">{{responseType[$config.interactive_type]['label']}} 营销类</span></Col>
                        </Row>
                        <Row class="detail-height">
                            <Col span="3"><span>投放类别：</span></Col>
                            <Col span="5">
                            <Select filterable multiple placeholder="请选择投放类别" class="width600">
                                <Option v-for="item in putType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            </Col>
                        </Row>
                        </Col>
                        <Col span="8">
                        <Row>
                            <Col span="3">
                            <p style="margin-top:8px">描述：</p>
                            </Col>
                            <Col span="21">
                            <edit-input :max-length="100" textarea="textarea" label="" default-placeholder="请输入描述，100字以内" style="margin-bottom: 0;" label-name="description" :inputWidth="400" :size-obj="{maxRows:5,minRows:3}" :tipContent="formItem.description" :content="formItem.description"
                                :edit-show="defineEditShow" v-on:cancel-edit="cancelEdit" v-on:confirm-info="confirmInfo" v-on:change-status="(status) => changeStatus(status, 'defineEditShow')">
                            </edit-input>
                            </Col>
                        </Row>
                        </Col>
                        <!-- <Col span="2" style="text-align: right;"> -->
                        <!-- <Button class="mt10" :disabled="disEditBtn" type="dashed" icon="md-create" @click="editUtil">修改</Button> -->
                        <!-- 修改投放单元信息 -->
                        <!-- <Drawer v-model="creatUnit" width="800" :mask-closable="false">
                            <Creat @cancelCreateUnit="cancel" :editContent="editContent" :title="title" @submitCreateUnit="ok"></Creat>
                        </Drawer> -->
                        <!-- </Col> -->
                    </Row>
                </Form>
            </Card>
            <Card dis-hover class="m10 min-height">
                <div class="get-scroll-top">
                    <Row class="step-wrapper" :class="{'fixed-step-wrapper':stepFixed}">
                        <Col span="20">
                        <Steps :current="current" :status="stepStatus">
                            <Step :class="{'current-step': current === tabList.length-1, 'current-color': currentClick === index}" v-for="(item, index) in tabList" :key="index" :title="item.name" :ref="`step${index}`" @click.native="handleClickStep(index, item)"></Step>
                        </Steps>
                        </Col>
                        <Col span="4" style="text-align:right;">
                        <ButtonGroup>
                            <Button style="border-right-color: #5cadff;" :style="{cursor:nextBtnType?'default':'pointer'}" type="primary" @click="next">{{ buttonText }}</Button>
                            <Button style="padding:0;border-left-color: #5cadff;" v-if="nextBtnType" type="primary">
                                        <Dropdown trigger="click" placement="bottom-end">
                                            <div style="padding: 6px 12px;">
                                            <Icon type="md-more"></Icon>
                                            </div>
                                            <DropdownMenu slot="list">
                                                <DropdownItem>
                                                    暂停
                                                </DropdownItem>
                                                <DropdownItem>
                                                    结束
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Button>
                        </ButtonGroup>
                        </Col>
                    </Row>
                </div>
                <Divider />
                <transition name="fade" mode="out-in">
                    <div class="relative-top">
                        <component :is="tabView"></component>
                    </div>
                </transition>
            </Card>
        </div>
    </div>
</template>

<script>
    import Crowd from './Crowd';
    import Touch from './Touch';
    import Mode from './Mode';
    import Content from './Content';
    import Report from './Report';
    import Preview from './Preview';
    import Result from './Result';
    import Creat from '../CreatUnit.vue';
    import EditInput from '@/components/EditInput.vue';

    export default {
        name: 'Detail',
        components: {
            Crowd,
            Touch,
            Mode,
            Content,
            Report,
            Preview,
            Result,
            Creat,
            EditInput
        },
        data() {
            return {
                stepFixed: false,
                fixedWidth: 0,
                disEditBtn: false,
                title: '修改基本信息',
                stepStatus: null,
                currentClick: null,
                returnList: '',
                current: 0,
                nextBtnType: false,
                breadcrumb: this.$activity.breadcrumb,
                responseType: [{
                                   label: '单次通知',
                                   value: '0'
                               },
                               {
                                   label: '事件响应',
                                   value: '1'
                               },
                               {
                                   label: '周期性通知',
                                   value: '2'
                               },
                               {
                                   label: '日期通知',
                                   value: '3'
                               }

                ],
                tabList: [{
                              name: '人群',
                              keyName: 'Crowd'
                          }, {
                              name: '触点',
                              keyName: 'Touch'
                          },
                          {
                              name: '模式',
                              keyName: 'Mode'
                          },
                          {
                              name: '内容',
                              keyName: 'Content'
                          },
                          {
                              name: '报告',
                              keyName: 'Report'
                          },
                          {
                              name: '预览',
                              keyName: 'Preview'
                          }
                ],
                tabView: 'Crowd',
                creatUnit: false,
                editContent: this.$activity.editContent,
                defineEditShow: true,
                nameEditShow: true,
                formItem: {
                    name: '年货节-超级秒杀日，最低1折起',
                    description: '888'
                },
                putType: [{
                              label: '拉新',
                              value: '拉新'
                          },
                          {
                              label: '促活',
                              value: '促活'
                          }
                ]
            };
        },
        computed: {
            buttonText() {
                if (this.current === 5) {
                    if (this.tabView !== 'Preview') {
                        if (this.tabView === 'Result') {
                            this.disEditBtn = true;
                            this.nextBtnType = true;
                            return '投放中';
                        }
                        if (this.currentClick !== null) {
                            return '提交';
                        }
                    } else {
                        return '提交';
                    }
                } else {
                    return '下一步';
                }
                this.nextBtnType = false;
            }
        },
        watch: {},
        mounted() {
            this.initData();
            this.$tools.bus.$on('handle-click-step', (index, isRenew) => {
                if (isRenew) {
                    this.currentClick = null;
                    this.current = index;
                    this.tabView = this.tabList[index].keyName;
                } else {
                    this.handleClickStep(index);
                }
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('handle-click-step');
            // 销毁后解绑resize事件
            window.removeEventListener('resize', this.fixedStep);
            document.querySelector('.main-right').removeEventListener('scroll', () => {});
        },
        methods: {
            initData() {
                this.returnList = {
                    path: '/activity/list',
                    query: {
                    // tabView: this.$route.query.tabView
                    }
                };
                this.$nextTick(() => {
                    this.fixedStep();
                    // 绑定缩放
                    window.addEventListener('resize', this.fixedStep);
                });
            },
            fixedStep() {
                const _this = this;
                const mainRight = document.querySelector('.scroll-wrap');
                const getScrollTop = document.querySelector('.detail-box').offsetTop;
                const stepWrapper = document.querySelector('.step-wrapper');
                this.fixedWidth = document.querySelector('.relative-top').clientWidth;
                mainRight.addEventListener('scroll', () => {
                    stepWrapper.style.width = `${_this.fixedWidth}px`;
                    if (mainRight.scrollTop > getScrollTop + 160 - 74) {
                        _this.stepFixed = true;
                        stepWrapper.style.left = `${-mainRight.scrollLeft + 247}px`;
                    } else {
                        _this.stepFixed = false;
                        stepWrapper.style.left = 'auto';
                    }
                });
            },
            next() {
                this.currentClick = null;
                this.tabView = null;
                this.stepStatus = null;
                if (this.tabView == 'Result') {
                    return;
                }
                if (this.current < 5) {
                    this.current += 1;
                    this.stepStatus = 'process';
                } else {
                    this.tabView = 'Result';
                    this.stepStatus = 'finish';
                    return;
                }
                const tempObj = this.tabList.find((item, index) => this.current === index);
                this.tabView = tempObj.keyName;
            },
            handleClickStep(index, item) {
                if (this.tabView == 'Result') {
                    return;
                }
                if (this.current >= index) {
                    this.stepStatus = null;
                    if (item && item.keyName) {
                        this.tabView = item.keyName;
                    } else {
                        this.tabView = this.tabList[index].keyName;
                    }
                    this.currentClick = index;
                    this.stepStatus = 'finish';
                }
            },
            editUtil() {
                this.creatUnit = true;
            },
            cancel() {
                this.creatUnit = false;
            },
            ok() {
                this.creatUnit = false;
            },
            // 取消修改
            cancelEdit() {
                this.nameEditShow = true;
                this.defineEditShow = true;
                this.$tools.bus.$emit('recovery-edit');
            },
            // 提交修改 验证名称/描述 内容
            confirmInfo(name, value) {
                if (name === 'name') {
                    if (value === '') {
                        this.$Message.destroy();
                        this.$Message.error('请输入名称');
                        this.nameEditShow = false;
                        // 待调试接口时完成
                        // this.formItem[name] = this.crowdListContent.name;
                        return;
                    }
                    // 待调试
                    //    else if( this.crowdListContent.name === value){
                    //        return;
                    //    }
                    if (!(this.$config.reg_input.reg.test(value))) {
                        this.$Message.destroy();
                        this.$Message.error('只支持中英文、数字、下划线，请正确填写');
                        return;
                    }
                    this.nameEditShow = true;
                    this.formItem[name] = value;
                // 待调试 请求数据
                // this.editContent()
                }
                if (name == 'description' && (this.formItem.description === value)) {
                    return;
                }
                this.defineEditShow = true;
                this.formItem[name] = value;
            // 下一步发起请求
            // this.editContent()
            },
            changeStatus(status, name) {
                this[name] = status;
            }
        }
    };
</script>

<style lang="less" scoped>
    .advertising-detail {
        .ellipsis {
            width: 96%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .detail-height {
            line-height: 38px;
        }
        .details-title {
            height: 50px;
            padding: 0 16px;
            background: white;
            line-height: 50px;
            box-shadow: 0px 0px 1px #ccc;
            border: 1px solid #eee;
        }
        .min-height {
            min-height: calc(100% - 200px);
        }
        .step-wrapper {
            padding: 20px 0 0 0;
            .current-step {
                cursor: pointer;
            }
        }
        .fixed-step-wrapper {
            position: fixed;
            top: 50px;
            background: #fff;
            z-index: 11;
            padding-bottom: 22px;
            padding-top: 17px;
            border-bottom: 1px solid #e8eaec;
        }
        .get-scroll-top {
            height: 53px;
        }
    }
</style>

<style lang="less">
    .current-color {
        .ivu-steps-head {
            .ivu-steps-head-inner {
                background: #2d8cf0!important;
                .ivu-steps-icon {
                    color: #fff!important;
                }
            }
        }
    }
</style>
