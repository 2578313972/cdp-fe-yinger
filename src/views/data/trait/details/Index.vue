<template>
    <div class="w100 h100 detail-main">
        <div class="detail-nav bottom-shadow">
            <Row type="flex" justify="space-between" align="middle" style="padding:16px 24px;">
                <Col>
                    <span @click="return_list">
                        <Icon type="md-arrow-back" size="24" color="rgba(23,35,61,0.55)" style="margin-top:-5px;margin-right:5px;"/>
                    </span>
                    <span style="font-size:20px;">
                        {{traitDetails.name}}
                    </span>
                </Col>
                <Col>
                    <!-- 跨渠道授权特性不显示激活冻结删除按钮 -->
                    <opration-list
                        type="trait"
                        pageType="detail"
                        v-if="cross_channel"
                        :row="traitDetails"
                        :tabView="trait_view_type"
                        @updateTraitDetail="updateTrait($event)">
                    </opration-list>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Menu class="pl24" mode="horizontal" theme="light" :active-name="tab_content" @on-select="tabChange">
                        <MenuItem name="detail">特性详情</MenuItem>
                        <MenuItem name="strategy">更新策略</MenuItem>
                    </Menu>
                </Col>
            </Row>
        </div>
        <div class="detail-content">
            <Form v-if="tab_content=='detail'" label-position="left" ref="formArea" :model="form_item">
                <Card dis-hover style="margin:24px">
                    <p slot="title">基本信息</p>
                    <collapse-transition>
                        <div>
                            <div class="base-info-box">
                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">名称：</div>
                                    <div class="base-info-box-value">
                                        <edit-input
                                            v-role-button="`name_trait_button_${trait_view_type}`"
                                            style="width:400px;height:32px"
                                            label=""
                                            label-name="name"
                                            default-placeholder="请输入名称，20字以内"
                                            :max-length="20"
                                            :value="form_item.name"
                                            :edit-show="edit_name"
                                            :show-icon-special="((traitDetails.cross_channel_auth_info)||(trait_view_type==='subordinate'))?false:true"
                                            @change="changeInfo($event,'name')"
                                            @confirm-info="confirmInfo"
                                            @cancel-edit="cancelEdit('name')"
                                            @change-status="(status) => changeStatus(status, 'edit_name')">
                                        </edit-input>
                                    </div>
                                    <div class="base-info-box-label">特性ID：</div>
                                    <div class="base-info-box-value2">{{traitDetails.code}}</div>
                                    <div class="base-info-box-label2">类型：</div>
                                    <div class="base-info-box-value2">{{status_config[traitDetails.data_type]}}</div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">所属目录：</div>
                                    <div class="base-info-box-value">
                                        <auth-cascader
                                            v-if="trait_view_type_flag"
                                            v-role-button="`catalog_trait_cascader_${trait_view_type}`"
                                            :clearable="false"
                                            :data="traitCatalog"
                                            :init-value="curCatalogValue"
                                            :is-readonly="isShow_cross_channel"
                                            @change="changeCatalog">
                                        </auth-cascader>
                                    </div>
                                    <div class="base-info-box-label">生命周期：</div>
                                    <div class="base-info-box-value2">{{status_config[traitDetails.lifecycle_status]}}</div>
                                    <div class="base-info-box-label2">配置：</div>
                                    <div class="base-info-box-value2">
                                        <StrategyExpression :configData="traitDetails" style="height: 32px;"></StrategyExpression>
                                    </div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">创建人：</div>
                                    <div class="base-info-box-value">
                                        {{traitDetails.creator}}
                                    </div>
                                    <div class="base-info-box-label">审核状态：</div>
                                    <div class="base-info-box-value2">{{status_config[traitDetails.audit_status]}}</div>
                                    <div class="base-info-box-label2">最后{{status_config[traitDetails.lifecycle_status]}}时间：</div>
                                    <div class="base-info-box-value2">
                                        <span v-if="traitDetails.last_set_lifecycle_time">{{this.$date(+`${traitDetails.last_set_lifecycle_time}`).format("YYYY-MM-DD HH:mm:ss")}}</span>
                                    </div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">所属人：</div>
                                    <div class="base-info-box-value">
                                        <span v-if="trait_visibility==='group'">{{traitDetails.group_info.name||'_'}}</span>
                                        <span v-if="trait_visibility==='self'">{{traitDetails.user_info.name||'_'}}</span>
                                        <span v-if="trait_visibility==='public'">{{$config.login_info.cur_channel_name||'_'}}</span>
                                    </div>
                                    <div class="base-info-box-label">覆盖用户：</div>
                                    <div class="base-info-box-value2">{{(traitDetails.user_count||0)|formatAmount}} 人</div>
                                    <div class="base-info-box-label2"></div>
                                    <div class="base-info-box-value2"></div>
                                </div>

                                <div class="base-info-box-item">
                                    <div class="base-info-box-label">描述：</div>
                                    <div class="base-info-box-value3">
                                        <edit-input
                                            v-role-button="`name_trait_button_${trait_view_type}`"
                                            :max-length="100"
                                            width="500px"
                                            textarea="textarea"
                                            default-placeholder="请输入描述，100字以内"
                                            label=""
                                            label-name="description"
                                            style="margin-bottom: 0;"
                                            :show-icon-special="isShow_cross_channel?false:true"
                                            :value="form_item.description"
                                            :edit-show="edit_description"
                                            @change="changeInfo($event,'description')"
                                            @confirm-info="confirmInfo"
                                            @cancel-edit="cancelEdit('description')"
                                            @change-status="(status) => changeStatus(status, 'edit_description')">
                                        </edit-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </collapse-transition>
                </Card>
            </Form>
            <div v-if="tab_content=='detail'" style="margin:24px">
                <div v-if="traitCode">
                    <Relation
                        @on-change-trait="updateTrait"
                        :trait="traitDetails"
                        :traitId="traitCode"
                        :traitCode="traitCode"
                        :tabView="trait_view_type"
                        :group="curGroup"
                        :groupId="group_id"
                        :traitAscription="traitAscription">
                    </Relation>
                </div>
            </div>
            <Card v-if="tab_content!='detail'" dis-hover style="margin:24px;" :padding="0" class="card-border">
                <Strategy
                    @on-change-trait="updateTrait"
                    :trait="traitDetails"
                    :traitId="traitCode"
                    :traitCode="traitCode"
                    :tabView="trait_view_type"
                    :group="curGroup"
                    :groupId="group_id"
                    :traitAscription="traitAscription">
                </Strategy>
            </Card>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Strategy from '../strategy';
    import Relation from './Relation';
    import EditInput from '@/components/EditInput.vue';
    import StrategyExpression from '@/components/StrategyExpression.vue';
    import OprationList from '@/components/OprationList';
    import AuthCascader from '@/components/AuthCascader';

    export default {
        data() {
            return {
                // 更新数据后，手动更新子组件
                // 私有的（特性1） -> 引用关系-引用的特性（公共）-> 引用关系-被引用的特性（特性1）
                trait_view_type_flag: true,
                destroy: false,
                catalogTree: null,
                tab_content: 'detail',
                traitDetails: {},
                traitCode: '',
                trait_view_type: '',
                status_config: {},
                form_item: {
                    name: '',
                    description: ''
                },
                trait_visibility: '',
                return_url: {},
                edit_name: true,
                edit_description: true
            };
        },
        components: {
            Relation, // 关联的引用
            Strategy, // 规则构建
            EditInput, // 编辑input
            StrategyExpression, // 配置字段的显示
            OprationList,
            AuthCascader
        },
        mounted() {
            this.$tools.bus.$on('updataTraitDetail', () => {
                this.initData();
            });
            this.initData();
        },
        beforeRouteLeave(to, from, next) {
            if (to.path == '/trait' && from.path === '/trait/detail') {
                this.destroy = true;
            }
            next();
        },
        deactivated() {
            if (this.destroy) {
                this.$tools.bus.$emit('updateTraitList');
                this.$destroy();
            }
        },
        beforeDestroy() {
            this.$tools.bus.$off('updataTraitDetail');
        },
        computed: {
            group_id() {
                return this.traitDetails.group_id;
            },
            curGroup() {
                return this.group_id ? {
                    id: this.group_id,
                    name: this.traitAscription
                }
                    : null;
            },
            // 所属目录
            traitAscription() {
                const visibility = this.traitDetails.visibility;
                if (visibility === 'group' && this.traitDetails.group_info) {
                    return this.traitDetails.group_info.name;
                } if (visibility === 'self') {
                    if (this.traitDetails.user_info.user_id === this.$config.login_info.user_info.user_id) {
                        return this.status_config[visibility];
                    }
                    return this.traitDetails.user_info.name;
                } if (visibility === 'public') {
                    if (this.traitDetails.cross_channel_auth_info) {
                        return this.traitDetails.cross_channel_auth_info.channel_name;
                    }
                    return this.status_config[visibility];
                }
                return this.status_config[visibility];
            },
            traitCatalog() {
                const cataLogTreeNodeGen = (catalog) => {
                    const node = {
                        label: catalog.name,
                        value: catalog.id,
                        children:
                            !!catalog.children && catalog.children.length > 0
                                ? _.map(catalog.children, cataLogTreeNodeGen) : []
                    };
                    return node;
                };
                const result = !!this.catalogTree && this.catalogTree.children
                    ? _.map(this.catalogTree.children, cataLogTreeNodeGen) : [];
                return [
                    {
                        value: '0',
                        label: this.traitAscription,
                        children: result
                    }
                ];
            },
            curCatalogValue() {
                const findTreeNode = (trees, id) => {
                    for (let i = 0; i < trees.length; i++) {
                        let catalog = trees[i];
                        if (catalog.id == id) {
                            return catalog;
                        } if (catalog.children && !!catalog.children.length) {
                            catalog = findTreeNode(catalog.children, id);
                            if (catalog) {
                                return catalog;
                            }
                        }
                    }
                    return null;
                };
                if (this.traitDetails && this.catalogTree && this.catalogTree.children) {
                    const select = findTreeNode(
                        this.catalogTree.children,
                        this.traitDetails.catalog_id,
                    );
                    if (select) {
                        return ['0'].concat(select.hierarchy_id.split('-'));
                    }
                    return ['0'];
                }
                return ['0'];
            },
            /** 跨渠道授权中分两类：
             * 1.已授权的特性不可添加扩展按钮
             * 2.取消授权的特性可以添加扩展按钮
             * 非渠道授权的特性可添加扩展按钮
             */
            cross_channel() {
                let result;
                if (this.traitDetails.cross_channel_auth_info) {
                    result = !this.traitDetails.cross_channel_auth_info.authorized;
                } else {
                    result = true;
                }
                return result;
            },
            // 跨渠道授权的特性所属目录和描述不可修改，这个在后端无法用角色判断，所以在前端加的权限控制
            isShow_cross_channel() {
                return !!this.traitDetails.cross_channel_auth_info;
            }
        },
        methods: {
            initData() {
                this.traitCode = this.$route.query.code;
                this.trait_view_type = 'none';
                this.status_config = this.$config.status_config;
                this.tabChange(this.$route.query.name);
                this.getData();
                this.return_url = {
                    path: '/trait',
                    query: {
                        tabView: JSON.parse(sessionStorage.getItem('traitReturn')) || this.$route.query.tabView
                    }
                };
            },
            updateTrait(data) {
                this.traitDetails = data;
                this.form_item.name = data.name;
                this.form_item.description = data.description;
                this.trait_visibility = data.visibility;
            },
            getData() {
                // 请求详情
                this.$api.trait
                    .getTraitDetail(this.traitCode)
                    .then((traitInfo) => {
                        if (!traitInfo) {
                            throw new Error('get trait error');
                        }
                        this.trait_view_type = this.$session.getViewScope(traitInfo);
                        this.updateTrait(traitInfo);
                        //  请求我的目录
                        // console.log(
                        //   "!!traitInfo.group_id ? traitInfo.group_id : null", !!traitInfo.group_id ? traitInfo.group_id : null
                        // );
                        /**
                         * 当trait_view_type‘为’self‘/’public‘ 只传’type‘和’visibility‘
                         * 当当‘trait_view_type’为‘node’/‘subordinate’时,区分‘visibility’是‘self’和‘group’
                         * ’self‘ 添加wonerId
                         */
                        let groupId; let ownerId;
                        if (this.trait_view_type !== 'self' && this.trait_view_type !== 'public') {
                            if (traitInfo.visibility === 'group') {
                                groupId = traitInfo.group_id;
                            } else if (traitInfo.visibility === 'self') {
                                ownerId = traitInfo.user_info.user_id;
                            }
                        }
                        return this.$api.catalog.getCatalogTree({
                            visibility: this.trait_view_type,
                            type: 'trait',
                            group_id: groupId,
                            owner: ownerId,
                            authorized: false,
                            sub_visibility: (this.trait_view_type == 'node' || this.trait_view_type == 'subordinate') ? traitInfo.visibility : undefined
                        });
                    })
                    .then((catalogTree) => {
                        if (JSON.stringify(this.catalogTree) != JSON.stringify(catalogTree)) {
                            this.catalogTree = catalogTree;
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            },
            return_list() { // 返回
                this.$router.push(this.return_url);
            },
            // 修改名称/描述 的验证
            changeInfo(ev, name) {
                this.form_item[name] = ev;
            },
            // 修改名称/描述 的验证
            confirmInfo(value, name) {
                if (name === 'name') {
                    if (value === '') {
                        this.$Message.destroy();
                        this.$Message.error('请输入名称');
                        this.edit_name = false;
                        return;
                    } if (this.traitDetails.name === value) {
                        return;
                    } if (!(this.$config.reg_input.reg.test(value))) {
                        this.$Message.destroy();
                        this.$Message.error('只支持中英文、数字、下划线，请正确填写');
                        return;
                    }
                    this.edit_name = true;
                    this.form_item[name] = value;
                    this.editContent();
                }
                if (name === 'description') {
                    if (this.traitDetails.description === value) return;
                    this.edit_description = true;
                    this.form_item[name] = value;
                    this.editContent();
                }
            },
            // 修改的请求
            editContent(val) {
                const params = {
                    catalog_id: parseInt(val),
                    name: this.form_item.name || this.traitDetails.name,
                    visibility: this.trait_view_type,
                    description: this.form_item.description
                };
                this.$api.trait.modifyTrait(this.traitDetails.code, params).then((traitInfo) => {
                    this.updateTrait(traitInfo);
                    this.$Message.destroy();
                    this.$Message.success('已修改');
                })
                    .catch(() => {
                        const {
                            name,
                            description
                        } = this.traitDetails;
                        this.form_item = {
                            name,
                            description
                        };
                    });
            },
            // 切换tab
            tabChange(name) {
                this.tab_content = name || this.tab_content || 'detail';
            },
            // 所属目录-修改  未完成
            changeCatalog(value) {
                this.editContent(value[value.length - 1] || '0');
            },
            // 切换编辑的input状态
            changeStatus(status, name) {
                this[name] = status;
            },
            cancelEdit(name) {
                this.edit_name = true;
                this.edit_description = true;
                this.form_item[name] = this.traitDetails[name];
            }
        },
        watch: {
            $route(to) {
                if (to.path == '/trait/detail') {
                    // this.initData();
                    sessionStorage.removeItem('crowdReturn');
                }
            },
            traitDetails() {
                this.cancelEdit();
            },
            trait_view_type() {
                this.trait_view_type_flag = false;
                this.$nextTick(() => {
                    this.trait_view_type_flag = true;
                });
            },
            tab_content() {
                this.cancelEdit('name');
                this.cancelEdit('description');
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
            min-width: 90px;
        }
        tr td:nth-of-type(2){
            min-width: 400px;
        }
        tr td:nth-of-type(3){
            min-width: 90px;
        }
        tr td:nth-of-type(4){
            min-width: 140px;
        }
        tr td:nth-of-type(5){
            min-width: 120px;
        }
    }
</style>
