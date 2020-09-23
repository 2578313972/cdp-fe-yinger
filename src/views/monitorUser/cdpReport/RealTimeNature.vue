<template>
    <!-- 实时特性 -->
    <div class="RealTimeNature">
        <Row class="padding16-18" style="background:white;">
            <i-col span="24" class="flex nav">
                <div class="select">
                    <span>channel_id</span>
                    <Select style="flex:1" size="large">
                        <Option v-for="item in aaa" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>traitStatus</span>
                    <Select style="flex:1" size="large">
                        <Option v-for="item in aaa" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
                <div class="select second">
                    <span>traitDirectory</span>
                    <Select style="flex:1" size="large">
                        <Option v-for="item in aaa" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
            </i-col>
            <i-col class="containers" span="24">
                <Table stripe border :columns="columns" :data="tableData" :width="screenWidth"></Table>
            </i-col>
            <i-col span="24" style="text-align:right;">
                <Page
                :current="current"
                :page-size="pageSize"
                :total="allDataSize"
                @on-change="debouncePage"
                show-elevator
                ></Page>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                aaa: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                columns: [],
                tableData: [],
                current: 1,
                pageSize: 0,
                allDataSize: 0
            };
        },
        props: {
            screenWidth: {
                type: Number,
                require: true
            }
        },
        created() {
            this.columns = [
                {
                    title: '渠道',
                    key: '',
                    minWidth: '',
                    align: 'left',
                    tooltip: true
                },
                {
                    title: '特性ID',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '特性名称',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '特性类型',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '覆盖用户数',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '状态',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '创建者',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '所属目录',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '引用特性数量',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '被引用特性数量',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '被引用人群数量',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '激活时间',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                },
                {
                    title: '数据采集时间',
                    key: '',
                    minWidth: '',
                    align: 'center',
                    tooltip: true
                }
            ];
            const timer = this.$config.debounce_wait;
            this.debouncePage = this.$lodash.debounce(this.pageChange, timer); // 分页
        },
        mounted() {
            this.resize();

            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
            getData() {

            },
            pageChange(ind) {
                this.current = ind;
                this.getData();
            },
            resize() {
            }
        }
    };
</script>

<style lang="less" scoped>
    .RealTimeNature{
        .nav{
            box-sizing: border-box;
            padding-left:6px;
            margin-bottom: 25px;
            .select{
                width:200px;
                display: flex;
                border-radius: 5px;
                border:1px solid #DDE4ED;
                span{
                    line-height: 38px;
                    display: inline-block;
                    background-color: #DDE4ED;
                    padding:0 10px;
                }
                ~.second{
                    margin-left:20px;
                }
            }
        }
        /deep/ .ivu-select-selection, /deep/ .ivu-select-selection-focused,/deep/ .ivu-select-selection:hover{
            border:0px;
            box-shadow: 0 0 0 0;
        }
        .containers{
            display: flex;
            flex-wrap: wrap;
            div{
                margin:0 auto;
            }
        }
    }
</style>
