
<template>
    <div>
        <!-- 人群列表 -->
        <div v-if="type==='crowd'&&pageType=='list'">
            <span class="operation" @click="dropMenu(`detail,${row.code}`)">详情</span>
            <Dropdown transfer trigger="click" v-role-button="`more_crowd_button_${tabView}`" @on-click="dropMenu">
                <a href="javascript:void(0)"><Icon type="md-more"></Icon></a>
                <DropdownMenu slot="list">
                    <!-- <DropdownItem
                        v-if="tabView!=='subordinate'"
                        :name="`analysis,${row.code}`">
                        人群分析
                    </DropdownItem> -->
                    <DropdownItem
                        v-if="tabView!=='subordinate'&&row.lifecycle_status!=='freeze'"
                        :name="`export,${row.code}`">
                        导出
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`calc_crowd_button_${tabView}`"
                        v-if="row.trigger&&(row.trigger.update_type==='once')"
                        :disabled="!row.support_recalc"
                        :name="`calc,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status},${row.support_recalc||false}`">
                        重新计算
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`active_crowd_button_${tabView}`"
                        v-if="row.lifecycle_status==='freeze'"
                        :disabled="row.audit_status==='pending' || row.calc_status==='res_calculating' || row.calc_status==='cleaning'"
                        :name="`active,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status}`">
                        激活
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`freeze_crowd_button_${tabView}`"
                        v-if="row.lifecycle_status==='active'"
                        :disabled="row.audit_status==='pending' || row.calc_status==='res_calculating' || row.calc_status==='cleaning'"
                        :name="`freeze,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status}`">
                        冻结
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`delete_crowd_button_${tabView}`"
                        :disabled="row.audit_status==='pending' || row.lifecycle_status==='active' || row.calc_status==='cleaning'"
                        :name="`delete,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status}`">
                        删除
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <!-- 特性列表 -->
        <div v-if="type==='trait'&&pageType=='list'">
            <span class="operation" @click="dropMenu(`detail,${row.code}`)">详情</span>
            <!-- 非授权特性正常显示
                授权的特性分两种情况：已经授权的不可显示扩展按钮，已取消授权的显示扩展按钮 -->
            <Dropdown transfer trigger="click"
                v-if="row.cross_channel_auth_info?(!row.cross_channel_auth_info.authorized):true"
                v-role-button="`more_trait_button_${tabView}`"
                @on-click="dropMenu">
                <a href="javascript:void(0)"><Icon type="md-more"></Icon></a>
                <DropdownMenu slot="list">
                    <DropdownItem
                        v-role-button="`active_trait_button_${tabView}`"
                        v-if="row.lifecycle_status==='freeze'"
                        :disabled="row.audit_status==='pending'"
                        :name="`active,${row.code},${row.audit_status}`">
                        激活
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`freeze_trait_button_${tabView}`"
                        v-if="row.lifecycle_status==='active'"
                        :disabled="row.audit_status==='pending'"
                        :name="`freeze,${row.code},${row.audit_status}`">
                        冻结
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`publish_trait_button_${tabView}`"
                        :disabled="row.audit_status==='pending'||row.lifecycle_status==='freeze'"
                        :name="`publish,${row.code},${row.audit_status},${row.lifecycle_status}`">
                        发布
                    </DropdownItem>
                    <DropdownItem
                        v-role-button="`delete_trait_button_${tabView}`"
                        :disabled="row.audit_status==='pending'||row.lifecycle_status==='active'"
                        :name="`delete,${row.code},${row.audit_status},${row.lifecycle_status}`">
                        删除
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Publish :isShow="showPublish" @publish="publishOK" @cancel="publishCancel"></Publish>
        </div>
        <!-- 人群详情 -->
        <div v-if="type==='crowd'&&pageType=='detail'">
            <Button
                v-role-button="`calc_crowd_button_${tabView}`"
                v-if="row.trigger&&(row.trigger.update_type==='once')"
                :disabled="!row.support_recalc"
                @click="dropMenu(`calc,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status},${row.support_recalc||false}`)">
                <span class="iconfont icon-notification_sync"></span>
                重新计算
            </Button>
            <Button
                v-role-button="`active_crowd_button_${tabView}`"
                v-if="row.lifecycle_status==='freeze'"
                :disabled="row.audit_status==='pending' || row.calc_status==='res_calculating' || row.calc_status==='cleaning'"
                @click="dropMenu(`active,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status}`)">
                <span class="iconfont icon-action_verified_user_o"></span>
                激活
            </Button>
            <Button
                v-role-button="`freeze_crowd_button_${tabView}`"
                v-if="row.lifecycle_status==='active'"
                :disabled="row.audit_status==='pending' || row.calc_status==='res_calculating' || row.calc_status==='cleaning'"
                @click="dropMenu(`freeze,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status}`)">
                <span class="iconfont icon-notification_do_disturb"></span>
                冻结
            </Button>
            <Button
                v-role-button="`delete_crowd_button_${tabView}`"
                :disabled="row.audit_status==='pending' || row.lifecycle_status==='active' || row.calc_status==='cleaning'"
                @click="dropMenu(`delete,${row.code},${row.audit_status},${row.lifecycle_status},${row.calc_status}`)">
                <span class="iconfont icon-action_delete_outline"></span>
                删除
            </Button>
        </div>
        <!-- 特性详情 -->
        <div v-if="type==='trait'&& pageType=='detail'">
            <Button
                v-role-button="`publish_trait_button_${tabView}`"
                :disabled="row.audit_status==='pending'||row.lifecycle_status==='freeze'"
                @click="dropMenu(`publish,${row.code},${row.audit_status},${row.lifecycle_status}`)">
                <span class="iconfont icon-action_open_in_new_outlined"></span>
                发布
            </Button>
            <Button
                v-role-button="`active_trait_button_${tabView}`"
                v-if="row.lifecycle_status==='freeze'"
                :disabled="row.audit_status==='pending'"
                @click="dropMenu(`active,${row.code},${row.audit_status}`)">
                <span class="iconfont icon-action_verified_user_outlined"></span>
                激活
            </Button>
            <Button
                v-role-button="`freeze_trait_button_${tabView}`"
                v-if="row.lifecycle_status==='active'"
                :disabled="row.audit_status==='pending'"
                @click="dropMenu(`freeze,${row.code},${row.audit_status}`)">
                <span class="iconfont icon-notification_do_disturb"></span>
                冻结
            </Button>
            <Button
                v-role-button="`delete_trait_button_${tabView}`"
                :disabled="row.audit_status==='pending'||row.lifecycle_status==='active'"
                @click="dropMenu(`delete,${row.code},${row.audit_status},${row.lifecycle_status}`)">
                <span class="iconfont icon-action_delete_outline"></span>
                删除
            </Button>
            <Publish :isShow="showPublish" @publish="publishOK" @cancel="publishCancel"></Publish>
        </div>
    </div>
