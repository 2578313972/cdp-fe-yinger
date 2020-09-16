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
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                aaa: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                columns: [],
                tableData: []
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
                    align: '',
                    tooltip: ''

                }
            ];
        },
        mounted() {
            this.resize();

            window.addEventListener('resize', this.resize);
            this.$once('hook:beforeDestroy', () => {
                window.removeEventListener('resize', this.resize);
            });
        },
        methods: {
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
