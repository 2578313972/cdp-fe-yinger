<template>
    <div class="advertise-touch mt20">
        <Row type="flex" justify="space-between">
            <Col style="flex:1">
            <Card dis-hover>
                <p slot="title">选定触达人群
                    <Tooltip max-width="300" content="选择一个投放人群，如果是响应形式的可以跳过" placement="right">
                        <i class="fa fa-question-circle-o"></i>
                    </Tooltip>
                </p>
                <div>
                    <Row>
                        <Col span="3">
                            目标人群：
                        </Col>
                        <Col span="13">
                            <TraitInput
                                placeholder="请选择人群"
                                class="touch-trait"
                                v-bind="crowdData"
                                :value="crowdValue"
                                @on-change="updateCrowd">
                            </TraitInput>
                        </Col>
                    </Row>
                    <Row class="mt10">
                      <Col span="3">
                            投放排除：
                        </Col>
                        <Col span="20">
                            <TraitInput
                                placeholder="添加人群"
                                v-bind="crowdParams"
                                :closable="true"
                                :count="10"
                                :btnType="true"
                                btnText="添加人群"
                                :isShowTagList="true"
                                :multiple="true"
                                @on-change="setObject"
                                :value="crowdValue">
                            </TraitInput>
                        </Col>
                    </Row>
                     <Row class="mt10">
                        <Col span="3">
                            渠道排除：
                        </Col>
                        <Col span="20">
                            <Switch v-model="channelRemoval" @on-change="changeChannelRemoval" />
                        </Col>

                    </Row>
                     <Row class="mt10" v-if="channelRemoval">
                        <Col span="8" offset="3">
                             <Input v-model="value9" disabled placeholder="Enter something..." />
                        </Col>
                    </Row>
                     <Row class="mt10">
                      <Col span="3">
                            是否去重：
                        </Col>
                        <Col span="20">
                            <Switch v-model="channelRemoval" />
                        </Col>
                    </Row>
                     <Row class="mt10">
                      <Col span="3">
                            是否频控：
                        </Col>
                        <Col span="20">
                            <Switch v-model="channelRemoval"  />
                        </Col>
                    </Row>
                </div>
            </Card>
            <!-- <Card class="mt16" dis-hover>
                <p slot="title">排除人群
                    <Tooltip max-width="320" content="可以添加多个排除人群，黑名单优先级最高。（可选）" placement="right">
                        <i class="fa fa-question-circle-o"></i>
                    </Tooltip>
                </p>
                <div>
                    <TraitInput :isShowTag="false" placeholder="请选择去除的人群" class="touch-trait" v-bind="removeData" :value="removeValue" :multiple="true" @on-change="updateRemoveCrowd"></TraitInput>
                    <Row class="mt10">
                        <Col span="24">
                        <Tag type="dot" color="success" class="minw400">&nbsp;&nbsp;VIP免打扰客户名单&nbsp;&nbsp;</Tag>
                        <span class="crowd-count">200人</span>
                        </Col>
                    </Row>
                    <Row class="mt10" v-for="(item,index) in tagList" :key="index">
                        <Tag class="minw400" type="dot" color="success" :name="item" closable @on-close="closeTag(index)"><span class="closeTag">&nbsp;&nbsp;{{item}}&nbsp;&nbsp;</span></Tag>

                        <span class="crowd-count">200人</span>
                    </Row>
                </div>
            </Card> -->
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
                        <li><span class="left-count"><span>{{$activity.crowdPrediction.target}}</span></span><span>目标人群</span></li>
                        <li><span class="left-count"><span>{{$activity.crowdPrediction.exclude}}</span></span><span>排除人群</span></li>
                        <li><span class="left-count"><span>{{$activity.crowdPrediction.plan}}</span></span><span>计划人数{{$activity.crowdPrediction.type}}</span></li>
                    </ul>
                   </Col>
               </Row>

            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12">

            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'Touch',
        data() {
            return {
                crowdData: {
                    // group: {
                    //     id: 123456,
                    //     name: '运营组test'
                    // }, //当前组，包括id，name
                    event: null, // 需要显示的Event的特性
                    selfTrait: false,
                    publicTrait: false,
                    groupTrait: false,
                    selfCrowd: true,
                    groupCrowd: true,
                    disabled: false,
                    value: {}
                },
                removeData: {
                    // group: {
                    //     id: 123456,
                    //     name: '运营组test'
                    // }, //当前组，包括id，name
                    event: null, // 需要显示的Event的特性
                    selfTrait: false,
                    publicTrait: false,
                    groupTrait: false,
                    selfCrowd: true,
                    groupCrowd: true,
                    disabled: false,
                    value: {}
                },
                tagList: [],
                removeList: {
                    crowdId: '',
                    exportConfig: []
                },
                channelRemoval: true,
                value9: '4555',
                crowdParams: {
                    selfCrowd: true,
                    value: {},
                    selfTrait: false,
                    publicTrait: false,
                    groupTrait: false
                },
                URL: {}
            };
        },
        computed: {
            crowdValue() {
                return this.crowdData.value;
            },
            removeValue() {
                return this.removeData.value;
            }
        },
        methods: {
            updateCrowd(val) {
                this.crowdData.value = val;
            },
            updateRemoveCrowd(val) {
                if (val.names.length > 10) {
                    return;
                }
                this.removeData.value = val;
                this.setObject(val);
            },
            setObject(obj) {
                this.tagList = obj.names;
                this.removeList.exportConfig = this.$lodash.cloneDeep(obj);
            },
            // 删除排除人群Taglist
            closeTag() {
            // this.tagList.splice(_index, 1);
            // this.removeValue.names.splice(_index, 1)
            // this.removeValue.value.splice(_index, 1)
            // this.removeValue.data_types.splice(_index, 1)
            // this.removeList.exportConfig.splice(_index, 1);
            // console.log(this.tagList, 5, this.removeValue, this.removeList.exportConfig)
            },
            changeChannelRemoval() {

            }
        }
    };
</script>

<style lang="less" scoped>
    .advertise-touch {
        .minw400 {
            min-width: 400px
        }
        .touch-trait {
            display: block; // width: 50%
            width: 400px
        }
        .crowd-count {
            line-height: 46px;
            font-size: 14px;
            color: #2d8cf0;
            ;
            font-weight: 600
        }
        .closeTag {
            display: inline-block;
            min-width: 320px
        }
        .estimate {
            li {
                display: flex;
                font-size: 14px;
                padding: 5px 0;
                span {
                    flex: 1;
                    &.left-count {
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
            width: 200px;
        }
    }
</style>
