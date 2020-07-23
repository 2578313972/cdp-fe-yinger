<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
        <Menu class="pl24" mode="horizontal" theme="light" active-name="insight">
            <MenuItem name="insight">用户档案</MenuItem>
        </Menu>
    </div>
    <div class="userSarchives page-content page-content-tab container-padding24">
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <Col span="20">
                    <Select v-model="crowd_option" filterable @on-change="changeCrowdList" placeholder="请选择全部人群" class="width300">
                        <Option value="all">全部人群包</Option>
                        <Option v-for="item in crowd_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input class="dependant-search" @keyup.native.enter="debounceSearch" @on-change="debounceSearch" v-model="search_name" placeholder="请输入关键字搜索" icon="ios-search">
                    </Input>
                    <span class="total-count">共<i>{{total|formatAmount}}</i>个人</span>
                </Col>
                <Col span="4" style="text-align:right">
                    <Button type="primary" @click="userConfiguration=true" v-role-button="`user_profile_conf_button`">档案配置</Button>
                    <Drawer v-model="userConfiguration" width="1000" :mask-closable="false">
                        <Configuration v-if="userConfiguration" title="档案配置" @cancelUserConfiguration="cancel" @submitCreateUnit="submit" :customizeData="customizeData">
                        </Configuration>
                    </Drawer>
                </Col>
            </Row>
            <div>
                <Table
                    class="smce-table-noscroll td-table-no-border"
                    :columns="usercolumns"
                    :data="user_data"
                    :no-data-text="loadingOrNoData"
                    :loading="loading"
                    @on-sort-change="sortChange">
                </Table>
                <Row class="pageRow padding16-18" type="flex" justify="end">
                    <Page :total="total > max_page * 10 ? max_page * 10 : total" :page-size="10" show-elevator :current="current_page" @on-change="debouncePage"></Page>
                </Row>
                <Drawer v-model="detail" width="1200" :mask-closable="false">
                    <Content></Content>
                </Drawer>
            </div>
        </Card>
    </div>
</div>
</template>

<script>
    import Content from './UserContent.vue';
    import Configuration from './UserConfiguration.vue';

    export default {
        data() {
            return {
                crowd_list: [],
                crowd_option: 'all',
                search_name: '',
                // button_active: false,
                total: 0,
                current_page: 1,
                detail: false,
                user_id: '',
                crowd_id: '',
                usercolumns: [],
                user_data: [],
                loading: false,
                max_page: 0,
                debounceSearch: null,
                debouncePage: null,
                userConfiguration: false,
                customizeData: {},
                loadingOrNoData: '数据加载中...'
            };
        },
        computed: {},
        components: {
            Content,
            Configuration
        },
        created() {
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, this.$config.debounce_wait);
            this.debouncePage = this.$lodash.debounce(this.changePage, this.$config.debounce_wait);
        },
        mounted() {
            this.getCrowdList();
        },
        methods: {
            getCrowdList() {
                this.$axios.get(`${this.$config.apiDomain}/crowds/drop/list/visible`)
                    .then(({
                        data
                    }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        data.items.forEach((item) => {
                            item.value = item.id;
                            item.label = item.name;
                        });
                        this.crowd_list = data.items;
                        this.getData();
                    })
                    .catch(() => {
                        this.loadingOrNoData = '数据加载失败';
                    });
            },
            getData() {
                this.loading = true;
                this.loadingOrNoData = '数据加载中...';
                // 获取配置列头
                this.$axios.get(`${this.$config.apiDomain}/user-profile-config`)
                    .then(({
                        data
                    }) => {
                        if (data) {
                            this.usercolumns = [
                                {
                                    title: 'UID',
                                    key: 'uid',
                                    ellipsis: true,
                                    tooltip: true
                                },
                                {
                                    title: '操作',
                                    align: 'center',
                                    ellipsis: true,
                                    tooltip: true,
                                    render: (h, params) => h('a', {
                                        on: {
                                            click: () => {
                                                this.openDetails(params.index, params.row);
                                            }
                                        }
                                    }, '详情')
                                }
                            ];
                            this.customizeData = data;
                            if (data.list_view_traits.trait_list.length) {
                                data.list_view_traits.trait_list.forEach((item) => {
                                    item.title = item.name;
                                    item.key = item.code;
                                    item.ellipsis = true;
                                    item.tooltip = true;
                                });
                                const customizeColumns = data.list_view_traits.trait_list;
                                this.usercolumns.splice(1, 0, ...customizeColumns);
                            } else {
                                this.loadingOrNoData = '暂无数据';
                            }
                            this.loading = false;
                        }
                    })
                    .catch(() => {
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });

                this.changeCrowdList(this.crowd_option);
            },

            // 切换人群
            changeCrowdList(id) {
                this.current_page = 1;
                id === 'all' ? this.crowd_id = '' : this.crowd_id = id;
                this.getTableData(this.crowd_id);
            },
            // 请求table列表
            getTableData(id) {
                this.loading = true;
                this.loadingOrNoData = '数据加载中...';
                const params = {
                    crowdId: id || this.crowd_id,
                    page: this.current_page || 1,
                    // isMark: this.button_active,
                    // user_name: this.crowd_name，
                    q: this.search_name || ''
                };
                this.$axios.get(`${this.$config.apiDomain}/user-profile/info`, {
                    params
                })
                    .then(({
                        data
                    }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.user_data = data.items;
                        this.total = data.total;
                        this.max_page = data.max_page || 9999999;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.user_data = [];
                        this.total = 0;
                        this.loadingOrNoData = '数据加载失败';
                        this.loading = false;
                    });
            },
            // 日期排序
            sortChange() {
            // asc 小-大  desc 大-小
            },
            // 切换页码
            changePage(size) {
                this.current_page = size;
                this.getTableData(this.crowd_id);
            },
            // 点击搜索
            searIconClick() {
                this.current_page = 1;
                this.getTableData(this.crowd_id);
            },
            openDetails(index, row) {
                this.detail = true;
                this.user_id = row.uid;
                this.$tools.bus.$emit('userInfo', this.user_id);
            },
            cancel(val) {
                this.userConfiguration = val;
            },
            submit() {
                this.userConfiguration = false;
                this.getData();
            }
        },
        watch: {}
    };
</script>

<style scoped lang="less">
    .userSarchives {
        .userNum {
            color: #2d8cf0;
        }
    }
</style>
