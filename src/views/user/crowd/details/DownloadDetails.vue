<template>
    <div class="mask-bg">
        <edit-title :isShowBtn="false" title="人群导出任务详情"></edit-title>
        <div class="custom-dialog-content ">
            <div class="m20">
            <Card dis-hover>
                <p slot="title">基本信息</p>
                <Row class="mt10">
                    <Col span="5">
                    <p>任务ID：</p>
                    </Col>
                    <Col span="19">
                    <p>{{exportDetail.id}}</p>
                    </Col>
                </Row>
                <Row class="mt10">
                    <Col span="5">
                    <p>导出特性：</p>
                    </Col>
                    <Col span="19">
                    <p>{{exportDetail.export_config}}</p>
                    </Col>
                </Row>
                  <Row class="mt10">
                    <Col span="5">
                    <p>任务状态：</p>
                    </Col>
                    <Col span="19">
                    <p>{{this.$config.status_config[exportDetail.export_status]}}</p>
                    </Col>
                </Row>
                <Row class="mt10">
                    <Col span="5">
                    <p>导出人：</p>
                    </Col>
                    <Col span="19">
                    <p>{{exportDetail.creator}}</p>
                    </Col>
                </Row>
                <Row class="mt10">
                    <Col span="5">
                    <p>创建时间：</p>
                    </Col>
                    <Col span="19">
                    <p>{{ this.$date(+`${exportDetail.create_time}`).format("YYYY-MM-DD HH:mm:ss") }}</p>
                    </Col>
                </Row>
                <Row class="mt10">
                    <Col span="5">
                    <p>导出模式：</p>
                    </Col>
                    <Col span="19">
                    <p>
                        <span>
                           {{this.$config.status_config[exportDetail.export_cycle]}}
                        </span>
                        <span v-if="exportDetail.export_cycle==='periodic'">
                            <span>{{this.$config.status_config[exportDetail.frequency]}}</span>
                            <span v-if="exportDetail.range!=='L'">{{exportDetail.range}}</span>
                            <span v-if="(exportDetail.frequency ==='monthly')">{{exportDetail.range=="L"?"最后一天":"号"}}</span>
                            <span v-if="exportDetail.calc_deadline">&nbsp;&nbsp;截止时间：{{this.$date(+`${exportDetail.calc_deadline}`).format("YYYY-MM-DD HH:mm:ss")}}</span>
                        </span>
                    </p>
                    </Col>
                </Row>
                <Row class="mt10">
                    <Col span="5">
                        <p>导出文件下载方式：</p>
                    </Col>
                    <Col span="19">
                        <p>
                            <span > {{this.$config.status_config[exportDetail.download_type[0]]}} </span>
                            <span v-if="exportDetail.download_type.length>1">{{this.$config.status_config[exportDetail.download_type[1]]}}</span>
                            <span v-if="exportDetail.notice_accounts">（可下载的外部系统账号：{{exportDetail.notice_accounts}}）</span>
                        </p>
                    </Col>
                </Row>
            </Card>
            <Card dis-hover class="mt10">
                <p slot="title">导出历史</p>
                <a href="#" slot="extra" @click.prevent="stopExporting">
                    <Button type="primary" v-if="isShowButton">停止导出</Button>
                </a>
                <Table class="smce-table-noscroll"  :columns="table_columns" :data="table_list"  :no-data-text="loadingOrNoData" :loading="loading"></Table>
                <Page class="page-style" :total="total" show-elevator :current="change_page" @on-change="changePage"></Page>
            </Card>
        </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        props: {
            crowdCode: {
                type: [String, Number],
                default: ''
            },
            exportDetail: {
                type: Object,
                default: {}
            },
            tabView: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                change_page: 1,
                loading: false,
                table_list: [],
                table_columns: [{
                                    title: '导出时间',
                                    key: 'export_time',
                                    // sortable: 'custom'
                                    ellipsis: true,
                                    tooltip: true,
                                    render: (h, params) => h('span', params.row.export_time ? this.$date(+`${params.row.export_time}`).format('YYYY-MM-DD HH:mm:ss') : '')
                                }, {
                                    title: '导出状态',
                                    key: 'calc_status',
                                    ellipsis: true,
                                    tooltip: true,
                                    render: (h, params) => h('span', [h('span', this.$config.status_config[params.row.calc_status])])
                                },
                                {
                                    title: '操作',
                                    key: 'action',
                                    width: 120,
                                    render: (h, params) => {
                                        const _this = this;
                                        const isShow = _this.tabView !== 'node' && _this.tabView !== 'subordinate';
                                        const status = params.row.support_download;
                                        return h('div', [
                                            h(
                                                'a', {
                                                    style: status && isShow ? {

                                                    } : {
                                                        color: '#999',
                                                        cursor: 'not-allowed'
                                                    },
                                                    on: {
                                                        click: () => {
                                                            if ((status && isShow)) {
                                                                this.downloadButton(params.index, params.row);
                                                            } else {

                                                            }
                                                        }
                                                    }
                                                },
                                                '下载',
                                            )
                                        ]);
                                    }
                                }
                ],
                total: 0,
                loadingOrNoData: '数据加载中...'
            };
        },
        computed: {
            isShowButton() {
                if ((this.exportDetail.export_cycle === 'periodic') && (this.exportDetail.export_status === 'task_executing') && (this.tabView !== 'node') && (this.tabView !== 'subordinate')) {
                    return true;
                }
                return false;
            }
        },
        components: {
            editTitle
        },
        //    created:{},
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getTableList();
            },
            getTableList() {
                this.loadingOrNoData = '数据加载中...';
                const pageSize = '&page=';
                this.loading = true;
                const size = this.change_page || '1';
                this.$axios.get(`${this.$config.apiDomain}/crowds/${this.crowdCode}/exports/${this.exportDetail.id}/records?${pageSize}${size}`)
                    .then(({ data }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.table_list = data.items;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.table_list = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },
            // 切换分页
            changePage(size) {
                this.change_page = size;
                this.getTableList();
            },
            // 下载
            downloadButton(index, row) {
                const exportId = row.export_id;
                const subExportId = row.sub_export_id;
                window.location.replace(`${this.$config.apiDomain}/crowds/exports/${exportId}/download-crowd?sub_export_id=${subExportId}`);
            },
            // 停止导出
            stopExporting() {
                this.$axios.delete(`${this.$config.apiDomain}/crowds/${this.crowdCode}/exports/${this.exportDetail.id}`)
                    .then(() => {
                        this.$tools.bus.$emit('updateExportList', true);
                        this.$Message.destroy();
                        this.$Message.success('停止导出');
                    })
                    .catch(() => {});
            }
        },
        watch: {},
        destroyed() {}
    };
</script>

<style scoped lang="less">

</style>
