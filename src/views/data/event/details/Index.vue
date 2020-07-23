<template>
    <div class="event-detail">
        <div class="head bottom-shadow">
            <Row justify="center" align="middle" style="line-height:48px;">
                <Col span="16">
                    <Breadcrumb separator="">
                        <BreadcrumbItem :to="returnList">
                            <Icon type="md-arrow-back" size="24" color="rgba(23,35,61,0.55)" />
                        </BreadcrumbItem>
                        <Form class="edit-event-name">
                            <edit-input
                                class="event-name"
                                v-role-button="`event_curd_self_def`"
                                label-name="name"
                                default-placeholder="请输入事件名称"
                                :value="formValidate.name"
                                :edit-show="editName"
                                :show-icon-special="eventDetail.event_type !=='system_event'"
                                @change="changeInfo($event,'name')"
                                @confirm-info="confirmInfo"
                                @cancel-edit="cancelEdit('name')"
                                @change-status="(status) => changeStatus(status, 'editName')">
                            </edit-input>
                        </Form>
                    </Breadcrumb>
                </Col>
                <Col span="8" class="text-align-r">
                    <Button icon="md-download" v-role-button="`export_event_conf_button`" @click="exportEventConfig">导出事件配置</Button>
                </Col>
            </Row>
            <div class="event-info-box">
                <Form label-position="left" ref="formArea" :model="formValidate" :label-width="82">
                    <Row>
                        <Col style="width:900px;margin-bottom:15px;">
                            <edit-input
                                class="event-edit"
                                v-role-button="`event_curd_self_def`"
                                width="800px"
                                textarea="textarea"
                                label-name="description"
                                :max-length="100"
                                default-placeholder="请输入事件描述"
                                :value="formValidate.description"
                                :edit-show="editDescription"
                                :show-icon-special="eventDetail.event_type !=='system_event'"
                                @change="changeInfo($event,'description')"
                                @confirm-info="confirmInfo"
                                @cancel-edit="cancelEdit('description')"
                                @change-status="(status) => changeStatus(status, 'editDescription')">
                            </edit-input>
                        </Col>
                    </Row>
                    <div class="event-info mb10">
                        <span class="font-key">事件ID：</span>
                        <span class="font-value">{{eventDetail.code}}</span>
                        <!-- <span class="font-key ml20">事件类型：</span>
                        <span class="font-value">{{eventDetail.event_type}}</span> -->
                    </div>
                </Form>
            </div>
        </div>
        <div class="container-padding24 table-box">
            <Card dis-hover>
                <Row>
                    <Col span="8" offset="16" style="text-align:right;">
                        <Button v-if="eventDetail.event_type !=='system_event'" icon="md-add" type="primary" @click="attributeConfig=true" v-role-button="`event_trait_conf_button_self_def`">添加属性</Button>
                    </Col>
                </Row>
                <div class="mt16 mb16">
                    <Table class="smce-table-noscroll" :loading="loading" :no-data-text="loadingOrNoData" :columns="eventColumns" :data="eventDetail.eventData"></Table>
                </div>
            </Card>
        </div>
        <Drawer v-model="attributeConfig" width="980" :mask-closable="false">
            <Config v-if="attributeConfig" :title="title" :eventCode="eventDetail.code" @cancelAttributeConfig="cancel" @submitAttributeConfig="submit"></Config>
        </Drawer>
        <Spin fix v-if="showSpin"></Spin>
    </div>
</template>

