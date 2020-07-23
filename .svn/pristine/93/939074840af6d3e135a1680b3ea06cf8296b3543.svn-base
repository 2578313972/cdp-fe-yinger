<template>
    <div class="advertising-list w100 h100">
        <Row class="details-title" type="flex" justify="space-between">
            <Col>
            <Breadcrumb>
                <BreadcrumbItem :to="returnList">返回列表</BreadcrumbItem>
                <BreadcrumbItem>{{breadcrumb[0]}}</BreadcrumbItem>
            </Breadcrumb>
            </Col>
        </Row>
        <div class="scroll-wrap">
            <Card class="m10" dis-hover>
                <Form label-position="left" ref="formArea" :model="formItem">
                    <Row>
                        <Col span="16">
                        <Row class="detail-height">
                            <Col span="2">
                            <p>活动名称：</p>
                            </Col>
                            <Col span="10">
                            <edit-input :max-length="20" label="" default-placeholder="请输入名称，20字以内" style="margin-bottom: 0;" label-name="name" :tipContent="formItem.name" :content="formItem.name" :edit-show="nameEditShow" v-on:cancel-edit="cancelEdit" v-on:confirm-info="confirmInfo"
                                v-on:change-status="(status) => changeStatus(status, 'nameEditShow')">
                            </edit-input>
                            </Col>
                            <Col span="2">
                            <p>活动ID：</p>
                            </Col>
                            <Col span="5">
                            <p class="color-blue">{{activityDetail.id}}</p>
                            </Col>
                            <Col span="2">
                            <p>创建人：</p>
                            </Col>
                            <Col span="3">
                            <p class="color-blue">{{activityDetail.creater}}</p>
                            </Col>
                        </Row>
                        <Row class="detail-height">
                            <Col span="2">
                            <p>创建时间：</p>
                            </Col>
                            <Col span="10">
                            <p class="color-blue"> {{activityDetail.creatTime}}</p>
                            </Col>
                            <Col span="3">
                            <p>活动起止时间：</p>
                            </Col>
                            <Col span="8">
                            <DatePicker type="daterange" transfer show-week-numbers placement="bottom-end" placeholder="Select date" style="width: 250px" :value="activityDetail.activityDate"></DatePicker>
                            </Col>
                        </Row>
                        </Col>
                        <!-- 右侧描述 -->
                        <Col span="8">
                        <Row>
                            <Col span="3">
                            <p style="margin-top:8px">描述：</p>
                            </Col>
                            <Col span="21">
                            <edit-input :max-length="100" textarea="textarea" label="" default-placeholder="请输入描述，100字以内" style="margin-bottom: 0;" label-name="description" :inputWidth="400" :size-obj="{maxRows:5,minRows:3}" :tipContent="formItem.description" :content="formItem.description"
                                :edit-show="defineEditShow" v-on:cancel-edit="cancelEdit" v-on:confirm-info="confirmInfo" v-on:change-status="(status) => changeStatus(status, 'defineEditShow')">
                            </edit-input>
                            </Col>
                        </Row>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Card class="m10" dis-hover>
                <Row class="text-align-c ">
                    <Col span="8" v-for="(item,index) in state" :key="index" :class="(index!==2)?line:''">
                    <p class="f20 color-blue">{{item.value}}</p>
                    <p class="pt10">{{item.name}}</p>
                    </Col>
                </Row>
            </Card>
            <Card class="m10" dis-hover>
                <Row class="mt10" >
                    <Col span="3">
                    <Select v-model="model1" style="width:140px">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="3">
                    <Select v-model="model1" style="width:140px;margin-left:10px">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="15">
                    <Input class="dependant-search" @keyup.native.enter="debounceSearch" @on-change="debounceSearch" v-model="unitName" placeholder="请输入投放单元名称" icon="ios-search"></Input>
                    <span class="total-count">共<i>55</i>个投放单元</span>
                    </Col>
                    <Col span="3" style="text-align:right">
                    <Button type="primary" icon="md-add" @click="creatUnit=true">新建投放单元</Button>
                    <!-- 新建投放单元弹框 -->
                    <Drawer v-model="creatUnit" width="800" :mask-closable="false">
                        <Creat v-if="creatUnit" @cancelCreateUnit="cancel" :title="title" @submitCreateUnit="ok"></Creat>
                    </Drawer>
                    </Col>
                </Row>
                <Table class="mt20" :loading="loading" :columns="unitData.columns" :data="unitData.data"></Table>
                <Page class="page-style" :total="total" :current="currentPage" show-elevator @on-change="changePage"></Page>
            </Card>
        </div>
    </div>
