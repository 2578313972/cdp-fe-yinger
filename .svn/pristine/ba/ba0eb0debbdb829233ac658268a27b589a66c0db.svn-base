<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow">
        概览
    </div>
    <div class="channel-home page-content container-padding24">
        <!-- 渠道资源总数 -->
        <overview-tab
            tabTitle="渠道资源总数"
            traitTooltip="当前渠道内所有特性的总数"
            crowdTooltip="当前渠道内所有人群的总数"
            auditTooltip="当前渠道内所有待审核的总数">
        </overview-tab>
        <!-- 渠道用户数 -->
        <user-amount class="mt24" tabTitle="渠道用户数" :tab-arr="tabArr" isShowToday></user-amount>
        <!-- 特性实时分析 -->
        <trait-analyse
            visible
            noDataMsg="未添加任何特性，若需要添加实时特性分析，请点击右上方添加按钮">
        </trait-analyse>
    </div>
</div>
</template>
<script>
    import OverviewTab from '@/components/overview/Overview.vue';
    import UserAmount from '@/components/overview/UserAmount.vue';
    import TraitAnalyse from '@/components/overview/TraitAnalyse.vue';

    export default {
        name: 'Channel',
        components: {
            OverviewTab,
            UserAmount,
            TraitAnalyse
        },
        data() {
            return {
                tabArr: [
                    {
                        label: '累计趋势',
                        name: 'total'
                    },
                    {
                        label: '新增趋势',
                        name: 'increase'
                    }]
            };
        }
    };
</script>
