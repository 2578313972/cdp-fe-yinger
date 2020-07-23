<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow">
        概览
    </div>
    <div class="node-home page-content container-padding24">
        <!-- 节点资源总数 -->
        <overview-tab tabTitle="节点资源总数"
        traitTooltip="当前节点内所有特性的总数（不包含公共的和下级节点）"
        crowdTooltip="当前节点内所有人群的总数（不包含下级节点）"
        auditTooltip="当前节点内所有待审核的总数"></overview-tab>
        <!-- 节点用户数 -->
        <user-amount class="mt24" tabTitle="节点用户数"></user-amount>
        <!-- 特性实时分析 -->
        <trait-analyse></trait-analyse>
    </div>
</div>
</template>
<script>
    import OverviewTab from '@/components/overview/Overview.vue';
    import UserAmount from '@/components/overview/UserAmount.vue';
    import TraitAnalyse from '@/components/overview/TraitAnalyse.vue';

    export default {
        name: 'Node',
        components: {
            OverviewTab,
            UserAmount,
            TraitAnalyse
        },
        data() {
            return {

            };
        }
    };
</script>
<style lang="less" scoped>
.node-home {

}
</style>