</template>

<script>
    /* eslint-disable vue/no-unused-components */
    import Detail from './details/Index.vue';
    import OperationUnit from '@/components/OperationUnit'; // 操作
    import Creat from './CreatUnit.vue';
    import EditInput from '@/components/EditInput.vue';

    export default {
        name: 'List',
        props: {},
        data() {
            return {
                creatUnit: false,
                line: 'line',
                total: 0,
                currentPage: 1,
                title: '新建投放单元',
                breadcrumb: [
                    '年货节-超级秒杀日，最低1折起',
                    '金卡会员活动期间满1000减80'
                ],
                returnList: {},
                unitName: '',
                loading: false,
                portrayal: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
                unitData: {
                    data: [
                        {
                            id: '1',
                            name: '金卡会员活动期间满1000减80',
                            crowd_name: '金卡会员',
                            crowd_count: '560901',
                            type: '单次通知',
                            type_val: '0',
                            start_date: '立即投放',
                            creater: '周树天',
                            channel_type: '短信',
                            state: '草稿',
                            marketingType: '0'
                        },
                        {
                            id: '2',
                            name: '银卡会员活动期间满500减30',
                            crowd_name: '银卡会员',
                            crowd_count: '679032',
                            type: '周期性通知',
                            type_val: '2',
                            start_date: '立即投放',
                            creater: '孙笑笑',
                            channel_type: '短信',
                            state: '待内审',
                            marketingType: '1'
                        },
                        {
                            id: '3',
                            name: '第3季度累计购物满2千抽腕表',
                            crowd_name: '普通会员',
                            crowd_count: '989224',
                            type: '日期通知',
                            type_val: '3',
                            start_date: '每月1日',
                            date: '2018-10-21  08:50',
                            creater: '张成立',
                            channel_type: '微信',
                            state: '待测试',
                            marketingType: '0'
                        },
                        {
                            id: '1',
                            name: '新用户关注公众号送20元优惠券',
                            crowd_name: '微信新用户',
                            crowd_count: '55922',
                            type: '事件响应',
                            type_val: '1',
                            start_date: '立即投放',
                            creater: '李晓晴',
                            channel_type: '微信',
                            state: '投放中',
                            marketingType: '0'
                        },
                        //    {
                        //        id: '5',
                        //        name: '新用户公众号首次下单送20元优惠券',
                        //        crowd_name: '公众号首次下单微信用户',
                        //        crowd_count: '98925',
                        //        type: '旅程通知',
                        //        type_val: '5',
                        //        start_date: '每月1日',
                        //        date: '2018-10-21  08:50',
                        //        creater: '张成立',
                        //        channel_type: '微信',
                        //        state: '待测试',
                        //        marketingType: '1'
                        //    },
                        //    {
                        //        id: '4',
                        //        name: '金卡会员刷卡满1千送品牌围巾',
                        //        crowd_name: '金卡会员刷卡满1千',
                        //        crowd_count: '559220',
                        //        type: '旅程响应',
                        //        type_val: '4',
                        //        start_date: '立即投放',
                        //        creater: '李晓晴',
                        //        channel_type: '微信',
                        //        state: '待外审',
                        //        marketingType: '0'
                        //    },
                        {
                            id: '1',
                            name: '金卡会员当月购物满2千抽大奖',
                            crowd_name: '刷卡满2千金卡会员',
                            crowd_count: '5800',
                            type: '事件响应',
                            type_val: '1',
                            start_date: '立即投放',
                            creater: '李晓晴',
                            channel_type: '微信',
                            state: '暂停中',
                            marketingType: '1'
                        },
                        {
                            id: '2',
                            name: '银卡会员当月购物满5次送50元券',
                            crowd_name: '刷卡满5次银卡会员',
                            crowd_count: '70922',
                            type: '周期性通知',
                            type_val: '2',
                            start_date: '每月1日',
                            date: '2018-10-21  08:50',
                            creater: '李晓晴',
                            channel_type: '短信',
                            state: '待开始',
                            marketingType: '0'
                        },
                        {
                            id: '0',
                            name: '普通会员购物满3免1',
                            crowd_name: '普通会员',
                            crowd_count: '90228',
                            type: '单次通知',
                            type_val: '0',
                            start_date: '立即投放',
                            creater: '李晓晴',
                            channel_type: '短信',
                            state: '已过期',
                            marketingType: '1'
                        }
                    ],
                    columns: [{
                                  title: '投放单元名称',
                                  key: 'name',
                                  ellipsis: true, // 超出省略
                                  tooltip: true
                              },
                              {
                                  title: '目标人群',
                                  key: 'crowd_name',
                                  ellipsis: true, // 超出省略
                                  tooltip: true
                              },
                              {
                                  title: '预估人数',
                                  key: 'crowd_count'
                              },
                              {
                                  title: '交互模式',
                                  // key: 'type',
                                  ellipsis: true, // 超出省略
                                  tooltip: true,
                                  width: 150,
                                  render: (h, params) => {
                                      const { marketingType } = params.row;
                                      let iconType = '';
                                      switch (marketingType) {
                                      case '0':
                                          iconType = 'md-notifications-outline';
                                          break;
                                      case '1':
                                          iconType = 'md-ribbon';
                                          break;
                                      default:
                                          break;
                                      }
                                      return h('div', [
                                          h('Icon', {
                                              style: {
                                                  color: '#19be6b',
                                                  padding: '0 5px',
                                                  fontSize: '16px'
                                              },
                                              props: {
                                                  type: iconType
                                              }
                                          }),
                                          h('span', params.row.type)
                                      ]);
                                  }
                              },
                              {
                                  title: '投放时间',
                                  // key: 'start_date',
                                  ellipsis: true, // 超出省略
                                  tooltip: true,
                                  width: 150,
                                  render: (h, params) => {
                                      const { start_date } = params.row;
                                      let iconType = '';
                                      let { date } = params.row;
                                      switch (start_date) {
                                      case '立即投放':
                                          iconType = 'ios-information-circle-outline';
                                          date = '活动时间内，审核通过后立即发送';
                                          break;
                                      case '每月1日':
                                          iconType = 'md-time';
                                          date = '2019年4月2日 9:00';
                                          break;
                                      default:
                                          break;
                                      }
                                      return h('Poptip', {
                                          props: {
                                              trigger: 'hover',
                                              placement: 'bottom'
                                          }
                                      }, [
                                          h('span', start_date),
                                          h('Icon', {
                                              style: {
                                                  color: '#19be6b',
                                                  padding: '0 4px',
                                                  fontSize: '16px'
                                              },
                                              props: {
                                                  type: iconType
                                              }
                                          }),
                                          h('div', {
                                              slot: 'content'
                                          }, [
                                              h('span', date)
                                          ])
                                      ]);
                                  }
                              },
                              {
                                  title: '创建人',
                                  key: 'creater',
                                  ellipsis: true, // 超出省略
                                  tooltip: true
                              },
                              {
                                  title: '投放渠道',
                                  key: 'channel_type',
                                  ellipsis: true, // 超出省略
                                  tooltip: true,
                                  render: (h, params) => {
                                      const channel_type = params.row.channel_type;
                                      let tip;
                                      switch (channel_type) {
                                      case '短信':
                                          tip = '亿美短信渠道';
                                          break;
                                      case '微信':
                                          tip = '微信小程序1';
                                          break;
                                      default:
                                          break;
                                      }
                                      return h('Poptip', {
                                          props: {
                                              trigger: 'hover',
                                              placement: 'bottom'
                                          }
                                      }, [
                                          h('span', channel_type),
                                          h('Icon', {
                                              style: {
                                                  color: '#19be6b',
                                                  padding: '0 4px'
                                              }
                                          }),
                                          h('div', {
                                              slot: 'content'
                                          }, [
                                              h('span', tip)
                                          ])
                                      ]);
                                  }
                              },
                              {
                                  title: '状态',
                                  // key: 'state',
                                  ellipsis: true, // 超出省略
                                  tooltip: true,
                                  render: (h, params) => h('div', [
                                      h('span', params.row.state)
                                  ])
                              },
                              {
                                  title: '操作',
                                  width: 120,
                                  render: (h, params) => h(OperationUnit, {
                                      props: {
                                          row: params.row
                                          // tabView: this.tabActive,
                                          // type: 'trait',
                                          // pageType: 'list'
                                      }
                                  })
                              }
                    ]
                },
                activityDetail: {
                    id: 'CM19011469',
                    creater: '李晓晴',
                    creatTime: '2019-01-12',
                    activityDate: ['2016-01-01', '2016-02-15'],
                    description: '年货节期间，任意一笔满399元订单均可参加年货节大转盘抽奖活动，有几率赢取1折大奖！'
                },
                state: [{
                            name: '预计触达',
                            value: '999,999'
                        }, {
                            name: '实际触达',
                            value: '856,566'
                        },
                        {
                            name: '触达失败',
                            value: '143,433'
                        }
                ],
                cityList: [{
                               value: 'New York',
                               label: 'New York'
                           },
                           {
                               value: 'London',
                               label: 'London'
                           },
                           {
                               value: 'Sydney',
                               label: 'Sydney'
                           },
                           {
                               value: 'Ottawa',
                               label: 'Ottawa'
                           },
                           {
                               value: 'Paris',
                               label: 'Paris'
                           },
                           {
                               value: 'Canberra',
                               label: 'Canberra'
                           }
                ],
                model1: '',
                defineEditShow: true,
                nameEditShow: true,
                formItem: {
                    name: '年货节-超级秒杀日，最低1折起',
                    description: '888'
                }
            };
        },
        computed: {},
        components: {
            Detail,
            OperationUnit,
            Creat,
            EditInput
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, timer); // 搜索
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                this.returnList = {
                    path: '/activity',
                    query: {
                    // tabView: this.$route.query.tabView
                    }
                };
            },
            // 新建投放单元
            // creatUnit() {
            //     // console.log(2222)
            //     this.creat_unit = true
            // },
            ok() {
                this.creatUnit = false;
            },
            searIconClick() {},
            cancel(value) {
                this.creatUnit = value;
            },
            // 切换分页
            changePage() {},
            // 取消修改
            cancelEdit() {
                this.nameEditShow = true;
                this.defineEditShow = true;
                this.$tools.bus.$emit('recovery-edit');
            },
            // 提交修改 验证名称/描述 内容
            confirmInfo(name, value) {
                if (name === 'name') {
                    if (value === '') {
                        this.$Message.destroy();
                        this.$Message.error('请输入名称');
                        this.nameEditShow = false;
                        // 待调试接口时完成
                        // this.formItem[name] = this.crowdListContent.name;
                        return;
                    }
                    // 待调试
                    //    else if( this.crowdListContent.name === value){
                    //        return;
                    //    }
                    if (!(this.$config.reg_input.reg.test(value))) {
                        this.$Message.destroy();
                        this.$Message.error('只支持中英文、数字、下划线，请正确填写');
                        return;
                    }
                    this.nameEditShow = true;
                    this.formItem[name] = value;
                // 待调试 请求数据
                // this.editContent()
                }
                if (name == 'description' && (this.formItem.description === value)) {
                    return;
                }
                this.defineEditShow = true;
                this.formItem[name] = value;
            // 下一步发起请求
            // this.editContent()
            },
            changeStatus(status, name) {
                this[name] = status;
            }
        },
        watch: {},
        destroyed() {}
    };
</script>

<style scoped lang="less">
    .detail-height {
        line-height: 40px
    }
    .border {
        border-bottom: 2px solid #EEEEEE
    }
    .ml-20 {
        margin-left: -20px
    }
    .ml60 {
        margin-left: 60px
    }
    .advertising-list {
        .details-title {
            height: 50px;
            padding: 0 16px;
            background: white;
            line-height: 50px;
            box-shadow: 0px 0px 1px #ccc;
            border: 1px solid #eee;
        }
        .line {
            border-right: 1px solid #e8eaec
        }
    }
</style>
