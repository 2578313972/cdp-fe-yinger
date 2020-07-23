<template>
    <div>
        <a @click="dropMenu(`detail,${row.type_val}`)">
                    详情
                </a>
        <Dropdown trigger="click" @on-click="dropMenu">
            <a href="javascript:void(0)">
                <Icon type="md-more"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem :name="`stop,${row.id}`">
                    暂停
                </DropdownItem>
                <DropdownItem :name="`end,${row.id}`">
                    结束
                </DropdownItem>
                <DropdownItem :name="`copy,${row.id}`">
                    克隆
                </DropdownItem>
                <DropdownItem :name="`del,${row.id}`">
                    删除
                </DropdownItem>
                <!--<DropdownItem
                        v-if="row.lifecycle_status==='active'"
                        :disabled="row.audit_status==='pending'"
                        :name="`freeze,${row.id},${row.audit_status}`">
                            克隆
                        </DropdownItem>
                        <DropdownItem :disabled="row.audit_status==='pending'||row.lifecycle_status==='active'" :name="`delete,${row.id},${row.audit_status},${row.lifecycle_status}`">
                            删除
                        </DropdownItem> -->
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    export default {
        props: {
            row: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {};
        },
        computed: {},
        components: {},
        //    created:{},
        mounted() {},
        methods: {
            // 详情
            dropMenu(val) {
                const status = val.split(',')[0]; // 操作名称
                const rowId = val.split(',')[1]; // 操作id
                switch (status) {
                case 'detail':
                    this.$router.push({
                        path: '/activity/detail',
                        query: {
                            name: 'detail'

                        // tabView: row.visibility,
                        // groupID: row.group_id,
                        }
                    });
                    this.$config.interactive_type = rowId;
                    break;
                case 'stop':
                    this.$Message.info('stop');
                    // 暂停
                    break;
                case 'end':
                    this.$Message.info('end');
                    // 结束
                    break;
                case 'copy':
                    this.$Message.info('copy');
                    // 克隆
                    break;
                case 'del':
                    this.$Message.info('del');
                    // 删除
                    break;
                default:
                    break;
                }
            }
        },
        watch: {},
        destroyed() {}
    };
</script>

<style scoped lang="less">

</style>