</template>

<script>
    import Publish from '@/components/Publish';

    export default {
        props: {
            row: {
                type: Object,
                default() {
                    return {};
                }
            },
            type: {
                // type 'trait'特性  ’crowd‘人群
                type: String,
                default: ''
            },
            pageType: { // “list"，”detail“
                type: String,
                default: ''
            },
            groupID: {
                // 可见组id
                type: [String, Number],
                default: ''
            },
            tabView: {
                // public,self,group，subordinate.
                type: [String],
                default: ''
            },
            authorized: {
                type: Boolean,
                default: false
            }

        },
        computed: {
            group_id() {
                return this.row.group_id || this.groupID;
            }
        },
        data() {
            return {
                isRecalc: true, // 是否重计算，激活人群时候显示，冻结不显示
                showPublish: false, // 是否发布
                traitCode: '' // 特性id
            };
        },
        methods: {

            // 确认发布
            publishOK(publish) {
                this.$axios.post(`${this.$config.apiDomain}/traits/${this.traitCode}/publish`, {
                    catalog_id: publish.catalogName[publish.catalogName.length - 1] || 0,
                    name: publish.name
                })
                    .then((() => {
                        this.showPublish = false;
                        this.$Message.destroy();
                        this.$Message.success('已发布');

                        // 更新特性列表或详情信息
                        if (this.pageType === 'detail') {
                            this.$router.push({
                                path: '/trait',
                                query: { tabView: this.tabView }
                            });
                        }
                        this.$tools.bus.$emit('updateTraitList');
                    }));
            },

            // 取消发布
            publishCancel() {
                this.showPublish = false;
            },

            dropMenu(ev) {
                const status = ev.split(',')[0]; // 删除或冻结等状态按钮
                const crowdTraitCode = ev.split(',')[1]; // 人群和特性的删除或冻结等操作的code。
                const auditStatus = ev.split(',')[2] || ''; // 审核状态  pending就return;
                const activeStatus = ev.split(',')[3] || ''; // 激活状态  不可删除
                const calcStatus = ev.split(',')[4] || ''; // 计算状态  不可删除
                const supportRecalc = ev.split(',')[5] || ''; // 是否支持重计算

                // 人群
                if (this.type === 'crowd') {
                    if (auditStatus === 'pending') return;
                    if (status === 'freeze') {
                        if (calcStatus === 'res_calculating' || calcStatus === 'cleaning') return;
                        this.$Modal.confirm({
                            title: '确认冻结此人群？',
                            content: `名称：${this.row.name}<br><br>冻结后将清空数据并停止更新`,
                            onOk: () => {
                                this.$axios.put(`${this.$config.apiDomain}/crowds/${crowdTraitCode}/state`, {
                                    state_type: 'freeze',
                                    need_recalc: false // 冻结不需要重计算
                                }).then(({ data }) => {
                                    // 更新人群列表
                                    this.$Message.destroy();
                                    this.$Message.success('已冻结');
                                    // 更新人群列表或详情信息
                                    if (this.pageType === 'list') this.$tools.bus.$emit('updateCrowdList');
                                    if (this.pageType === 'detail') this.$emit('updateCrowdDetail', data);
                                });
                            },
                            onCancel: () => {}
                        });
                    }
                    else if (status === 'active') {
                        if (calcStatus === 'res_calculating' || calcStatus === 'cleaning') return;
                        this.$Modal.confirm({
                            title: '确认激活此人群？',
                            render: h => h('div', [
                                h('p', {
                                    style: {
                                        marginLeft: '40px'
                                    }
                                }, `名称：${this.row.name}`)
                            ]),
                            onOk: () => {
                                this.$axios.put(`${this.$config.apiDomain}/crowds/${crowdTraitCode}/state`, {
                                    state_type: 'active'
                                })
                                    .then(({ data }) => {
                                        this.$Message.destroy();
                                        this.$Message.success('已提交审核');
                                        // 更新人群列表或详情信息
                                        if (this.pageType === 'list') this.$tools.bus.$emit('updateCrowdList');
                                        if (this.pageType === 'detail') this.$emit('updateCrowdDetail', data);
                                    })
                                    .catch((error) => {
                                        if (error.response.data.sub_code == 'ERROR_CROWD_ACTIVE_THRESHOLD') {
                                            setTimeout(() => {
                                                this.$Modal.warning({
                                                    title: '无法激活 :',
                                                    content: '渠道内激活的人群总数已达上限，请尝试先冻结其它人群，再来激活该人群，或请联系渠道管理员。'
                                                });
                                            }, 300);
                                        }
                                    });
                            },
                            onCancel: () => {}
                        });
                    }
                    else if (status === 'calc') {
                        if (supportRecalc == 'false') return;
                        this.$Modal.confirm({
                            title: '重新计算此人群？',
                            render: h => h('div', [
                                h('p', {
                                    style: {
                                        marginLeft: '40px'
                                    }
                                }, `名称：${this.row.name}`)
                            ]),
                            onOk: () => {
                                this.$axios.put(`${this.$config.apiDomain}/crowds/${crowdTraitCode}/calc-realtime`)
                                    .then(({ data }) => {
                                        this.$Message.destroy();
                                        this.$Message.success('已提交重新计算');
                                        // 更新人群列表或详情信息
                                        if (this.pageType === 'list') this.$tools.bus.$emit('updateCrowdList');
                                        if (this.pageType === 'detail') this.$emit('updateCrowdDetail', data);
                                    });
                            }
                        });
                    }
                    else if (status === 'delete') {
                        if (activeStatus === 'active') return;
                        if (calcStatus === 'cleaning') return;
                        this.$Modal.confirm({
                            title: '确认删除此人群？',
                            content: `名称：${this.row.name}<br></br>删除后将无法恢复。`,
                            onOk: () => {
                                this.$axios.delete(`${this.$config.apiDomain}/crowds/${crowdTraitCode}`)
                                    .then((() => {
                                        this.$Message.destroy();
                                        this.$Message.success('已删除');
                                        if (this.pageType === 'list') this.$tools.bus.$emit('updateCrowdList');
                                        if (this.pageType === 'detail') {
                                            this.$router.push({
                                                path: '/crowd',
                                                query: { tabView: this.tabView }
                                            });
                                        }
                                    }));
                            },
                            onCancel: () => {}
                        });
                    }
                    else {
                        const detail = {
                            name: status,
                            code: crowdTraitCode,
                            tabView: this.$session.getViewScope(this.row),
                            groupID: this.group_id
                        };
                        this.$router.push({
                            path: '/crowd/detail',
                            query: detail
                        });

                        sessionStorage.setItem('crowdReturn', JSON.stringify(detail.tabView));
                    }
                } else {
                    // 特性
                    if (auditStatus === 'pending') return;
                    if (status === 'freeze') {
                        if (calcStatus === 'res_calculating' || calcStatus === 'cleaning') return;
                        this.$Modal.confirm({
                            title: '确认冻结此特性？',
                            content: `名称：${this.row.name}<br><br>冻结后将清空数据并停止更新`,
                            onOk: () => {
                                this.$axios.put(`${this.$config.apiDomain}/traits/${crowdTraitCode}/change-lifecycle`, {
                                    lifecycle_status: 'freeze',
                                    is_recalc: false
                                })
                                    .then((({ data }) => {
                                        this.$Message.destroy();
                                        this.$Message.success('已冻结');
                                        // 更新特性列表或详情信息
                                        if (this.pageType === 'list') this.$tools.bus.$emit('updateTraitList');
                                        if (this.pageType === 'detail') this.$emit('updateTraitDetail', data);
                                    }));
                            },
                            onCancel: () => {}
                        });
                    }
                    else if (status === 'active') {
                        if (calcStatus === 'res_calculating' || calcStatus === 'cleaning') return;
                        this.isRecalc = true;
                        this.$Modal.confirm({
                            title: '确认激活此特性？',
                            render: h => h('div', [
                                h('p', {
                                    style: {
                                        marginLeft: '40px'
                                    }
                                }, `名称：${this.row.name}`),
                                h('br'),
                                h('Checkbox', {
                                    props: {
                                        value: this.isRecalc
                                    },
                                    style: {
                                        marginLeft: '40px'
                                    },
                                    on: {
                                        'on-change': (v) => {
                                            this.isRecalc = v;
                                        }
                                    }
                                }, '激活后重新计算')
                            ]),
                            onOk: () => {
                                this.$axios.put(`${this.$config.apiDomain}/traits/${crowdTraitCode}/change-lifecycle`, {
                                    lifecycle_status: 'active',
                                    is_recalc: this.isRecalc // 激活是否要重计算
                                })
                                    .then((({ data }) => {
                                        this.$Message.destroy();
                                        if (this.tabView === 'public') {
                                            this.$Message.success('已激活');
                                        } else {
                                            this.$Message.success('已提交审核');
                                        }
                                        // 更新特性列表或详情信息
                                        if (this.pageType === 'list') this.$tools.bus.$emit('updateTraitList');
                                        if (this.pageType === 'detail') this.$emit('updateTraitDetail', data);
                                    }))
                                    .catch((error) => {
                                        if (error.response.data.sub_code == 'ERROR_TRAIT_ACTIVE_THRESHOLD') {
                                            setTimeout(() => {
                                                this.$Modal.warning({
                                                    title: '无法激活 :',
                                                    content: '渠道内激活的特性总数已达上限，请尝试先冻结其它特性，再来激活该特性，或请联系渠道管理员。'
                                                });
                                            }, 300);
                                        }
                                    });
                            },
                            onCancel: () => {}
                        });
                    }
                    else if (status === 'delete') {
                        if (activeStatus === 'active') return;
                        this.$Modal.confirm({
                            title: '确认删除此特性？',
                            content: `名称：${this.row.name}<br><br>删除后将无法恢复。`,
                            onOk: () => {
                                this.$axios.delete(`${this.$config.apiDomain}/traits/${crowdTraitCode}`)
                                    .then((() => {
                                        this.$Message.destroy();
                                        this.$Message.success('已删除');
                                        // 更新特性列表或详情信息
                                        if (this.pageType === 'list') this.$tools.bus.$emit('updateTraitList');
                                        if (this.pageType === 'detail') {
                                            this.$router.push({
                                                path: '/trait',
                                                query: { tabView: this.tabView }
                                            });
                                        }
                                    }));
                            },
                            onCancel: () => {}
                        });
                    }
                    else if (status === 'publish') {
                        if (activeStatus === 'freeze') return;
                        this.showPublish = true;
                        this.traitCode = crowdTraitCode;
                    }
                    else {
                        const detail = {
                            name: status, // 显示详情的哪个tab页
                            code: crowdTraitCode, // 对应行的code
                            tabView: this.$session.getViewScope(this.row),
                            groupID: this.group_id
                        };
                        this.$router.push({
                            path: '/trait/detail',
                            query: detail
                        });

                        sessionStorage.setItem('traitReturn', JSON.stringify(detail.tabView));
                    }
                }
            }
        },
        components: {
            Publish
        },
        mounted() {
        }
    };
</script>

<style scoped lang="less">
    .operation{
        cursor: pointer;
        color:#2b85e4;
    }
</style>
