<template>
    <Card dis-hover :padding="0" class="m24">
        <Row class="padding16-18">
            <Col span="16">
            <Input class="width300"
                @keyup.native.enter="debounceSearch"
                @on-change="debounceSearch"
                v-model="searInput"
                icon="ios-search"
                placeholder="请输入运营组名称">
            </Input>
            <span class="total-count">共<i>{{total}}</i>个运营组</span>
            </Col>
            <Col style="text-align:right;" span="8">
            <Button icon="md-add" type="primary" @click="creatGroup({})">新建运营组</Button>
            </Col>
        </Row>
        <Row>
             <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
            <Row class="pageRow padding16-18" type="flex" justify="end">
                <Page :total="total" :current="currentPage" show-elevator @on-change="pageChange"></Page>
            </Row>
        </Row>
        <Drawer v-model="showEidt" width="600" :mask-closable="false">
            <addGroup
                :orgInfo="orgInfo"
                :isOperSpe="isOperSpe"
                v-if="showEidt"
                :titleName="titleName"
                :groupInfo="groupInfo"
                v-on:show-drawer="showDrawer"></addGroup>
        </Drawer>
    </Card>
</template>

<script>
    import addGroup from './AddGroup.vue';
    import MemberTransfer from '@/views/manage/authorization/MemberTransfer.vue';

    export default {
        data() {
            return {
                showEidt: false,
                titleName: '',
                groupInfo: {},
                currentPage: 1,
                pageSize: 10,
                total: 0,
                loadingOrNoData: '数据加载中...',
                isLoading: false,
                searInput: '',
                selectTransferData: [],
                gridList: {
                    columns: [{
                                  title: '运营组名称',
                                  key: 'name',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '组成员',
                                  key: 'groupMembersStr',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '修改人',
                                  key: 'updateName',
                                  ellipsis: true,
                                  tooltip: true
                              },
                              {
                                  title: '修改时间',
                                  key: 'updateTime',
                                  width: 180
                              },
                              {
                                  title: '操作',
                                  key: 'action',
                                  width: 180,
                                  render: (h, params) => (
                                      <div>
                                        {
                                            <div>
                                                <a on-click={() => this.creatGroup(params.row)}>修改</a>
                                                <a style="margin: 0 10px" on-click={() => this.confirmDelete(params.row)}>删除</a>
                                                <MemberTransfer
                                                    type='group'
                                                    orginInfo={params.row}
                                                    selectData={this.selectTransferData}>
                                                </MemberTransfer>
                                            </div>
                                        }
                                      </div>
                                  )
                              }
                    ],
                    data: []
                }
            };
        },
        props: {
            orgInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            // 是否是运营专员
            isOperSpe: {
                type: Boolean,
                default: false
            }
        },
        created() {
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, this.$config.debounce_wait);
            this.getTransferData();
        },
        mounted() {
            // 更新列表
            this.$tools.bus.$on('updateGroupList', () => {
                this.searInput = '';
                this.currentPage = 1;
                this.getData();
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('updateGroupList');
        },
        components: {
            addGroup
        },
        methods: {
            // 是否显示抽屉弹窗
            showDrawer(val) {
                this.showEidt = val;
            },
            // 搜索框icon点击
            searIconClick() {
                this.currentPage = 1;
                this.getData();
            },
            // 新建/修改(存在groupId时)
            creatGroup(itemData) {
                this.titleName = itemData.groupId ? '修改运营组' : '新建运营组';
                this.groupInfo = itemData;
                this.showEidt = true;
            },
            // 获取转移运营组
            getTransferData() {
                const apiUrl = '/sys/groups?size=-1';
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`)
                    .then(({
                        data
                    }) => {
                        this.selectTransferData = data.items.map(item => ({
                            name: item.name,
                            value: item.group_id
                        }));

                        this.getData();
                    })
                    .catch(() => {
                        this.selectTransferData = [];
                    });
            },
            // 确认删除
            confirmDelete(data) {
                this.$Modal.confirm({
                    title: '确认删除此运营组？',
                    content: `名称：${data.name}<br><br>删除后将无法恢复。`,
                    onOk: () => {
                        this.deleteGroup(data.groupId);
                    }
                });
            },
            // 删除
            deleteGroup(id) {
                const apiUrl = `/sys/groups/${id}`;
                this.$axios
                    .delete(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(() => {
                        this.$Message.success('已删除');
                        if (this.currentPage > 1 && this.gridList.data.length == 1) {
                            this.currentPage--;
                        }
                        this.getData();
                    });
            },
            // 获取数据
            getData() {
                this.loadingOrNoData = '数据加载中...';
                this.isLoading = true;
                const apiUrl = '/sys/groups';
                const params = {
                    q: this.searInput,
                    page: this.currentPage,
                    rows: this.pageSize
                };
                // 某个运营部门下
                // if (this.orgInfo.org_id) {
                //     apiUrl = `/sys/groups/${this.orgInfo.org_id}/groups`;
                // }
                // // 运营专员下
                // if (this.isOperSpe) {
                //     apiUrl = `/sys/groups/`;
                // }
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        this.isLoading = false;
                        if (!data.items.length) {
                            this.loadingOrNoData = '暂无数据';
                        }
                        this.gridList.data = this.clearData(data.items);
                        this.total = data.total;
                    })
                    .catch(() => {
                        this.total = 0;
                        this.gridList.data = [];
                        this.loadingOrNoData = '数据加载失败';
                        this.isLoading = false;
                    });
            },
            clearData(data) {
                const newData = [];
                data.forEach((item) => {
                    const groupMembers = [];
                    const groupMembersArr = [];
                    for (const i in item.group_members) {
                        groupMembersArr.push(item.group_members[i].user_id);
                        groupMembers.push(item.group_members[i].name);
                    }
                    newData.push({
                        updateTime: item.create_time ? this.$date(+item.update_time).format('YYYY-MM-DD HH:mm:ss') : '-',
                        id: item.group_id,
                        groupId: item.group_id,
                        groupMembers: item.group_members,
                        groupMembersArr,
                        groupMembersStr: groupMembers.join('，'),
                        leaderId: item.leader_id,
                        updateName: item.updater_name,
                        name: item.name
                    });
                });
                return newData;
            },
            // 切换页码
            pageChange(page) {
                this.currentPage = page;
                this.getData();
            }
        },
        watch: {
            orgInfo() {
                this.searInput = '';
                this.currentPage = 1;
                this.getData();
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
