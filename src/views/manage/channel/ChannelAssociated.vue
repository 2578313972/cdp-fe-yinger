<template>
    <Card dis-hover :padding="0" class="channel-associated">
        <!-- 渠道关联列表 -->
        <Row type="flex" justify="end" class="padding16-18">
            <Col>
            <Button type="primary" icon="md-add" @click="addChannel(true)">新建渠道关联</Button>
            </Col>
        </Row>
        <Table class="smce-table-noscroll td-table-no-border" :no-data-text="loadingOrNoData" :loading="isLoading" :columns="columns" :data="tableData"></Table>
        <!-- 新建/修改 渠道关联 -->
        <Drawer v-model="isShowAddAssociated" width="750" :mask-closable="false">
            <add-associated :drawerTitle="drawerTitle" :drawerType="drawerType" :editChannel="editChannel" v-if="isShowAddAssociated" @cancelAddAssociated="cancel" @submitAddAssociated="ok"></add-associated>
        </Drawer>
    </Card>
</template>

<script>
    import AddAssociated from './AddAssocited';

    export default {
        props: {},
        data() {
            return {
                drawerTitle: '',
                drawerType: '',
                editChannel: null,
                isLoading: true,
                columns: [{
                              title: '渠道一',
                              key: 'source_channel',
                              ellipsis: true, // 超出省略
                              tooltip: true
                          },
                          {
                              title: '渠道一特性',
                              key: 'source_channel_trait',
                              ellipsis: true, // 超出省略
                              tooltip: true
                          },
                          {
                              title: '渠道二',
                              key: 'target_channel',
                              ellipsis: true, // 超出省略
                              tooltip: true
                          },
                          {
                              title: '渠道二特性',
                              key: 'target_channel_trait',
                              ellipsis: true, // 超出省略
                              tooltip: true
                          },
                          {
                              title: '最近关联日期',
                              key: 'update_time',
                              ellipsis: true, // 超出省略
                              tooltip: true,
                              render: (h, params) => h('span', params.row.update_time ? this.$date(+`${params.row.update_time}`).format('YYYY-MM-DD HH:mm:ss') : ' ')
                          },
                          {
                              title: '操作',
                              width: 150,
                              render: (h, params) => h('div', [
                                  h('a', {
                                      style: {
                                          // padding: '0 10px'
                                      },
                                      on: {
                                          click: () => {
                                              this.editButton(params.index, params.row);
                                          }
                                      }
                                  }, '修改'),
                                  h('a', {
                                      style: {
                                          padding: '0 8px'
                                      },
                                      on: {
                                          click: () => {
                                              this.delButton(params.index, params.row);
                                          }
                                      }
                                  }, '删除')
                              ])
                          }
                ],
                tableData: [],
                isShowAddAssociated: false,
                loadingOrNoData: '数据加载中...'
            };
        },
        computed: {},
        components: {
            AddAssociated
        },
        //    created:{},
        mounted() {
            this.$tools.bus.$on('updateChannelList', (status) => {
                if (status) {
                    this.getData();
                }
            });
            this.init();
        },
        methods: {
            init() {
                this.getData();
            },
            // 请求渠道关联列表
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                this.$axios.get(`${this.$config.apiDomain}/id-mappings?size=-1`)
                    .then(({ data }) => {
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        data.items.forEach((item) => {
                            item.source_channel = item.mappings[0].channel_name;
                            item.source_channel_trait = item.mappings[0].trait_name;
                            item.target_channel = item.mappings[1].channel_name;
                            item.target_channel_trait = item.mappings[1].trait_name;
                        });
                        this.tableData = data.items;
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this.tableData = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            // 修改弹框
            editButton(index, row) {
                this.drawerType = 'edit';
                this.editChannel = row;
                this.isShowAddAssociated = true;
            },
            // 删除弹框
            delButton(index, row) {
                this.$Modal.confirm({
                    title: '确认删除此渠道关联？',
                    content: `名称：${row.mappings[0].channel_name}-${row.mappings[1].channel_name}<br></br>删除后将无法恢复。`,
                    onOk: () => {
                        this.$axios.delete(`${this.$config.apiDomain}/id-mappings/${row.mapping_code}`)
                            .then((() => {
                                this.$Message.destroy();
                                this.$Message.success('已删除');
                                this.getData();
                            }));
                    },
                    onCancel: () => {}
                });
            },
            addChannel() {
                this.drawerType = 'add';
                this.isShowAddAssociated = true;
            },
            // 取消创建
            cancel(value) {
                this.isShowAddAssociated = value;
            },
            ok() {
                this.isShowAddAssociated = false;
                this.getData();
            }
        },
        watch: {},
        destroyed() {
        },
        beforeDestroy() {
            this.$tools.bus.$off('updateChannelList');
        }
    };
</script>

<style scoped lang="less">
    .channel-associated {
        .ivu-icon {
            margin-left: 5px;
            line-height: 'normal';
        }
        .icon-shape {
            position: relative;
            top: 2px;
            cursor: pointer;
            float: right;
            &:hover {
                color: #3399FF;
            }
        }
    }
</style>