<script>
    import Config from '../AttributeConfig.vue';
    import EditInput from '@/components/EditInput.vue';

    export default {
        props: {},
        data() {
            return {
                infoBox: null,
                scrollHeight: null,
                headBox: null,
                tableBox: null,
                showSpin: true,
                title: '配置属性',
                eventCode: '',
                loading: true, // table 的loading
                eventData: [],
                loadingOrNoData: '数据加载中...',
                eventDetail: {},
                attributeConfig: false,
                returnList: {},
                formValidate: {
                    name: '',
                    description: ''
                },
                editName: true,
                editDescription: true
            };
        },
        computed: {
            eventColumns() {
                const columns = [
                    {
                        title: '属性ID',
                        key: 'code',
                        ellipsis: true, // 超出省略
                        tooltip: true
                    },
                    {
                        title: '属性名称',
                        key: 'name',
                        ellipsis: true, // 超出省略
                        tooltip: true,
                        width: 210
                    },
                    {
                        title: '属性类型',
                        key: 'event_type',
                        ellipsis: true, // 超出省略
                        tooltip: true,
                        render: (h, params) => h('span', [
                            h('span', this.$config.status_config[params.row.data_type])
                        ])
                    },
                    {
                        title: '可选值',
                        key: 'optional_config_str',
                        ellipsis: true, // 超出省略
                        tooltip: true
                    },
                    {
                        title: '描述',
                        key: 'description',
                        ellipsis: true, // 超出省略
                        tooltip: true
                    }
                ];
                const operateColumns = {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => h('div', [
                        h(
                            'a', {
                                on: {
                                    click: () => {
                                        this.debounceDelAttribute(params.row);
                                    }
                                }
                            },
                            '删除'
                        )
                    ])
                };
                // 根据当前角色判断是否添加“操作”按钮，只有渠道管理员有权限添加
                if (
                    this.$config.login_info.role_id === 'ROLE_C_ADMIN'
                    && this.eventDetail.event_type !== 'system_event'
                ) {
                    columns.push(operateColumns);
                }
                return columns;
            }
        },
        components: {
            Config,
            EditInput
        },
        created() {
            this.debounceDelAttribute = this.$lodash.debounce(
                this.delAttribute,
                this.$config.debounce_wait
            );
        },
        mounted() {
            this.$tools.bus.$on('updataEventDetail', () => {
                this.eventDetail = {};
                this.getData();
                this.$nextTick(() => {
                    this.resetHead();
                });
            });

            this.getData();

            this.infoBox = document.querySelector('.event-info-box');
            this.scrollHeight = document.querySelector('.main-right');
            this.headBox = document.querySelector('.head');
            this.tableBox = document.querySelector('.table-box');

            this.scrollHeight.addEventListener('scroll', this.handleScroll, false);
            document.querySelector('.ivu-layout-sider-trigger').addEventListener('click', () => {
                this.scrollHeight.scrollTop = 0;
            }, false);
        },
        methods: {
            handleScroll() {
                if (!this.headBox) {
                    return;
                }
                if (this.scrollHeight.scrollTop >= this.headBox.offsetHeight) {
                    this.headBox.style.width = `${this.scrollHeight.offsetWidth}px`;
                    this.infoBox.style.display = 'none';
                    this.headBox.style.position = 'fixed';
                    this.headBox.style.zIndex = '10';
                    this.tableBox.style.marginTop = '100px';
                    this.headBox.style.top = '63px';
                } else {
                    this.resetHead();
                }
            },
            resetHead() {
                this.infoBox.style.display = 'block';
                this.headBox.style.position = 'static';
                this.headBox.style.width = '100%';
                this.tableBox.style.marginTop = '0';
            },
            getData() {
                this.eventCode = this.$route.query.code;
                this.loading = true;
                this.showSpin = true;
                this.loadingOrNoData = '数据加载中...';
                this.$axios
                    .get(`${this.$config.apiDomain}/events/${this.eventCode}`)
                    .then(({
                        data
                    }) => {
                        this.updateEvent(data);
                    })
                    .catch(() => {
                        this.showSpin = false;
                        this.loading = false; // table的loading
                        this.loadingOrNoData = '数据加载失败';
                        this.eventDetail.eventData = []; // table数据置空
                    });
                this.returnList = {
                    path: '/event'
                };
            },
            delAttribute(row) {
                let isSubmited = false; // 为解决loading取消modal关闭时发送的请求
                this.$Modal.confirm({
                    title: '确认删除此属性？',
                    content: `属性名称：${row.name}`,
                    loading: true,
                    onOk: () => {
                        if (isSubmited) {
                            return;
                        }
                        this.$axios
                            .delete(
                                `${this.$config.apiDomain}/events/${this.eventCode}/relation/trait/${row.code}`
                            )
                            .then(({
                                data
                            }) => {
                                this.getData();
                                isSubmited = true;
                                this.$Modal.remove();
                                this.$Message.destroy();
                                this.$Message.success('已删除');
                                if (!data.traits.length) {
                                    this.loadingOrNoData = '暂无数据';
                                }
                            })
                            .catch(() => {
                                this.$Modal.remove();
                            });
                    },
                    onCancel: () => {}
                });
            },
            // 提交配置属性弹框
            submit(data) {
                this.attributeConfig = false;
                this.getData(data);
            },
            // 关闭配置属性弹框
            cancel(value) {
                this.attributeConfig = value;
            },
            exportEventConfig() {
                window.location.replace(
                    `${this.$config.apiDomain}/events/${this.eventDetail.code}/export`
                );
            },
            editContent() {
                const params = {
                    code: this.eventCode,
                    name: this.formValidate.name || this.eventDetail.name,
                    description: this.formValidate.description
                };
                this.$axios.put(`${this.$config.apiDomain}/events/${this.eventCode}`, params)
                    .then(({
                        data
                    }) => {
                        this.updateEvent(data);
                        this.$Message.destroy();
                        this.$Message.success('已修改');
                    })
                    .catch(() => {
                        const {
                            name,
                            description
                        } = this.eventDetail;
                        this.formValidate = {
                            name,
                            description
                        };
                    });
            },
            changeStatus(status, name) {
                this[name] = status;
            },
            confirmInfo(val, name) {
                if (name === 'name') {
                    if (val === '') {
                        this.$Message.destroy();
                        this.$Message.error('请输入名称');
                        this.editName = true;
                        return;
                    }
                    if (this.eventDetail.name === val) {
                        return;
                    }
                    if (!(this.$config.reg_input.reg.test(val))) {
                        this.$Message.destroy();
                        this.$Message.error('只支持中英文、数字、下划线，请正确填写');
                        return;
                    }
                    this.editName = true;
                    this.formValidate[name] = val;
                    this.editContent();
                }
                if (name === 'description') {
                    if (this.eventDetail.description === val) {
                    } else {
                        this.editDescription = true;
                        this.formValidate[name] = val;
                        this.editContent();
                    }
                }
            },
            cancelEdit(name) {
                this.editName = true;
                this.editDescription = true;
                this.formValidate[name] = this.eventDetail[name];
            },
            // 修改名称/描述 的验证
            changeInfo(ev, name) {
                this.formValidate[name] = ev;
            },
            updateEvent(data) {
                this.loading = false;
                this.showSpin = false;
                this.eventDetail = data;
                this.formValidate.name = data.name;
                this.formValidate.description = data.description;
                if (!data.traits.length) {
                    this.loadingOrNoData = '暂无数据';
                    this.eventDetail.eventData = [];
                } else {
                    data.traits.forEach((item) => {
                        item.optional_config_str = (item.optional_config && item.optional_config.values && item.optional_config.values.length) ? item.optional_config.values.join() : '-';
                    });
                    this.eventDetail.eventData = data.traits;
                }
            }
        },
        watch: {},
        destroyed() {},
        beforeDestroy() {
            this.scrollHeight.removeEventListener('scroll', this.handleScroll, false);
            this.infoBox = null;
            this.scrollHeight = null;
            this.headBox = null;
            this.tableBox = null;
            this.$tools.bus.$off('updataEventDetail');
        }
    };
