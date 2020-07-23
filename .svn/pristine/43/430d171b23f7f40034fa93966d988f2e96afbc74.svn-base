<template>
<div :class="{'m24':isOrg,'page-warpper':!isOrg}">
    <div class="page-title bottom-shadow page-title-tab" v-if="!isOrg">
        <Menu class="pl24" mode="horizontal" theme="light" active-name="insight">
            <MenuItem name="insight">成员管理</MenuItem>
        </Menu>
    </div>
    <div class="page-content page-content-tab" :class="{'container-padding24':!isOrg}">
        <Card dis-hover :padding="0">
            <Row class="padding16-18">
                <Col class="search-wrapper">
                <Input v-if="isMember" class="width300"
                    @keyup.native.enter="debounceSearchList"
                    @on-change="debounceSearchList"
                    v-model="searInput"
                    icon="ios-search"
                    placeholder="请输入姓名/邮箱">
                </Input>
                <Dropdown v-else
                    trigger="custom"
                    placement="bottom-start"
                    @click="handleOpen"
                    transfer
                    :visible="visible"
                    @on-clickoutside="handleClose"
                    transfer-class-name="add-member-box">
                    <Button icon="md-add" type="primary" @click="handleOpen">添加成员</Button>
                    <DropdownMenu slot="list" style="padding:10px 0 0;">
                        <div style="padding:0 16px;">
                            <Input class="width300"
                                icon="ios-search"
                                @keyup.native.enter="debounceSearch"
                                @on-change="debounceSearch"
                                v-model="searMember"
                                placeholder="请输入姓名/邮箱">
                            </Input>
                        </div>
                        <div class="ivu-select-dropdown" style="position:static;box-shadow:none;max-height:135px;overflow:auto;">
                            <ul class="ivu-select-not-found" v-show="!selectData.length&&!searLoading&&searMember">
                                <li>无匹配数据</li>
                            </ul>
                            <ul class="ivu-select-dropdown-list">
                                <li v-for="item in selectData"
                                    :key="item.value"
                                     @click="addSpecia(item)"
                                    class="ivu-select-item">
                                    <span>{{item.name}}</span>
                                    <span class="name-email">{{item.label}}</span>
                                </li>
                            </ul>
                            <ul class="ivu-select-loading" v-show="searLoading">加载中</ul>
                        </div>
                    </DropdownMenu>
                </Dropdown>
                <span class="total-count">共<i>{{total}}</i>个成员</span>
                </Col>
            </Row>
            <Row>
                <Table class="smce-table-noscroll td-table-no-border" :loading="isLoading" :no-data-text="loadingOrNoData" :columns="gridList.columns" :data="gridList.data"></Table>
                <Row class="pageRow padding16-18" type="flex" justify="end">
                    <Page :total="total" :current="currentPage" show-elevator @on-change="debouncePage"></Page>
                </Row>
            </Row>
        </Card>
    </div>
</div>
</template>

