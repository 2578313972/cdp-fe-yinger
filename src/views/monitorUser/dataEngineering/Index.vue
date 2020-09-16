<template>
  <div class="dataEngineering">
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
    import ServiceOutlier from './ServiceOutlier';
    import UniquenessCheck from './UniquenessCheck';
    import FieldNullRate from './FieldNullRate';
    import DataEntry from './DataEntry';

    export default {
        data() {
            return {
                menuList: [],
                menuName: 0,
                showComponent: false,
                screenWidth: 0
            };
        },
        components: {
            ServiceOutlier,
            UniquenessCheck,
            FieldNullRate,
            DataEntry
        },
        created() {
            this.menuList = [
                { name: '业务异常值', component: 'ServiceOutlier' },
                { name: '唯一性检查', component: 'UniquenessCheck' },
                { name: '字段空值率', component: 'FieldNullRate' },
                { name: '数据条目', component: 'DataEntry' }
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
    .dataEngineering{
        height: 100%;
        background-color: white;
    }
</style>