</script>

<style scoped lang="less">
    .event-detail {
        height: 100%;
        .head {
            width: 100%;
            // height: 160px;
            background: white;
            border: 1px solid #eee;
            padding: 0 10px;
            .event-name {
                font-size: 20px;
                color: #17233d;
                font-weight: 400;
            }
            .event-desciribe {
                height: 46px;
                color: rgba(23, 35, 61, 0.55);
            }
        }
        .table-box {
            // height: calc(100% - 54px);
            // overflow: auto;
            z-index: -200;
            .event-info {
                color: rgba(23, 35, 61, 0.75);
                line-height: 22px;
            }
            .font-key {
                display: inline-block;
                width: 82px;
                font-family: "PingFangSC-Medium";
            }
            .font-value {
                font-family: "Roboto-Regular";
            }
        }
    }
</style>
<style lang="less">
    .edit-event-name{
        display:inline-block;
        width:600px;
        // height: 50px;
        .edit-input-label{
            font-size: 18px;
        }
    }
    .event-info-box{
        color: #17233d;
        padding-left: 44px;
        .event-edit {
            .ivu-form-item-label{
                width: 0!important;
                padding:0;
            }
            .ivu-form-item-content{
                margin-left: 0!important;
                color: rgba(23, 35, 61, 0.55);
                .edit-input-label{
                    line-height: 25px;
                }
                textarea{
                    height: 58px!important;
                    min-height: 58px!important;
                }
            }
        }
        .event-name{
            padding:0 20px;
            .ivu-form-item-label{
                width: 70px!important;
                padding:10px 0;
                font-weight: normal;
                color: #17233d;
            }
            .ivu-form-item-content{
                margin-left: 70px!important;
                line-height: 34px;
            }
            .ivu-form-item{
                max-width: 100%!important;
            }
        }
    }
</style>
