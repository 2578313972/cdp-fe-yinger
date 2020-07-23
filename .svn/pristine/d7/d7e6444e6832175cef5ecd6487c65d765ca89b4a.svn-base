<template>
    <!-- 详情-导出人群  -->
    <div class="w100">
        <Card :dis-hover="true" :class="{'no-paddinng-border':!expandMore}" class="mb20" v-role-button="`crowd_export_button_in_${tabView}`">
            <p slot="title">导出设置</p>
            <a href="javascript:;" slot="extra" @click="contentMore(expandMore)" class="f12">{{expandMore?"收起":"展开"}} </a>
            <div v-show="expandMore">
                <Row type="flex" justify="space-between">
                    <Col span="18">默认将导出用户ID，可选择添加需同时导出的特性</Col>
                    <Col span="6" style="text-align: right;">
                        <Button type="primary" :disabled="hasChanged" :loading="exportSubmit" @click="exportTag">提交</Button>
                    </Col>
                </Row>
                <Row class="mt10">
                    <Col span="4" style="padding-top:8px;"> 选择特性(最多10个) :</Col>
                    <Col span="20">
                        <TraitInput v-bind="trait_params" :closable="true" :count="10" :btnType="true" :URI="URL" :isShowTagList="true" :multiple="true" @on-change="setObject" :value="export_list.objectAndDefine">
                        </TraitInput>
                    </Col>
                </Row>
                <Row class="mt10 h-l h40">
                    <Col span="4">导出模式：</Col>
                    <Col span="20">
                        <RadioGroup v-model="export_cycle" @on-change="changeCalculationType">
                            <Radio label="once">一次性</Radio>
                            <Radio label="periodic" style="margin-left: 22px;">周期性</Radio>
                        </RadioGroup>
                        <!-- 切换每天-每周/每月的时候将col的span修改，以适应页面展示 -->
                        <div v-if="export_cycle=='periodic'" style="display: inline-block;margin-left:-10px;">
                            <Select v-model="periodic_type" class="mr10 w120" @on-change="changePeriodicType">
                                    <Option value="daily">每天</Option>
                                    <Option value="weekly">每周</Option>
                                    <Option value="monthly">每月</Option>
                            </Select>
                            <!-- 按周 -->
                            <Select v-if="export_cycle=='periodic' && periodic_type=='weekly'" v-model="export_list.range" class="w140">
                                <Option v-for="item in week_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <!-- 按月 -->
                            <Select v-if="export_cycle=='periodic' && periodic_type=='monthly'" v-model="export_list.range" class="w140">
                                <Option v-for="(item,index) in 31" :key="index" :value="`${item}`" >每月{{item}}号</Option>
                                <Option value="L">每月最后一天</Option>
                            </Select>
                            <span v-if="export_cycle !=='once'&&export_cycle !==''" class="ml10">截止日期：
                            <DatePicker type="date" :value="export_list.calc_deadline" :options="disabled_data" placeholder="请选择截止日期" style="width: 200px;" @on-change="changeDate"></DatePicker>
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row class="mt10 h-l h40">
                    <Col span="4">导出文件下载方式：</Col>
                    <Col span="20">
                        <CheckboxGroup v-model="export_list.download_type" @on-change="changeDownType">
                            <Checkbox label="manual" disabled><span>手动下载</span></Checkbox>
                            <Checkbox label="auto" :disabled="download_state" v-model="checkbox_state" ><span>外部系统自动下载</span></Checkbox>
                        </CheckboxGroup>
                    </Col>
                </Row>
                <Row class="mt10 h-l" v-if="checkbox_state">
                    <Col span="4">可下载导出的外部账号：</Col>
                    <Col span="20">
                        <button-select count="10" btn-text="请选择外部账号" :tag-list="accountTagList" :data-list="external_account" @on-select-change="addAccount"></button-select>
                    </Col>
                </Row>
                <Drawer v-model="download_detail" width="800" :mask-closable="false">
                    <Detail v-if="download_detail" @cancelDownloadDetial="cancel" @submitDownloadDetail="ok" :crowdCode="crowdCode" :exportDetail="exportDetail" :tabView="tabView"></Detail>
                </Drawer>
            </div>
        </Card>
        <Card :dis-hover="true" class="mb20">
            <p slot="title">人群导出任务（导出文件保留三个月）</p>
            <Table class="smce-table-noscroll" :columns="tableData.columns" :data="tableData.data" :no-data-text="loadingOrNoData" :loading="tableLoading"></Table>
            <Page class="page-style" :total="tableData.total" show-elevator :current="tableData.currentPage" @on-change="changePage"></Page>
        </Card>
    </div>
