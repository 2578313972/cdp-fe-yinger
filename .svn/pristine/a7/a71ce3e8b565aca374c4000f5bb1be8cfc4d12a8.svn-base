<template>
    <div>
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <div class="title">对以下渠道授权访问</div>
            </Row>
            <Row>
                <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
                <!-- <Row class="pageRow mt16" type="flex" justify="end">
                    <Page :total="total" :pageSize="pageSize" :current="currentPage" show-elevator @on-change="pageChange"></Page>
                </Row> -->
            </Row>
        </Card>
        <Drawer v-model="showDetail" width="1000" :mask-closable="false">
            <component v-if="showDetail" :is="detailName"
                :self-trait="false"
                :group-trait="false"
                :URI="URI"
                :itemInfo="itemInfo"
                @confirm="confirm"
                @close-modal="closeModal">
            </component>
        </Drawer>
    </div>
</template>

<script>
    import Trait from './Trait.vue';
    import Event from './Event.vue';

    export default {
        data() {
            return {
                showDetail: false,
                // currentPage: 1,
                // pageSize: 10,
                // total: 0,
                loadingOrNoData: '数据加载中...',
                isLoading: true,
                itemInfo: {},
                detailName: '',
                URI: {
                    traitsParams: {
                        authorized: false,
                        data_type: this.$config.data_type_list
                    },
                    catalogsParams: {
                        authorized: false,
                        data_type: this.$config.data_type_list
                    },
                    searchParams: {
                        authorized: false,
                        data_type: this.$config.data_type_list
                    }
                },
                gridList: {
                    columns: [{
                                  title: '渠道名称',
                                  key: 'target_channel_name',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '渠道类型',
                                  key: 'target_channel_type',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '渠道ID',
                                  key: 'target_channel_code',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '授权特性',
                                  key: 'action',
                                  width: 150,
                                  render: (h, params) => {
                                      const statusFlag = !params.row.idmapping;
                                      return h('div', [
                                          h(
                                              'a', {
                                                  style: statusFlag && {
                                                      color: '#999',
                                                      cursor: 'not-allowed'
                                                  },
                                                  on: {
                                                      click: () => {
                                                          if (statusFlag) {
                                                              return;
                                                          }
                                                          this.actionDetailName(params, 'Trait');
                                                      }
                                                  }
                                              },
                                              `${params.row.trait_auth}个`,
                                          )
                                      ]);
                                  }
                                  // }, {
                                  //     title: "授权事件",
                                  //     key: "action",
                                  //     width: 150,
                                  //     render: (h, params) => {
                                  //         let statusFlag = !params.row.idmapping;
                                  //         return h("div", [
                                  //             h(
                                  //                 "a", {
                                  //                     style: statusFlag && {
                                  //                         color: "#999",
                                  //                         cursor: "not-allowed"
                                  //                     },
                                  //                     on: {
                                  //                         click: () => {
                                  //                             if (statusFlag) {
                                  //                                 return;
                                  //                             }
                                  //                             this.actionDetailName(params, 'Event');
                                  //                         }
                                  //                     }
                                  //                 },
                                  //                 `${params.row.event_auth}个`
                                  //             )
                                  //         ]);
                                  //     }
                                  // }, {
                                  //     title: "授权触点",
                                  //     key: "action",
                                  //     width: 150,
                                  //     render: (h, params) => {
                                  //         return h("div", [
                                  //             h(
                                  //                 "a", {
                                  //                     style: {
                                  //                     },
                                  //                     on: {
                                  //                         click: () => {
                                  //                             this.actionDetailName(params,'Touch');
                                  //                         }
                                  //                     }
                                  //                 },
                                  //                 `${params.row.touch_point_auth}个`
                                  //             )
                                  //         ]);
                                  //     }
                              }
                    ],
                    data: []
                }
            };
        },
        components: {
            Trait,
            Event
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 授权特性、事件、触点
            actionDetailName(itemInfo, name) {
                const itemCode = itemInfo.row;
                if (name == 'Trait') {
                    const apiUrl = `/res-auth/source-channel/cur-channel/target-channel/${itemCode.target_channel_code}/traits-auth`;
                    const params = {};
                    this.$axios
                        .get(`${this.$config.apiDomain}${apiUrl}`, {
                            params
                        })
                        .then(({
                            data
                        }) => {
                            this.itemInfo = {
                                title: itemInfo.row.target_channel_name,
                                titleType: '渠道',
                                values: data.auth_info && data.auth_info.map(item => ({
                                    name: item.source_name,
                                    code: item.source_code
                                })),
                                ...itemCode
                            };
                        });
                } else if (name == 'Event') {
                    this.itemInfo = {
                        title: '渠道',
                        ...itemCode
                    };
                } else if (name == 'Touch') {
                    return;
                }
                this.detailName = name;
                this.showDetail = true;
            },
            // 获取列表数据
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/res-auth/statistics';
                const params = {
                    // page: this.currentPage,
                    // page_size: this.pageSize,
                    size: -1
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
                        // data.items.forEach(item => {
                        // });
                        this.gridList.data = data.items;
                        this.total = data.total;
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this.total = 0;
                        this.gridList.data = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            // 切换页码
            // pageChange(page) {
            //     this.currentPage = page;
            //     this.getData()
            // },
            confirm(itemCode, tagList) {
                const apiUrl = `/res-auth/source-channel/cur-channel/target-channel/${itemCode.target_channel_code}/traits-auth`;
                const params = tagList.map(item => item.code);
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`, params)
                    .then(() => {
                        this.showDetail = false;
                        this.$Message.destroy();
                        this.$Message.success('已修改');
                        // 更新列表
                        this.getData();
                    })
                    .catch((error) => {
                        if (error.response.data.sub_code == 'ERROR_CROSS_CHANNEL_TRAIT_ACTIVE_THRESHOLD') {
                            this.$Message.destroy();
                            this.$Message.error({
                                content: error.response.data.message,
                                duration: 7
                            });
                        }
                        this.showDetail = true;
                    });
            },
            closeModal() {
                this.showDetail = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .title {
        font-size: 16px;
        font-weight: bold;
    }
</style>
