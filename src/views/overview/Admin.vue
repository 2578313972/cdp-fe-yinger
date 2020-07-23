<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow">
        概览
    </div>
    <div class="page-content container-padding24">
        <div class="f18 mb20">
            服务监控
        </div>
        <Card dis-hover :padding="0" v-if="isShow">
            <AdminCard v-for="(value,key,index) in listData"
                :class="+index%2 !== 0 ? 'admin-bg' : ''"
                :key="index"
                :title="key"
                :data="value">
            </AdminCard>
        </Card>
        <Card dis-hover v-else class="error">
            <p>{{msgTips}}</p>
        </Card>
        <div class="f18 mb20 mt20">
            渠道特性资源监控
        </div>
        <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
    </div>
</div>
</template>

<script>
    import AdminCard from './AdminCard.vue';

    export default {
        name: 'Admin',
        data() {
            return {
                listData: {},
                isShow: false,
                msgTips: '数据加载中...',
                isLoading: false,
                loadingOrNoData: '数据加载中...',
                gridList: {
                    columns: [
                        {
                            title: '渠道名称',
                            key: 'channel_name',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '渠道ID',
                            key: 'channel_code',
                            ellipsis: true,
                            tooltip: true
                        },
                        {
                            title: '激活特性数量',
                            key: 'active_trait_count',
                            ellipsis: true,
                            tooltip: true
                            // align: 'right'
                        },
                        {
                            // align: 'right',
                            renderHeader: h => h('div', {
                                style: {
                                    position: 'relative',
                                    linehHeight: '40px'
                                }
                            }, [
                                h('span', {
                                    style: {
                                        paddingRight: '3px'
                                    }
                                }, '可释放资源数量'),
                                h('Tooltip', {
                                    style: {
                                        display: this.isMember ? 'none' : ''
                                    },
                                    props: {
                                        'max-width': '300',
                                        content: '可释放资源指渠道内占据存储、索引空间的冗余信息，释放它们可以让系统更快速高效。',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [h('i', {
                                    style: {
                                        'font-size': '14px'
                                    },
                                    attrs: {
                                        class: 'fa fa-question-circle-o'
                                    }
                                })])
                            ]),
                            key: 'not_active_trait_in_mapping_count'
                        }
                    ],
                    data: []
                }
            };
        },
        components: {
            AdminCard
        },
        mounted() {
            this.getData();
            this.getResouceData();
            let timer = setInterval(() => {
                this.getData();
            }, 60000);
            this.$once('hook:beforeDestroy', () => {
                clearInterval(timer);
                timer = null;
            });
        },
        methods: {
            getData() {
                this.$axios
                    .get(`${this.$config.apiDomain}/board/monitor-instances`)
                    .then(({
                        data
                    }) => {
                        this.isShow = true;
                        if (this.$lodash.isEmpty(data)) {
                            this.isShow = false;
                            this.msgTips = '暂无服务监控配置';
                            return;
                        }
                        this.listData = data;
                    })
                    .catch(() => {
                        this.isShow = false;
                        this.msgTips = '数据加载失败';
                    });
            },
            // 获取资源数据
            getResouceData() {
                this.isShowInput = false;
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/sys/resource/resource-statistics/traits';
                const params = {
                    rows: -1
                };
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.gridList.data = this.clearData(data.items);
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this.gridList.data = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            clearData(data) {
                const newData = [];
                data.forEach((item) => {
                    newData.push({
                        channel_code: item.channel_code,
                        channel_name: item.channel_name,
                        active_trait_count: item.trait_resource.trait_limit_count == 0 ? `${item.trait_resource.active_trait_count}` : `${item.trait_resource.active_trait_count} / ${item.trait_resource.trait_limit_count}`,
                        not_active_trait_in_mapping_count: item.trait_resource.not_active_trait_in_mapping_count
                    });
                });
                return newData;
            }
        }
    };
</script>

<style lang="less" scoped>
.ivu-card-bordered{
    border:none;
}
</style>
<style lang="less">
.admin-bg{
    & ul {
        background: rgba(23,35,61,0.03);
    }
}
.error{
    position:relative;
    width:100%;
    line-height: 200px;
    p{
        text-align:center;
        font-size:20px;
        color:#bbb
    }
}

</style>
