<template>
    <div class="advertise-touch mt20">
        <Row type="flex" justify="space-between">
            <Col style="flex:1;">
            <Card dis-hover style="min-height:192px;">
                <p slot="title">触点选择
                    <Tooltip max-width="300" content="必须选择一个触点" placement="right">
                        <i class="fa fa-question-circle-o"></i>
                    </Tooltip>
                </p>
                <div class="touch_select">
                    <Cascader placeholder="请选择触达网关" :render-format="label => label.join(' > ')" :data="channelData" change-on-select></Cascader>
                    <TraitInput placeholder="请选择触达特性" class="touch_trait mt20" v-bind="propsData" :value="traitValue" @on-change="updateTrait">
                    </TraitInput>
                </div>
            </Card>
            </Col>
            <Col style="width:350px;margin-left:16px;">
            <Card dis-hover>
                <p style="text-align:center;" slot="title">投放人群预估</p>
                <Row>
                   <Col span="4" offset="1">
                    <Icon style="cursor:default;" type="ios-people-outline" size="70" color="#ccc"/>
                   </Col>
                   <Col span="19">
                    <ul class="estimate">
                        <li><span class="left_count"><span>{{$activity.crowdPrediction.target}}</span></span><span>目标人群</span></li>
                        <li><span class="left_count"><span>{{$activity.crowdPrediction.exclude}}</span></span><span>排除人群</span></li>
                        <li><span class="left_count"><span>{{$activity.crowdPrediction.plan}}</span></span><span>计划人数{{$activity.crowdPrediction.type}}</span></li>
                    </ul>
                   </Col>
               </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'Touch',
        data() {
            return {
                propsData: {
                    // group: {
                    //     id: 123456,
                    //     name: '运营组test'
                    // }, //当前组，包括id，name
                    event: null, // 需要显示的Event的特性
                    selfTrait: true,
                    publicTrait: true,
                    groupTrait: true,
                    selfCrowd: false,
                    groupCrowd: false,
                    disabled: false,
                    value: {}
                },
                channelData: this.$activity.touchGateway
            };
        },
        computed: {
            traitValue() {
                return this.propsData.value;
            }
        },
        methods: {
            updateTrait(val) {
                this.propsData.value = val;
                console.log(val);
            }
        }
    };
</script>

<style lang="less" scoped>
    .advertise-touch {
        .touch_select {
            width: 400px;
        }
        .touch_trait {
            display: block;
        }
        .estimate {
            li {
                display: flex;
                font-size: 14px;
                padding: 5px 0;
                span {
                    flex: 1;
                    &.left_count {
                        color: #2d8cf0;
                        text-align: right;
                        padding-right: 20px;
                        font-weight: bold;
                    }
                    span{
                        font-size:16px
                    }
                }
            }
        }
    }
</style>

<style lang="less">
    .advertise-touch {
        .ivu-cascader-menu {
            width: 120px;
        }
    }
</style>