</template>

<script>
    import Detail from './DownloadDetails';
    import buttonSelect from '@/components/ButtonSelect.vue';

    export default {
        props: {
            crowdCode: {
                type: [String, Number],
                default: ''
            },
            tabView: {
                type: String,
                default() {
                    return '';
                }
            },
            groupInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            crowdListContent: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                week_list: [
                    {
                        value: '1',
                        label: '每周一'
                    },
                    {
                        value: '2',
                        label: '每周二'
                    },
                    {
                        value: '3',
                        label: '每周三'
                    },
                    {
                        value: '4',
                        label: '每周四'
                    },
                    {
                        value: '5',
                        label: '每周五'
                    }, {
                        value: '6',
                        label: '每周六'
                    },
                    {
                        value: '7',
                        label: '每周日'
                    }
                ],
                external_account: [],
                accountTagList: [],
                tableData: {
                    data: [],
                    columns: [
                        {
                            title: '任务ID',
                            key: 'id',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '导出特性',
                            key: 'export_config',
                            ellipsis: true,
                            tooltip: true
                        }, {
                            title: '任务状态',
                            key: 'export_status',
                            render: (h, params) => h('span', [h('span', this.$config.status_config[params.row.export_status])])
                        },
                        {
                            title: '导出人',
                            key: 'creator',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '创建时间',
                            ellipsis: true,
                            tooltip: true,
                            render: (h, params) => h('span', params.row.create_time ? this.$date(+`${params.row.create_time}`).format('YYYY-MM-DD HH:mm:ss') : ' ')
                        },
                        {
                            title: '导出模式',
                            key: 'export_cycle',
                            ellipsis: true,
                            tooltip: true,
                            render: (h, params) => h('span', [h('span', this.$config.status_config[params.row.export_cycle])])
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 140,
                            render: (h, params) => {
                                const downloadStatus = params.row.support_download; // 是否可下载
                                const export_cycle = params.row.export_cycle; // 导出模式
                                const export_status = params.row.export_status; // 导出状态
                                const stopStatus = (export_cycle === 'periodic') && (export_status === 'task_executing'); // 是否可停止
                                const _this = this;
                                const isShow = _this.tabView !== 'node' && _this.tabView !== 'subordinate'; // 是否显示下载和停止
                                return h('div', [
                                    h(
                                        'a', {
                                            on: {
                                                click: () => {
                                                    this.openDetail(params.index, params.row);
                                                }
                                            }
                                        },
                                        '详情',
                                    ),
                                    h(
                                        'a', {
                                            style: (downloadStatus && isShow) ? {
                                                'margin-left': '10px'
                                            } : {
                                                'margin-left': '10px',
                                                color: '#999',
                                                cursor: 'not-allowed'
                                            },
                                            on: {
                                                click: () => {
                                                    if (downloadStatus && isShow) {
                                                        this.downloadButton(params.index, params.row);
                                                    } else {

                                                    }
                                                }
                                            }
                                        },
                                        '下载',
                                    ),
                                    h(
                                        'a', {
                                            style: stopStatus && isShow ? {
                                                'margin-left': '10px'
                                            } : {
                                                'margin-left': '10px',
                                                color: '#999',
                                                cursor: 'not-allowed'
                                            },
                                            on: {
                                                click: () => {
                                                    if (stopStatus && isShow) {
                                                        this.stopDownloading(params.index, params.row);
                                                    } else {

                                                    }
                                                }
                                            }
                                        },
                                        '停止',
                                    )
                                ]);
                            }
                        }
                    ],
                    total: 0,
                    currentPage: 1
                },
                download_detail: false,
                expandMore: true,
                checkbox_state: false,
                periodic_type: '',
                export_cycle: 'once',
                // tagList: [],
                export_list: {
                    export_config: [],
                    externalAccount: [],
                    download_type: ['manual'],
                    range: '',
                    objectAndDefine: {}
                },
                tableLoading: false,
                group_info: {},
                disabled_data: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                exportDetail: null,
                exportSubmit: false,
                URL: {
                    traitsParams: {
                        lifecycle_status: 'active',
                        authorized: false,
                        data_type: this.$config.data_type_list
                    },
                    catalogsParams: {
                        authorized: false,
                        data_type: this.$config.data_type_list
                    },
                    searchParams: {
                        lifecycle_status: 'active',
                        authorized: false,
                        data_type: this.$config.data_type_list
                    }
                },
                dataBack: {},
                loadingOrNoData: '数据加载中...'
            };
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.setDataBack(), this.dataBack);
            },
            download_state() {
                return !this.external_account.length;
            },
            /**
             * tabView==私有的：
             * 特性显示为——私有的特性+公共的特性
             * tabView==运营组的：
             * 特性显示为——运营组的特性+公共的特性
             * tabView==同节点其他的/tabView==下级的
             * 此tab无法添加导出人群 暂时返回{}
             */
            trait_params() {
                if (this.tabView === 'self') {
                    return {
                        selfTrait: true,
                        value: {}
                    };
                } if (this.tabView === 'group') {
                    return {
                        groupTrait: true,
                        group: this.group_info
                    };
                }
                return {};
            }
        },
        components: {
            Detail,
            buttonSelect
        },
        mounted() {
            this.dataBack = this.$lodash.cloneDeep(this.setDataBack());
            this.$tools.bus.$on('updateExportList', (status) => {
                if (status) this.getData();
            });
            this.init();
        },
        methods: {
            init() {
                this.getData();
                this.group_info = {
                    id: this.groupInfo.group_id,
                    name: this.groupInfo.name
                };
                this.status_config = this.$config.status_config;
            },
            setDataBack() {
                return {
                    downloadType: this.export_list.download_type,
                    objectAndDefine: this.export_list.objectAndDefine.value ? this.$lodash.cloneDeep(this.export_list.objectAndDefine.value).sort() : [],
                    exportCycle: this.export_cycle
                };
            },
            getData() {
                // 请求导出列表
                this.tableLoading = true;
                this.loadingOrNoData = '数据加载中...';
                const downloadUrl = '/crowds/';
                const pageSize = '&page=';
                const size = this.tableData.currentPage || '1';
                this.$axios.get(`${this.$config.apiDomain}${downloadUrl}${this.crowdCode}/exports?${pageSize}${size}`)
                    .then(({
                        data
                    }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.tableData.data = data.items;
                        this.tableData.total = data.total;
                        this.tableLoading = false;
                    })
                    .catch(() => {
                        this.tableData.data = [];
                        this.tableData.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.tableLoading = false;
                    });
                // 请求外部账号
                this.$axios.get(`${this.$config.apiDomain}/open-platform/list?isEnabled=true&size=-1`)
                    .then(({
                        data
                    }) => {
                        data.items.forEach((item) => {
                            item.label = item.sys_name;
                            item.value = item.sys_id;
                        });
                        this.external_account = data.items;
                    });
            },
            // 切换导出周期类型：一次性/周期性
            changeCalculationType() {
                this.periodic_type = 'daily';
                this.export_list.range = '';
                this.export_list.calc_deadline = '';
            },
            changeDownType() {
                this.accountTagList = [];
            },
            changePeriodicType() {
                this.export_list.range = '';
            },
            // 展开内容
            contentMore(expandMore) {
                this.expandMore = !expandMore;
            },
            // 添加特性到Tag
            setObject(value) {
                if (value.names.length > 10) {
                    return;
                }
                this.export_list.objectAndDefine = this.$lodash.cloneDeep(value);
                this.clearSetObject(value);
            },
            clearSetObject(obj) {
                // this.tagList = obj.names;
                this.export_list.export_config = obj.names.map((item, index) => ({
                    trait_name: item,
                    trait_code: obj.value[index]
                }));
            },
            // 截止日期
            changeDate(date) {
                this.export_list.calc_deadline = date;
            },
            // 列表详情
            openDetail(index, row) {
                this.exportDetail = row;
                this.download_detail = true;
            },
            // 下载已导出列表中数据
            downloadButton(index, row) {
                const exportId = row.id;
                window.location.replace(`${this.$config.apiDomain}/crowds/exports/${exportId}/download-crowd`);
            },
            // 停止导出
            stopDownloading(index, row) {
                const exportId = row.id;
                this.$axios.delete(`${this.$config.apiDomain}/crowds/${this.crowdCode}/exports/${exportId}`)
                    .then(() => {
                        this.getData();
                        this.$Message.destroy();
                        this.$Message.success('已停止');
                    });
            },
            // 创建导出特性
            exportTag() {
                if (!this.export_cycle) {
                    this.$Message.destroy();
                    this.$Message.error('请选择导出模式');
                    return;
                }
                if (this.export_cycle == 'periodic') {
                    if ((this.periodic_type == 'weekly' || this.periodic_type == 'monthly') && !this.export_list.range) {
                        this.$Message.destroy();
                        this.$Message.error('请选择开始日期');
                        return;
                    }
                    if (!this.export_list.calc_deadline) {
                        this.$Message.destroy();
                        this.$Message.error('请选择截止日期');
                        return;
                    }
                }
                // “外部系统下载”勾选后的数据处理
                if (this.checkbox_state) {
                    if (!this.accountTagList.length) {
                        this.$Message.destroy();
                        this.$Message.error('请选择可下载导出的外部账号');
                        return;
                    }
                    this.accountTagList.forEach((item) => {
                        this.export_list.externalAccount.push(item.value);
                    });
                }

                this.exportSubmit = true;
                const params = {
                    export_config: this.export_list.export_config,
                    export_cycle: this.export_cycle,
                    frequency: this.export_cycle === 'once' ? undefined : this.periodic_type,
                    notice_accounts: this.export_list.externalAccount || undefined,
                    download_type: this.export_list.download_type,
                    calc_deadline: this.export_list.calc_deadline || undefined,
                    range: this.export_list.range || undefined
                };
                this.$axios.post(`${this.$config.apiDomain}/crowds/${this.crowdCode}/exports`, params)
                    .then(() => {
                        this.$Message.destroy();
                        this.$Message.success('已添加到导出列表，计算完成后可点击下载');
                        this.getData();
                        // 置空
                        this.export_list = {
                            export_config: [],
                            externalAccount: [],
                            download_type: ['manual'],
                            range: '',
                            objectAndDefine: {}
                        };
                        this.export_cycle = '';
                        this.checkbox_state = false;
                        this.accountTagList = [];
                        setTimeout(() => {
                            this.exportSubmit = false;
                        }, 300);
                    })
                    .catch(() => {
                        this.exportSubmit = false;
                    });
            },
            // 切换分页，重新渲染列表
            changePage(size) {
                this.tableData.currentPage = size;
                this.getData();
            },
            cancel(value) {
                this.download_detail = value;
            },
            ok() {
                this.download_detail = false;
            },
            // 添加外部账号
            addAccount(value) {
                this.accountTagList = value;
            }
        },
        beforeDestroy() {
            this.$tools.bus.$off('updateExportList');
        }
    };
</script>

<style scoped lang="less">
    .w120 {
        width: 120px
    }
    .w140 {
        width: 140px
    }
    .h40 {
        height: 40px;
    }
    .h-l {
        line-height: 40px
    }
    .show-disabled {
        width: 100%;
        height: 200px;
        position: absolute;
        top: 60px;
        cursor: not-allowed;
        z-index: 3
    }
</style>
