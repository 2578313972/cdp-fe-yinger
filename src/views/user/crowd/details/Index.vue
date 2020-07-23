<template>
    <!-- 人群管理列表-详情 -->
    <div class="w100 h100 detail-main">
        <div class="detail-nav bottom-shadow">
            <Row type="flex" justify="space-between" align="middle" style="padding:16px 24px;">
                <Col>
                    <span @click="return_list">
                        <Icon type="md-arrow-back" size="24" color="rgba(23,35,61,0.55)" style="margin-top:-5px;margin-right:5px;"/>
                    </span>
                    <span style="font-size:20px;">
                        {{crowdListContent.name}}
                    </span>
                </Col>
                <Col>
                    <opration-list
                        type="crowd"
                        pageType="detail"
                        :row="crowdListContent"
                        :tabView="crowd_view_type"
                        @updateCrowdDetail="updateCrowd($event)">
                    </opration-list>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Menu mode="horizontal" theme="light" :active-name="tab_content" @on-select="tabChange" style="padding:0 24px;">
                        <MenuItem name="detail">人群详情</MenuItem>
                        <MenuItem name="strategy">更新策略</MenuItem>
                        <MenuItem name="export" v-if="crowdListContent.lifecycle_status=='active'" >导出人群</MenuItem>
                        <MenuItem name="analysis" v-if="crowdListContent.lifecycle_status=='active'" >人群分析</MenuItem>
                    </Menu>
                </Col>
            </Row>
        </div>
        <div class="detail-content">
            <Form v-if="tab_content=='detail'" label-position="left" ref="formArea" :model="formItem">
                <Card dis-hover style="margin:24px">
                    <p slot="title">基本信息</p>
                    <collapse-transition>
                        <div>

                            <div class="base-info-box">
                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">名称：</div>
                                    <div class="base-info-box-value">
                                        <edit-input
                                            v-role-button="`name_crowd_button_${crowd_view_type}`"
                                            label=""
                                            label-name="name"
                                            default-placeholder="请输入名称，20字以内"
                                            style="width:400px;height:32px;"
                                            :max-length="20"
                                            :value="formItem.name"
                                            :edit-show="nameEditShow"
                                            :show-icon-special="(crowd_view_type==='subordinate')?false:true"
                                            @change="changeInfo($event,'name')"
                                            @cancel-edit="cancelEdit('name')"
                                            @confirm-info="confirmInfo"
                                            @change-status="(status) => changeStatus(status, 'nameEditShow')">
                                        </edit-input>
                                    </div>
                                    <div class="base-info-box-label">人群ID：</div>
                                    <div class="base-info-box-value2">{{crowdListContent.code}}</div>
                                    <div class="base-info-box-label2">最后更新时间：</div>
                                    <div class="base-info-box-value2">
                                        <span v-if="crowdListContent.last_update_time">
                                            {{this.$date(+`${crowdListContent.last_update_time}`).format("YYYY-MM-DD HH:mm:ss")}}
                                        </span>
                                    </div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">所属目录：</div>
                                    <div class="base-info-box-value">
                                        <auth-cascader
                                            v-role-button="`catalog_crowd_cascader_${crowd_view_type}`"
                                            :clearable="false"
                                            :data="crowdCatalog"
                                            :init-value="curCatalogValue"
                                            @change="changeCatalog">
                                        </auth-cascader>
                                    </div>
                                    <div class="base-info-box-label">生命周期：</div>
                                    <div class="base-info-box-value2">{{status_config[crowdListContent.lifecycle_status]}}</div>
                                    <div class="base-info-box-label2">最后{{status_config[crowdListContent.lifecycle_status]}}时间：</div>
                                    <div class="base-info-box-value2">
                                        <span v-if="crowdListContent.lifecycle_status==='freeze'&&crowdListContent.last_freeze_time">{{this.$date(+`${crowdListContent.last_freeze_time}`).format("YYYY-MM-DD HH:mm:ss")}}</span>
                                        <span v-else v-show="crowdListContent.last_active_time">{{this.$date(+`${crowdListContent.last_active_time}`).format("YYYY-MM-DD HH:mm:ss")}}</span>
                                    </div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">创建人：</div>
                                    <div class="base-info-box-value">
                                        {{crowdListContent.creator}}
                                    </div>
                                    <div class="base-info-box-label">审核状态：</div>
                                    <div class="base-info-box-value2">{{status_config[crowdListContent.audit_status]||"--"}}</div>
                                    <div class="base-info-box-label2">人群数量：</div>
                                    <div class="base-info-box-value2" >
                                        {{((crowdListContent.crowd_status=='static' ? crowdListContent.crowd_scale : crowdListContent.estimated_scale)||0) | formatAmount}} 人
                                    </div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">所属人：</div>
                                    <div class="base-info-box-value">
                                        <span v-if="crowd_visibility==='group'">{{crowdListContent.group_info.name||'_'}}</span>
                                        <span v-if="crowd_visibility==='self'">{{crowdListContent.user_info.name||'_'}}</span>
                                    </div>
                                    <div class="base-info-box-label">计算状态：</div>
                                    <div class="base-info-box-value2">{{$config.status_config[crowdListContent.calc_status]||'-'}}</div>
                                    <div class="base-info-box-label2">人群状态：</div>
                                    <div class="base-info-box-value2">{{$config.status_config[crowdListContent.crowd_status]||'-'}}</div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">描述：</div>
                                    <div class="base-info-box-value3">
                                        <edit-input
                                            v-role-button="`name_crowd_button_${crowd_view_type}`"
                                            label=""
                                            label-name="description"
                                            textarea="textarea"
                                            default-placeholder="请输入描述，100字以内"
                                            :max-length="100"
                                            :edit-show="defineEditShow"
                                            :value="formItem.description"
                                            @change="changeInfo($event,'description')"
                                            @cancel-edit="cancelEdit('description')"
                                            @confirm-info="confirmInfo"
                                            @change-status="(status) => changeStatus(status, 'defineEditShow')">
                                        </edit-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </collapse-transition>
                </Card>
            </Form>
            <!-- 本期先隐藏，下个版本添加 @晓晴5.17-->
            <!-- <Card :class="{'no-paddinng-border':!moreContent}" class="m10" dis-hover>
                <p slot="title"> <span>附属人群 </span><span class="title-des">共添加了<i>{{count||0}}</i>个附属人群</span></p>
                <a href="javascript:;" slot="extra" @click="showContent(moreContent)" style="margin-right: -3px">{{moreContent?"收起":"展开"}}&nbsp;</a>
                <collapse-transition>
                <div v-show="moreContent">
                    <Table class="smce-table-noscroll" ref="selection" :columns="crowd_columns" :data="crowd_list" :loading="loading" @on-selection-change="selectionChange"></Table>
                </div>
                </collapse-transition>
            </Card> -->
            <div v-if="tab_content=='detail'" style="margin:24px">
                <div v-if="crowdCode">
                    <Relation
                        @updateDetail="updateDetail"
                        :crowdCode="crowdCode"
                        :tabView="crowd_view_type"
                        :groupId="group_id"
                        :groupInfo="groupInfo"
                        :crowdAscription="crowdAscription"
                        :crowdListContent="crowdListContent"
                        :lossAffiliatedId="lossAffiliatedId"
                        :increaseAffiliatedId="increaseAffiliatedId">
                    </Relation>
                </div>
            </div>
            <div v-if="tab_content=='strategy'" style="margin:24px;" ::padding="0" class="card-border">
                <Strategy
                    @updateDetail="updateDetail"
                    :crowdCode="crowdCode"
                    :tabView="crowd_view_type"
                    :groupId="group_id"
                    :groupInfo="groupInfo"
                    :crowdAscription="crowdAscription"
                    :crowdListContent="crowdListContent"
                    :lossAffiliatedId="lossAffiliatedId"
                    :increaseAffiliatedId="increaseAffiliatedId">
                </Strategy>
            </div>
            <div v-if="tab_content=='export'" dis-hover style="margin:24px;" ::padding="0" class="card-border">
                <CrowdDownload
                    @updateDetail="updateDetail"
                    :crowdCode="crowdCode"
                    :tabView="crowd_view_type"
                    :groupId="group_id"
                    :groupInfo="groupInfo"
                    :crowdAscription="crowdAscription"
                    :crowdListContent="crowdListContent"
                    :lossAffiliatedId="lossAffiliatedId"
                    :increaseAffiliatedId="increaseAffiliatedId">
                </CrowdDownload>
            </div>
            <div v-if="tab_content=='analysis'" dis-hover style="margin:24px;" ::padding="0" class="card-border">
                <CrowdPortrait
                    @updateDetail="updateDetail"
                    :crowdCode="crowdCode"
                    :tabView="crowd_view_type"
                    :groupId="group_id"
                    :groupInfo="groupInfo"
                    :crowdAscription="crowdAscription"
                    :crowdListContent="crowdListContent"
                    :lossAffiliatedId="lossAffiliatedId"
                    :increaseAffiliatedId="increaseAffiliatedId">
                </CrowdPortrait>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
    </div>
