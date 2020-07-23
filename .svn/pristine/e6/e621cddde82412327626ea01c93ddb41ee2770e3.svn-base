<template>
    <div class="auth-outer-system">
        <Card dis-hover :padding="0">
            <h3 class="title padding16-18">
                对以下外部系统授权访问
            </h3>
            <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="columns" :data="data">
                <template slot-scope="{ row, index }" slot="action">
                    <span class="action-button" @click="show(row, index)">{{row.auth_values && row.auth_values.length}} 个</span>
                </template>
            </Table>
        </Card>
        <Drawer
            v-model="isShow"
            width="1000"
            :mask-closable="false">
            <set-trait v-if="isShow"
                :self-trait="false"
                :group-trait="false"
                :URI="URI"
                :item-info="itemInfo"
                @confirm="confirm"
                @close-modal="closeModal"></set-trait>
        </Drawer>
    </div>
</template>

<script>
    import SetTrait from '../internal/Trait.vue';

    export default {
        name: 'outerSystem',
        components: {
            SetTrait
        },
        mounted() {
            this.getData();
        },
        data() {
            return {
                isLoading: true,
                loadingOrNoData: '数据加载中...',
                isShow: false,
                name: '',
                URI: {
                    traits: `${this.$config.apiDomain}/traits`,
                    traitsParams: {
                        authorized: false,
                        lifecycle_status: 'active',
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
                itemInfo: {},
                columns: [{
                              title: '账号名称',
                              key: 'sys_name'
                          },
                          {
                              title: '授权特性',
                              slot: 'action',
                              width: 400
                          }],
                data: []
            };
        },
        methods: {
            getData() {
                this.isLoading = true;
                this.loadingOrNoData = '数据加载中...';
                const url = `${this.$config.apiDomain}/open-platform/auth/list`;
                const params = {
                    size: -1
                };
                this.$axios
                    .get(url, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        this.isLoading = false;
                        this.data = data.items;
                        if (!this.data.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                    })
                    .catch(() => {
                        this.data = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            show(row) {
                this.itemInfo = {
                    titleType: '账号',
                    title: row.sys_name,
                    values: row.auth_values,
                    ...row
                };
                this.isShow = true;
            },
            confirm(info, tagList) {
                const url = `${this.$config.apiDomain}/open-platform/auth/modify/${info.sys_id}`;
                const params = {
                    auth_values: tagList
                };
                this.$axios
                    .put(url, params)
                    .then(() => {
                        this.isShow = false;
                        this.$Message.destroy();
                        this.$Message.success('已修改');
                        // 更新列表
                        this.getData();
                    })
                    .catch(() => {
                        this.isShow = true;
                    });
            },
            closeModal() {
                this.isShow = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .auth-outer-system {
        .action-button {
            color: #2d8cf0;
            cursor: pointer;
        }
        .title {
            font-size: 16px;
            padding-bottom: 16px;
        }
    }
</style>
