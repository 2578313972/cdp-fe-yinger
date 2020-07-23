<template>
    <div class="authorization">
        <div class="tree-wrapper">
            <add-operation-tree @get-tree-num="getTreeNum"></add-operation-tree>
        </div>
        <template>
            <div v-if="num" class="info-wrapper">
                <Spin size="large" fix v-if="isLoading">
                    <span class="iconfont icon-notification_sync spin-icon-load"></span>
                    <div>导入中...</div>
                </Spin>
                <node-info @loading="getLoading" :root-id="rootId" :root-info="rootInfo" :org-info="orgInfo" @update-architect-info="updateArchitectInfo"></node-info>
                <specialist isOrg :org-info="orgInfo"></specialist>
            </div>
            <div v-else></div>
        </template>
    </div>
</template>

<script>
    import AddOperationTree from './AddOperationTree';
    import NodeInfo from './NodeInfo';
    import Specialist from './Specialist';

    export default {
        data() {
            return {
                isLoading: false,
                rootInfo: {},
                orgInfo: {},
                rootId: '',
                num: 0
            };
        },
        methods: {
            getLoading(status) {
                this.isLoading = status;
            },
            getTreeNum(num) {
                this.num = num;
            },
            updateArchitectInfo(data) {
                if (data.org_id === this.rootId) {
                    const {
                        name,
                        user_trait_display_name,
                        org_id
                    } = data;
                    this.rootInfo = Object.assign({}, this.rootInfo, {
                        name,
                        user_trait_display_name,
                        org_id
                    });
                }
            }
        },
        computed: {},
        watch: {},
        components: {
            AddOperationTree,
            NodeInfo,
            Specialist
        },
        mounted() {
            this.$tools.bus.$on('loadNodeInfo', (val, rootInfo, rootId) => {
                this.rootId = rootId;
                this.orgInfo = val;
                this.rootInfo = rootInfo;
            });
        },
        beforeDestroy() {
            this.$tools.bus.$off('loadNodeInfo');
        }
    };
</script>

<style scoped lang="less">
.authorization {
    height: 100%;
    display: flex;
    overflow-y: hidden;
    .spin-icon-load {
        font-size: 18px;
        display: inline-block;
        animation: ani-spin 1s linear infinite;
    }
    @keyframes ani-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .tree-wrapper {
        width: 256px;
        height: 100%;
        position: relative;
        bottom: 0;
        left: 0;
        background: #fff;
    }
    .info-wrapper {
        flex: 1;
        overflow: auto;
    }
}
</style>
