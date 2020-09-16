<template>
  <div class="cdpReport">
    <div class="page-title bottom-shadow page-title-tab" ref="likeScreen">
      <Menu class="pl24" mode="horizontal" :active-name="menuName" @on-select="meunOption">
        <MenuItem v-for="(item,index) in menuList" :key="item.name" :name="index">{{item.name}}</MenuItem>
      </Menu>
        <keep-alive style="position: relative;">
            <Spin size="large" fix v-if="!showComponent"></Spin>
            <component v-else :is="menuList[menuName].component" :screenWidth="screenWidth" />
        </keep-alive>
    </div>
  </div>
</template>

<script>
    import RealTimeNature from './RealTimeNature';
    import RealTimeCrowd from './RealTimeCrowd';
    import HistoricalTrend from './HistoricalTrend';
    import AlarmList from './AlarmList';

    export default {
        name: 'cdpReport',
        data() {
            return {
                menuList: [],
                menuName: 0,
                showComponent: false,
                screenWidth: 0
            };
        },
        components: {
            RealTimeNature,
            RealTimeCrowd,
            HistoricalTrend,
            AlarmList
        },
        created() {
            this.menuList = [
                { name: '实时特性', component: 'RealTimeNature' },
                { name: '实时人群', component: 'RealTimeCrowd' },
                { name: '历史趋势', component: 'HistoricalTrend' },
                { name: '报警列表', component: 'AlarmList' }
            ];
        },
        mounted() {
            this.resize();
            this.showComponent = true;
            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            meunOption(e) {
                this.menuName = e;
            },
            resize() {
                this.screenWidth = this.$refs.likeScreen.clientWidth - 36;
            }
        }
    };
</script>

<style lang="less" scoped>
    .cdpReport{
        height: 100%;
        background-color: white;
    }
</style>