<script>
    import MemberTransfer from './MemberTransfer.vue';

    export default {
        data() {
            return {
                isMember: this.$route.path == '/member',
                searInput: '',
                currentPage: 1,
                pageSize: 10,
                total: 0,
                visible: false,
                searMember: '',
                selectTransferData: [],
                loadingOrNoData: '数据加载中...',
                isLoading: false,
                roleTypes: [{
                                value: 1,
                                label: '节点管理员'
                            },
                            {
                                value: 0,
                                label: '节点运营人员'
                            }
                ],
                roleList: {
                    ROLE_C_ADMIN: '渠道管理员',
                    ROLE_D_ADMIN: '节点管理员',
                    ROLE_D_OPERATOR: '节点运营人员'
                },
                selectData: [],
                searLoading: false,
                gridList: {
                    columns: [{
                                  title: '姓名',
                                  key: 'name'
                              },
                              {
                                  title: '邮箱',
                                  key: 'email'
                              },
                              {
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
                                      }, '成员角色'),
                                      h('Tooltip', {
                                          style: {
                                              display: this.isMember ? 'none' : ''
                                          },
                                          props: {
                                              'max-width': '300',
                                              content: '被设为节点管理员的账号将具有管理本节点运营组，负责本节点资源初审的权限',
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
                                  key: 'is_admin',
                                  render: (h, params) => (
                                    <div>
                                        <icon size="20" color={params.row.is_admin ? '#06B75E' : '#AFB2BA'} type="md-contact" />
                                        {
                                            this.isMember
                                            ? <span style="padding-left:5px;">{this.roleList[params.row.role_id] || '-'}</span>
                                            : <i-select
                                                transfer
                                                on-on-change = { (val) => {
                                                    this.changeIsLeader(params, val);
                                                } }
                                                size='small'
                                                value={params.row.is_admin}
                                                class= 'role-select'
                                                style="width:105px;">
                                                {
                                                    this.roleTypes.map(item => (
                                                        <i-option value = { item.value }>{item.label}</i-option>
                                                    ))
                                                }
                                            </i-select>
                                        }
                                    </div>
                                  )
                              },
                              {
                                  title: '操作',
                                  key: 'action',
                                  width: 150,
                                  render: (h, params) => (
                                      <div>
                                        {
                                            !this.isMember
                                            ? <a style="margin: 0 10px 0 0" on-click={() => this.confirmDelete(params.row)}>删除</a>
                                            : <MemberTransfer
                                                type='self'
                                                orginInfo={params.row}
                                                selectData={this.selectTransferData}>
                                            </MemberTransfer>
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
            isOrg: Boolean
        },
        created() {
            const timer = this.$config.throttle_wait;
            this.debounceSearch = this.$lodash.debounce(this.remoteMethod, timer);
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer);
            this.debounceSearchList = this.$lodash.debounce(this.searIconClick, this.$config.debounce_wait);
            this.getTransferData();
        },
        methods: {
            handleOpen() {
                this.visible = !this.visible;
            },
            handleClose(e) {
                if (this.isClickSelf(e.target)) {
                    return;
                }
                this.visible = false;
                this.resetAddInput();
            },
            // 获取转移人员
            getTransferData() {
                const apiUrl = '/sys/resource/users?size=-1';
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`)
                    .then(({
                        data
                    }) => {
                        this.selectTransferData = data.items.map(item => ({
                            name: item.name,
                            label: item.email,
                            value: item.user_id
                        }));

                        this.isMember && this.getData();
                    })
                    .catch(() => {
                        this.selectTransferData = [];
                    });
            },
            // 搜索框icon点击
            searIconClick() {
                this.currentPage = 1;
                this.getData();
            },
            changeIsLeader(itemData, val) {
                // 更新一下状态，否则直接更改导致值没变没有触发change事件
                itemData.row.is_admin = val;
                const apiUrl = `/sys/orgs/auth/${itemData.row.user_id}?is_admin=${!!val}`;
                this.$axios
                    .put(`${this.$config.apiDomain}${apiUrl}`)
                    .then(() => {
                        this.$Message.success('已修改');
                    })
                    .catch(() => {
                        itemData.row.is_admin = val == 1 ? 0 : 1;
                    });
            },
            addSpecia(item) {
                if (!item) {
                    return;
                }
                const id = item.value;
                let apiUrl = `/sys/operators/channel-operators/${id}`;
                // 某个运营部门下
                if (this.orgInfo.org_id) {
                    apiUrl = `/sys/orgs/${this.orgInfo.org_id}/auth`;
                }
                this.$axios
                    .post(`${this.$config.apiDomain}${apiUrl}`, {
                        user_id: id,
                        role_id: 'ROLE_D_OPERATOR' // 小花解释：此处添加运营组即“ROLE_D_OPERATOR”，若以后有其他类型，可在此补充。
                    })
                    .then(() => {
                        this.$Message.success('已添加');
                        this.currentPage = 1;
                        this.getData();
                        this.resetAddInput();
                        this.visible = false;
                    })
                    .catch(() => {
                        this.resetAddInput();
                        this.visible = false;
                    });
            },
            // 重置搜索添加
            resetAddInput() {
                this.searInput = '';
                this.searMember = '';
                this.selectData = [];
            },
            // 确认取消授权
            confirmDelete(data) {
                this.$Modal.confirm({
                    title: '确认取消授权此帐号？',
                    content: `姓名：${data.name}<br/><br/>取消授权后，此账号将无法登陆当前渠道。`,
                    onOk: () => {
                        this.deleteAccount(data.user_id);
                    }
                });
            },
            // 取消授权
            deleteAccount(id) {
                const apiUrl = `/sys/orgs/auth/${id}`;
                this.$axios
                    .delete(`${this.$config.apiDomain}${apiUrl}`, {})
                    .then(() => {
                        this.$Message.success('取消授权成功');
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
                let apiUrl = `/sys/orgs/${this.orgInfo.org_id}/org-members`;
                if (this.isMember) {
                    apiUrl = '/sys/resource/users';
                }
                const params = {
                    q: this.searInput || undefined,
                    page: this.currentPage,
                    rows: this.pageSize
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
                        this.gridList.data = data.items.map(item => ({
                            name: item.name,
                            email: item.email,
                            id: item.user_id,
                            user_id: item.user_id,
                            role_id: item.role_id,
                            is_admin: +(item.role_id === 'ROLE_D_ADMIN' || item.role_id === 'ROLE_C_ADMIN' || item.role_id === 'ROLE_D_ADMIN')
                        }));
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
            remoteMethod() {
                if (this.searMember !== '') {
                    this.searLoading = true;
                    const apiUrl = '/sys/orgs/users';
                    const params = {
                        q: this.searMember,
                        size: -1
                    };
                    this.$axios
                        .get(`${this.$config.apiDomain}${apiUrl}`, {
                            params
                        })
                        .then(({
                            data
                        }) => {
                            this.searLoading = false;
                            const selectData = data.items.map(item => ({
                                name: item.name,
                                label: item.email,
                                value: item.user_id
                            }));
                            this.selectData = selectData;
                        });
                } else {
                    this.selectData = [];
                }
            },
            // 切换页码
            pageChange(page) {
                this.currentPage = page;
                this.getData();
            },
            isClickSelf(dom) {
                let node = dom;
                let isSelf = false;
                let maxLoopCnt = 1000;
                if (node == null) {
                    return;
                }

                do {
                    if (/add\-member\-box/.test(node.className)) {
                        isSelf = true;
                        break;
                    }
                    maxLoopCnt--;
                    node = node.parentNode;
                }
                while (node && node.nodeName && node.nodeName.toUpperCase() != 'HTML' && maxLoopCnt > 0);
                return isSelf;
            }
        },
        watch: {
            orgInfo() {
                this.resetAddInput();
                this.currentPage = 1;
                this.getData();
            }
        }
    };
</script>

<style lang="less">
.role-select{
    &.ivu-select .ivu-select-selection {
        box-shadow: none;
        background: none;
        border: none;
        .ivu-select-placeholder,
        .ivu-select-selected-value{
            padding: 1px 0 0 5px;
        }
    }
}

</style>
