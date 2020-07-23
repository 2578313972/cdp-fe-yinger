<template>
    <div class="mask-bg">
        <edit-title title="用户详情" :isShowBtn="false"></edit-title>
        <div class="custom-dialog-content">
            <div class="userContent dialog-padding20 f12">
                <Card dis-hover>
                    <p slot="title">
                        <Icon type="ios-contact" class="big-icon" /> <span>{{userId}}</span>
                    </p>
                    <div v-for="(item,index) in  userinfo" :key="index" class="s-null">
                        <Icon type="md-ionic" class="small-icon" />
                        <strong>{{item.group_name}}</strong>
                        <Table
                            class="user-info smce-table-noscroll td-table-no-border"
                            :columns="columns_info"
                            :data="list[index]"
                            :show-header="false"
                            :disabled-hover="true">
                        </Table>
                    </div>
                </Card>
                <br>
                <Card dis-hover class="pb20">
                    <p slot="title">
                        <Icon type="android-cart" class="big-icon"></Icon> &nbsp;全部行为
                    </p>
                    <Table class="smce-table-noscroll" :columns="tableData.columns" :data="tableData.data" :no-data-text="loadingOrNoData"  :loading="loading"></Table>
                    <Page class="page-style" :total="total" show-elevator :current="currentPage" @on-change="userPageChange"></Page>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        data() {
            return {

                tableData: {
                    data: [],
                    columns: [
                        {
                            title: '事件发生时间',
                            key: 'event_time'
                        },
                        {
                            title: '事件类型',
                            key: 'name'
                        },
                        {
                            title: '事件属性',
                            key: 'event_attributes',
                            ellipsis: true,
                            tooltip: true
                        }
                    ]

                },
                total: 0,
                currentPage: 1,
                userinfo: [],
                loading: false,
                userId: '',
                loadingOrNoData: '数据加载中...',
                list: [], // 详细信息用table显示，list是全部要显示的项，每行4列。
                columns_info: [
                    {
                        title: 'text_0',
                        key: 'text_0',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: 'text_1',
                        key: 'text_1',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: 'text_2',
                        key: 'text_2',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: 'text_3',
                        key: 'text_3',
                        ellipsis: true,
                        tooltip: true
                    }
                ]
            };
        },
        components: { editTitle },
        mounted() {
            this.$tools.bus.$on('userInfo', (userId) => {
                this.userId = userId;
                this.getData(userId);
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('userInfo');
        },
        methods: {
            // 详情内容分上下两部分请求
            getData(id) {
                this.loading = true;
                this.loadingOrNoData = '数据加载中...';
                // 用户详情
                this.$axios.get(`${this.$config.apiDomain}/user-profile/${id}`)
                    .then(({
                        data
                    }) => {
                        data.forEach((item, index) => {
                            const s_list = [];
                            item.trait_list.forEach((s_item, s_index) => {
                                const num = Math.floor(s_index / 4); // 每四个一行，num是第几行。
                                if (s_index % 4 == 0) s_list.push({});
                                this.$set(s_list[num], `text_${s_index % 4}`, `${s_item.name} : ${s_item.value || ''}`);
                            });
                            this.list[index] = s_list;
                        });
                        this.userinfo = data;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                const params = {
                    page: this.currentPage || 1
                };
                // 用户全部行为
                this.$axios.get(`${this.$config.apiDomain}/user-profile/behaviour/${id}`, {
                    params
                })
                    .then(({
                        data
                    }) => {
                        this.tableData.data = [];
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        data.items.forEach((item) => {
                            const arr = [];
                            item.trait_list.forEach((v) => {
                                arr.push(`${v.name}:【${v.value || ''}】`);
                            });
                            this.tableData.data.push({
                                name: item.event_info.name,
                                event_time: item.event_info.event_time,
                                event_attributes: arr.join('\n')
                            });
                        });
                        this.total = data.total;
                        this.loading = false;
                    })
                    .catch((error) => {
                        this.tableData.data = [];
                        this.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                        console.error(error);
                    });
            },
            // 切换分页
            userPageChange(size) {
                this.currentPage = size;
                this.getData(this.userId);
            }
        },
        watch: {}
    };
</script>

<style scoped lang="less">
    .userContent {
        .big-icon {
            font-size: 20px;
            color: #3399FF
        }
        .small-icon {
            font-size: 18px;
        }
        .s-null{
        font-weight:normal
        }
        .s-null+.s-null{
            padding-top: 16px;
            border-top: 1px solid #ccc;
        }
    }
</style>
<style>
    .userContent .user-info .ivu-table-row td{
        border-bottom: none;
    }
    .userContent .user-info .ivu-table:before{
        background-color: transparent;
    }
</style>
