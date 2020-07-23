<template>
<Dropdown
    trigger="custom"
    placement="bottom-end"
    @click="handleOpen"
    transfer
    :visible="visible"
    @on-clickoutside="handleClose"
    transfer-class-name="add-member-box">
    <a @click="handleOpen">转移</a>
    <DropdownMenu slot="list" style="padding:10px 0 0;">
        <div style="padding:0 16px;">
            <Input class="width300"
                icon="ios-search"
                @keyup.native.enter="searchList"
                @on-change="searchList"
                v-model="searMember"
                placeholder="请输入姓名/邮箱">
            </Input>
        </div>
        <div class="ivu-select-dropdown" style="position:static;box-shadow:none;max-height:135px;overflow:auto;">
            <ul class="ivu-select-not-found" v-show="!selectDataList.length&&searMember">
                <li>无匹配数据</li>
            </ul>
            <ul class="ivu-select-dropdown-list">
                <li v-for="item in selectDataList"
                    :key="item.value"
                    @click="confirmTransfer(item)"
                    class="ivu-select-item">
                    <span>{{item.name}}</span>
                    <span v-if="item.label" class="name-email">{{item.label}}</span>
                </li>
            </ul>
        </div>
    </DropdownMenu>
</Dropdown>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                searMember: '',
                tipCon: '将私有的特性、人群转移给同节点的其他账号管理。',
                tipCon2: '将运营组的特性、人群转移给同节点其他的运营组管理。',
                selectDataList: this.selectData,
                selectDataBackup: []
            };
        },
        props: {
            selectData: {
                type: Array,
                default() {
                    return [];
                }
            },
            orginInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            type: {
                default: '',
                type: String
            }
        },
        created() {
            this.selectDataBackup = this.$lodash.cloneDeep(this.selectData);
            this.selectDataList = this.$lodash.cloneDeep(this.selectData);
        },
        methods: {
            handleOpen() {
                this.visible = !this.visible;
                this.resetAddInput();
            },
            handleClose(e) {
                if (this.isClickSelf(e.target)) {
                    return;
                }
                this.visible = false;
            },
            changeResource(item) {
                const apiUrl = '/sys/resource';
                const params = [];

                if (item.value && this.orginInfo.id) {
                    params.push({
                        type: this.type,
                        to_id: item.value,
                        from_id: this.orginInfo.id
                    });
                }
                this.$axios.put(`${this.$config.apiDomain}${apiUrl}`, params)
                    .then(({
                        data
                    }) => {
                        const len = (data && data.length) || 0;
                        // 数组为空，全部转移成功；数组不为空，数组中的对象转移失败
                        if (!len) {
                            this.$Message.destroy();
                            this.$Message.success('已转移');
                        } else {
                            this.$Message.destroy();
                            data.forEach((item) => {
                                const typeName = item.type === 'self' ? '私有资源' : '运营组资源';
                                this.$Message.error({
                                    content: `${typeName}转移失败，${item.error_message}`,
                                    duration: 5
                                });
                            });
                        }
                    });
            },
            // 确认转移
            confirmTransfer(data) {
                if (data.value == this.orginInfo.id) {
                    this.$Message.destroy();
                    this.$Message.error(this.type === 'self' ? '原所属人和目标所属人不能相同' : '原运营组和目标运营组不能相同');
                    return;
                }
                this.$Modal.confirm({
                    title: '确认转移？',
                    content: `<p class="f24">${this.orginInfo.name} <span class="color-blue f24 iconfont icon-hardware_keyboard_backspace
"></span> ${data.name}</p><br/><br/>${this.type === 'self' ? this.tipCon : this.tipCon2}`,
                    onOk: () => {
                        this.changeResource(data);
                    }
                });
                this.visible = false;
            },
            resetAddInput() {
                this.searMember = '';
                this.selectDataList = this.$lodash.cloneDeep(this.selectDataBackup);
            },
            searchList() {
                if (this.searMember !== '') {
                    this.selectDataList = this.selectDataBackup.filter(item => item.name.indexOf(this.searMember) !== -1 || (item.label && item.label.indexOf(this.searMember) !== -1));
                } else {
                    this.resetAddInput();
                }
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
        }
    };
</script>