</template>

<script>
    import Relation from './Relation';
    import Strategy from '../strategy';
    import CrowdDownload from './CrowdDownload';
    import CrowdPortrait from './CrowdPortrait';
    import AuthCascader from '@/components/AuthCascader';
    import EditInput from '@/components/EditInput.vue';
    import OprationList from '@/components/OprationList';

    export default {
        data() {
            return {
                groupInfo: {},
                destroy: false,
                spinShow: true,
                crowd_list: [],
                count: 0,
                tabView: '',
                crowd_view_type: '',
                moreContent: false,
                tab_content: 'detail',
                crowdListContent: {},
                crowdCode: '',
                group_id: '',
                crowdCatalog: [],
                crowdCatalogTmpStr: null,
                catalog_value: '',
                auxiliaryCrowds: [],
                auxiliary: [],
                status_config: {},
                crowdAscription: '',
                crowd_visibility: '',
                formItem: {
                    name: '',
                    description: ''
                },
                loading: true,
                return_url: {},
                nameEditShow: true,
                defineEditShow: true,
                all_auxiliary: {},
                lossAffiliatedId: '',
                increaseAffiliatedId: '',
                curCatalogValue: ['0'],
                tabState: null
            };
        },
        computed: {
            // 附属人群表头显示权限
            crowd_columns() {
                const columns = [
                    {
                        title: '名称',
                        key: 'name',
                        ellipsis: true,
                        tooltip: true
                    },
                    {
                        title: '人群数量',
                        key: 'crowd_scale'
                    },
                    {
                        title: '被人群引用',
                        key: 'be_ref_crowds'
                    },
                    {
                        title: '被投放引用',
                        key: 'be_ref_campaigns'
                    },
                    {
                        title: '描述',
                        key: 'description',
                        ellipsis: true,
                        tooltip: true
                    }
                ];
                const edit_columns = {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                };
                if (this.crowd_view_type !== 'subordinate' && (this.crowd_view_type !== 'node')) {
                    columns.unshift(edit_columns);
                }
                return columns;
            }

        },
        components: {
            Relation, // 引用关系
            Strategy, // 投放策略
            CrowdDownload, // 标签页-导出人群
            CrowdPortrait, // 标签页-人群分析
            EditInput, // 可编辑input
            OprationList, // 扩展按钮
            AuthCascader
        },
        mounted() {
            this.$tools.bus.$on('updataCrowdDetail', () => {
                this.initData();
            });
            this.initData();
        },
        beforeRouteLeave(to, from, next) {
            if (to.path === '/crowd' && from.path === '/crowd/detail') {
                this.destroy = true;
            }
            next();
        },
        deactivated() {
            if (this.destroy) {
                this.$tools.bus.$emit('updateCrowdList');
                this.$destroy();
            }
        },
        beforeDestroy() {
            this.$tools.bus.$off('updataCrowdDetail');
        },
        methods: {
            initData() {
                this.group_id = this.$route.query.groupID;
                this.crowd_view_type = 'none';
                this.status_config = this.$config.status_config;
                this.crowdCode = this.$route.query.code;
                this.tabState = false;
                this.getData();
                this.tabChange(this.$route.query.name);
                this.return_url = {
                    path: '/crowd',
                    query: {
                        tabView: JSON.parse(sessionStorage.getItem('crowdReturn')) || this.$route.query.tabView
                    }
                };
            },
            getData() {
                // 请求详情内容数据
                this.$axios.get(`${this.$config.apiDomain}/crowds/${this.crowdCode}/combination`)
                    .then(({
                        data
                    }) => {
                        this.crowd_view_type = this.$session.getViewScope(data);
                        this.updateCrowd(data);
                        // 请求所属目录：我的 self
                        let groupId; let ownerId;
                        if (this.crowd_view_type !== 'self') {
                            if (data.visibility === 'group') {
                                groupId = data.group_id;
                            } else if (data.visibility === 'self') {
                                ownerId = data.user_info.user_id;
                            }
                        }
                        const url = '/catalog-tree';
                        const params = {
                            type: 'crowd',
                            visibility: this.crowd_view_type,
                            group_id: groupId,
                            owner: ownerId,
                            sub_visibility: (this.crowd_view_type == 'node' || this.crowd_view_type == 'subordinate') ? data.visibility : undefined
                        };
                        this.$axios.get(`${this.$config.apiDomain}${url}`, { params })
                            .then(({
                                data
                            }) => {
                                if (this.crowdCatalogTmpStr != JSON.stringify(data.children)) {
                                    this.getCatalog(data.children);
                                    this.crowdCatalogTmpStr = JSON.stringify(data.children);
                                    this.crowdCatalog = [
                                        {
                                            value: '0',
                                            label: this.crowdAscription,
                                            children: data.children
                                        }
                                    ];
                                }
                            })
                            .catch(() => {
                                this.spinShow = false;
                                this.loading = false;
                            });
                    })
                    .catch(() => {
                        this.spinShow = false;
                        this.loading = false;
                    });
            },
            // 更新详情数据
            updateCrowd(data) {
                this.crowdListContent = data;
                this.crowdCode = data.code;
                this.formItem.name = data.name;
                this.formItem.description = data.description;
                this.count = data.auxiliary_crowds.length;
                this.auxiliaryCrowds = data.auxiliary_crowds;
                this.crowd_visibility = data.visibility;

                this.get_auxiliary();
                this.crowd_Ascription();
                if (data.group_info) {
                    this.groupInfo = data.group_info;
                }
                // 用于保存是否是第一次进来，非第一次进去，走下面的判断
                if (this.tabState) this.tabChange();
                this.tabState = true;
                // spinShow为了解决切换冻结激活的闪现 by小晴。
                setTimeout(() => {
                    this.spinShow = false;
                }, 500);
            },
            // 所属目录
            crowd_Ascription() {
                const visibility = this.crowdListContent.visibility;
                if (visibility === 'group' && this.crowdListContent.group_info) {
                    this.crowdAscription = this.crowdListContent.group_info.name;
                }
                else if (visibility === 'self') {
                    if (this.crowdListContent.user_info.user_id === this.$config.login_info.user_info.user_id) {
                        this.crowdAscription = this.status_config[visibility];
                    } else {
                        this.crowdAscription = this.crowdListContent.user_info.name;
                    }
                }
                else {
                    this.crowdAscription = this.status_config[visibility];
                }
            },
            // 请求附属人群原列表
            get_auxiliary() {
                const url1 = '/crowds/auxiliary/define';
                this.$axios.get(`${this.$config.apiDomain}${url1}`)
                    .then(({
                        data
                    }) => {
                        this.loading = false;
                        this.all_auxiliary = data;
                        this.handle_auxiliary(data);
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            // 代码待优化 匹配附属人群显示列表
            handle_auxiliary(data) {
                const arr = data || this.all_auxiliary;
                const arr2 = this.crowdListContent.auxiliary_crowds || '';
                this.lossAffiliatedId = this.increaseAffiliatedId = '';
                if (arr2.length) {
                    for (const i in arr2) {
                        // 获取附属人群的ID 给引用人群的附属人群tab使用
                        if (arr2[i].auxiliary_type === 'loss') {
                            this.lossAffiliatedId = arr2[i].code;
                        } else if (arr2[i].auxiliary_type === 'increase') {
                            this.increaseAffiliatedId = arr2[i].code;
                        }
                        // 匹配详情中的附属人群
                        for (const y in arr) {
                            if (arr2[i].auxiliary_type === arr[y].auxiliary_type) {
                                Object.assign(arr[y], {
                                    _checked: true,
                                    be_ref_campaigns: arr2[i].be_ref_campaigns,
                                    be_ref_crowds: arr2[i].be_ref_crowds,
                                    crowd_scale: arr2[i].crowd_scale
                                });
                            }
                        }
                    }
                }
                this.crowd_list = arr;
            },
            // 循环添加label&value 用户循环联动菜单 所属目录的层级对应
            getCatalog(arr) {
                const catalog_id = this.crowdListContent.catalog_id;
                for (let i = 0; i < arr.length; i++) {
                    // 先添加所有label和value,用于展示所有目录
                    Object.assign(arr[i], {
                        label: arr[i].name,
                        value: arr[i].id
                    });
                    if (arr[i].id == catalog_id) {
                        const result = (arr[i].hierarchy_id).split('-');
                        this.curCatalogValue = ['0'].concat(result);
                    }
                    this.getCatalog(arr[i].children || []);
                }
            },

            // 投放人群
            launchCrowd() {
                this.$Message.destroy();
                this.$Message.success('投放成功');
            },
            // 展开附属人群
            showContent(moreContent) {
                this.moreContent = !moreContent;
            },
            // 返回
            return_list() {
                this.$router.push(this.return_url);
            },
            // 切换tab
            tabChange(name) {
                this.tab_content = name || this.tab_content || 'detail';
            },
            // 修改名称/描述 的验证
            changeInfo(ev, name) {
                this.formItem[name] = ev;
            },
            // 提交修改 验证名称/描述 内容
            confirmInfo(value, name) {
                if (name === 'name') {
                    if (value === '') {
                        this.$Message.destroy();
                        this.$Message.error('请输入名称');
                        this.nameEditShow = false;
                        return;
                    } if (this.crowdListContent.name === value) {
                        return;
                    } if (!(this.$config.reg_input.reg.test(value))) {
                        this.$Message.destroy();
                        this.$Message.error('只支持中英文、数字、下划线，请正确填写');
                        return;
                    }
                    this.nameEditShow = true;
                    this.formItem[name] = value;
                    this.editContent(this.crowdListContent.catalog_id);
                }
                if (name === 'description') {
                    if (this.crowdListContent.description === value) return;
                    this.defineEditShow = true;
                    this.formItem[name] = value;
                    this.editContent(this.crowdListContent.catalog_id);
                }
            },
            // 修改请求
            editContent(val, selected) {
                const params = {
                    auxiliary_types: selected,
                    catalog_id: val,
                    name: this.formItem.name || this.crowdListContent.name,
                    description: this.formItem.description,
                    visibility: this.crowd_view_type,
                    group_id: this.group_id || undefined
                };
                this.$axios.put(`${this.$config.apiDomain}/crowds/${this.crowdCode}/base`, params)
                    .then(({
                        data
                    }) => {
                        this.updateCrowd(data);
                        this.$Message.destroy();
                        this.$Message.success('已修改');
                    })
                    .catch(() => {
                        this.get_auxiliary();
                        const {
                            name,
                            description
                        } = this.crowdListContent;
                        this.formItem = {
                            name,
                            description
                        };
                    });
            },
            // 所属目录-修改
            changeCatalog(value) {
                this.curCatalogValue = value;
                this.editContent(value[value.length - 1] || '0');
            },
            // 修改附属人群
            selectionChange(selection) {
                const selected = [];
                selection.forEach((item) => {
                    selected.push(item.auxiliary_type);
                });
                this.editContent(this.crowdListContent.catalog_id, selected);
            },
            // 提交策略更新详情信息
            updateDetail(data) {
                this.updateCrowd(data);
            },
            // 切换编辑的input状态
            changeStatus(status, name) {
                this[name] = status;
            },
            // 取消修改
            cancelEdit(name) {
                this.nameEditShow = true;
                this.defineEditShow = true;
                this.formItem[name] = this.crowdListContent[name];
            }
        },
        watch: {
            $route(to) {
                if (to.path == '/crowd/detail') {
                    // this.initData();
                    sessionStorage.removeItem('traitReturn');
                }
            },
            crowdListContent() {
                this.cancelEdit();
                this.$tools.bus.$emit('update-crowd-dependant');
            }
        }
    };
</script>

<style scoped lang="less">
    .detail-main{
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .detail-nav {
        background: #fff;
        position: relative;
        z-index: 901;
    }
    .detail-content{
        flex:1;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .table-content {
        width: 100%;
        tr {
            height: 44px;
        }
        tr td{
            text-align: left;
            padding-left: 10px;
            padding-right: 10px;
        }
        tr td:nth-of-type(1){
            width:100px;
        }
        tr td:nth-of-type(2){
            min-width: 400px;
        }
        tr td:nth-of-type(3){
            width: 100px;
        }
        tr td:nth-of-type(4){
            min-width: 150px;
        }
        tr td:nth-of-type(5){
            width: 120px;
        }
        tr td:nth-of-type(6){
            min-width: 150px;
            white-space: nowrap;
        }
    }
    .title-des {
        font-size: 12px;
        font-weight: 500;
        color: #808695;
        padding-left: 10px;
        i {
            color: #008cf8;
            padding: 0 5px;
            font-style: normal;
            font-size: 14px;
            vertical-align: bottom;
        }
    }
</style>
