<template>
    <div class="mask-bg">
        <edit-title :isShowBtn="false" title="导入特性">
        </edit-title>
        <div class="custom-dialog-content">
            <div class="m20">
                <Card dis-hover>
                    <p slot="title">导入设置</p>
                    <div class="pl10 pr10">
                        <Row type="flex" justify="start" align="middle" class="height">
                            <Col>
                                <span class="download_bt" @click="downloadTemp">下载导入文件模板</span>
                                <Tooltip placement="right" transfer max-width="500">
                                    <i class="fa fa-question-circle-o f16"></i>
                                    <div slot="content">
                                        <p>1、支持文件扩展名：csv；</p><p>2、文件最大不超过1M；</p><p>3、文件内容格式：第一行是标题，从第二行开始是数据行，第一列是UID、从第二列开始是特性ID（从特性详情页面可查询到，一个文件中最多导入10个特性），列之间以英文逗号分隔；</p><p>4、仅限对本渠道已激活的，无更新策略的特性导入；</p><p>5、除滚动时间段和计数器类型的特性，其他类型的特性均支持导入。</p><p>6、日期类型的特性仅允许3种格式：毫秒级时间戳，yyyy-mm-dd，yyyy-mm-dd hh:mm:ss</p>
                                    </div>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between" align="middle" class="height">
                            <Col>
                                <div class="upload">
                                    <Upload
                                        action=""
                                        accept=".csv,text/csv,application/csv,text/comma-separated-values"
                                        :format="['csv']"
                                        :max-size="1024"
                                        :before-upload="handleBeforeUpload">
                                        <Button type="primary" ghost icon="ios-cloud-upload-outline">选择文件</Button>
                                    </Upload>
                                </div>
                                <span class="ml20" v-if="file">
                                    <Icon type="md-attach" />
                                    {{file.name}}
                                    <Icon type="md-close" color="#808695" size="14" class="ml20" @click="delete_file"/>
                                </span>
                            </Col>
                            <Col v-if="file">
                                <Button type="primary" :loading="loadingStatus" @click="upload">上传</Button>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start" align="middle" class="height">
                            <Col>
                                <Checkbox v-model="isSaveUID">保存新增的UID及其特性数据</Checkbox>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
            <div class="import_log m20">
                <Row>
                    <Col>
                        <Table :columns="columns" :data="listData" :no-data-text="loadingOrNoData" :loading="loading"></Table>
                    </Col>
                </Row>
                <Row type="flex" justify="end" class="mt10">
                    <Col>
                        <Page :total="page.total" :current="page.current" show-elevator @on-change="changePage"></Page>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        data() {
            return {
                isSaveUID: false,
                loadingStatus: false,
                file: null,
                page: {
                    total: 0,
                    size: 10,
                    current: 1
                },
                listData: [],
                columns: [
                    {
                        title: '文件名',
                        key: 'file_name',
                        tooltip: true
                    },
                    {
                        title: '文件大小(KB)',
                        key: 'file_size'
                    },
                    {
                        title: '导入人',
                        key: 'creator',
                        tooltip: true
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 200,
                        render: (h, params) => h('span', params.row.create_time ? this.$date(+`${params.row.create_time}`).format('YYYY-MM-DD HH:mm:ss') : '')
                    },
                    {
                        title: '导入状态',
                        key: 'import_status',
                        render: (h, params) => h('span', this.$config.status_config[params.row.import_status])
                    },
                    {
                        title: '新增UID个数',
                        key: 'count_uids'
                    },
                    {
                        title: '导入特性个数',
                        key: 'count_traits'
                    },
                    {
                        title: '未导入文件',
                        render: (h, params) => {
                            if (!params.row.support_download) {
                                return h('span', {
                                    style: {
                                        color: '#808695'
                                    }
                                }, '下载');
                            }
                            return h('span', {
                                style: {
                                    cursor: 'pointer',
                                    color: '#2b85e4'
                                },
                                on: {
                                    click: () => {
                                        this.download(params.row);
                                    }
                                }
                            }, '下载');
                        }
                    }
                ],
                loading: false,
                loadingOrNoData: '数据加载中...'
            };
        },
        methods: {

            // 上传前钩子，验证格式和大小。
            handleBeforeUpload(file) {
                const str = file.name.substr(file.name.length - 4);
                if (str.indexOf('.csv') < 0) {
                    this.$Message.destroy();
                    this.$Message.error('仅支持格式：csv');
                    return false;
                }
                if (file.size / 1024 > 1024) {
                    this.$Message.destroy();
                    this.$Message.error('文件最大不超过1M');
                    return false;
                }
                this.file = file;
                return false;
            },
            // 上传，成功或失败。
            upload() {
                if (!this.file) {
                    this.$Message.destroy();
                    this.$Message.error('请先选择文件');
                    return;
                }
                const formData = new FormData();
                formData.append('file', this.file);
                this.loadingStatus = true;
                this.$axios.post(`${this.$config.apiDomain}/traits/import?save_new=${this.isSaveUID}`, formData)
                    .then(() => {
                        this.loadingStatus = false;
                        this.page.current = 1;
                        this.isSaveUID = false;
                        this.file = null;
                        this.getList();
                    })
                    .catch(() => {
                        this.loadingStatus = false;
                    });
            },

            delete_file() {
                this.file = null;
            },

            // 任务列表
            getList() {
                this.loading = true;
                this.loadingOrNoData = '数据加载中...';
                this.$axios.get(`${this.$config.apiDomain}/traits/import/list`, {
                    params: {
                        rows: this.page.size,
                        page: this.page.current
                    }
                })
                    .then(({ data }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.listData = data.items;
                        this.page.current = data.page;
                        this.page.total = data.total;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.listData = [];
                        this.page.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },

            // 下载导入模板
            downloadTemp() {
                window.location.href = `${this.$config.apiDomain}/traits/import/template`;
            },

            // 下载未导入文件
            download(row) {
                window.location.href = `${this.$config.apiDomain}/traits/import/download/${row.import_id}/non_import`;
            },

            // 分页
            changePage(p) {
                this.page.current = p;
                this.getList();
            }
        },
        components: {
            editTitle
        },
        mounted() {
            this.getList();
        }
    };
</script>

<style scoped lang="less">
    @p16:16px;
    .import_box{
        border: 1px solid #eee;
        background: #fff;
    }
    .import_log{
        .import_box;
        padding: @p16;
    }
    .height{
        height: 50px;
        .download_bt{
            color: #2b85e4;
            font-weight: 500;
            margin-right: 10px;
            cursor: pointer;
        }
    }
    .upload{
        margin-top:7px; display:inline-block;
    }
</style>
