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
                <Row class="detail-height">
                    <Col span="2">
                    <p>活动ID：</p>
                    </Col>
                    <Col span="4" class="ml-20">
                    <p>{{activityDetail.id}}</p>
                    </Col>
                    <Col span="2">
                    <p>创建人：</p>
                    </Col>
                    <Col span="4" class="ml-20">
                    <p>{{activityDetail.creater}}</p>
                    </Col>
                    <Col span="2">
                    <p>创建时间：</p>
                    </Col>
                    <Col span="4" class="ml-20">
                    <p> {{activityDetail.creat_time}}</p>
                    </Col>
                    <Col span="2">
                    <p>活动起止时间：</p>
                    </Col>
                    <Col span="4">
                    <p>{{activityDetail.activity_date}}</p>
                    </Col>
                </Row>
                <Row class="detail-height">
                    <Col span="2"> <span>活动简介：</span> </Col>
                    <Col span="20" class="ml-20"><span>{{activityDetail.description}}</span></Col>
                </Row>
            </Card>
            <Card class="m10" dis-hover>
                <div class="bottom-style">
                    <div style="background:#FFFFCC;"></div>
                    <div style="background:#CCFFFF"></div>
                    <div style="background:#CCFFCC"></div>
                    <Row class="top-style">
                        <Col span="15">
                        <div :style="{background: '#FFCC00', width: 100+'%'}"></div>
                        <div :style="{background: '#3399FF', width: plan_number+'%'}"></div>
                        <div :style="{background: '#00CC66', width: actual_number+'%'}"></div>
                        </Col>
                        <Col span="9">
                        <div class=" total-count line-h30">
                            <span class="ml40">目标触达：<i>{{(putPlan.target).toLocaleString()}}</i>人</span>
                        </div>
                        <div class="total-count line-h30">
                            <span class="ml40">计划投放：<i>{{(putPlan.plan).toLocaleString()}}</i>人</span>
                            <span class="ml60">计划投放率：<i>{{plan_number}}%</i></span>
                        </div>
                        <div class="total-count line-h30">
                            <span class="ml40">实际触达：<i>{{(putPlan.actual).toLocaleString()}}</i>人</span>
                            <Icon type="md-arrow-dropdown" size="26" class="ml60" style="position:relative;top:-17px;left:24px" />
                            <span style="margin-left:-36px"> 实际触达率：<i>{{touch_rate}}%</i></span>
                        </div>
                        </Col>
                    </Row>
                </div>
            </Card>
            <Card class="m10" dis-hover>
                <Row class="mt10" style="margin-left:-10px">
                    <Col span="13">
                    <span class="total-count">共<i>55</i>个投放单元：</span>
                    <span class="total-count">共<i>3</i>个待开始</span>
                    <span class="total-count">共<i>7</i>个进行中</span>
                    <span class="total-count">共<i>1</i>个暂停中</span>
                    <span class="total-count">共<i>19</i>个已结束</span>
                    <span class="total-count">共<i>1</i>个已过期</span>
                    </Col>
                    <Col span="8">
                    <Input class="dependant-search ml10 " @keyup.native.enter="debounceSearch" @on-change="debounceSearch" v-model="unitName" placeholder="请输入投放单元名称" icon="ios-search"></Input>
                    </Col>
                    <Col span="3" style="text-align:right">
                    <Button type="primary" icon="md-add" @click="creatUnit">新建投放单元</Button>
                    <!-- 新建投放单元弹框 -->
                    <Drawer v-model="unitCreat" width="800" :mask-closable="false">
                        <Creat v-if="unitCreat" @cancelCreateUnit="cancel" :title="title" @submitCreateUnit="ok"></Creat>
                    </Drawer>
                    </Col>
                </Row>
                <Table class="mt20" :loading="loading" :columns="columns" :data="unitData"></Table>
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

    export default {
        name: 'List',
        props: {},
        data() {
            return {
                total: 0,
                currentPage: 1,
                title: '新建投放单元',
                process: this.$activity.process,
                putPlan: this.$activity.put_plan,
                breadcrumb: this.$activity.breadcrumb,
                returnList: {},
                unitName: '',
                loading: false,
                unitCreat: false,
                portrayal: ['City', 'People', 'Cost', 'Life', 'Entertainment'],
                columns: [{
                              title: '投放单元名称',
                              key: 'name',
                              ellipsis: true, // 超出省略
                              tooltip: true
                          },
                          {
                              title: '投放人群',
                              key: 'crowd_name',
                              ellipsis: true, // 超出省略
                              tooltip: true
                          },
                          {
                              title: '目标人数',
                              key: 'crowd_count'
                          },
                          {
                              title: '交互类型',
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
                              title: '开始时间',
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
                              render: (h, params) => {
                                  const state_type = params.row.state;
                                  return h('div', [
                                      h('span', state_type)
                                  ]);
                              }
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
                ],
                unitData: this.$activity.unitList,
                activityDetail: this.$activity.activity_detail,
                putUnit: this.$activity.put_unit
            };
        },
        computed: {
            plan_number() {
                const target = parseFloat(this.putPlan.target);
                const plan = parseFloat(this.putPlan.plan);
                return parseInt((plan / target) * 100);
            },
            actual_number() {
                const target = parseFloat(this.putPlan.target);
                const actual = parseFloat(this.putPlan.actual);
                return parseInt((actual / target) * 100);
            },
            touch_rate() {
                const plan = parseFloat(this.putPlan.plan);
                const actual = parseFloat(this.putPlan.actual);
                return parseInt((actual / plan) * 100);
            }
        },
        components: {
            Detail,
            OperationUnit,
            Creat
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
            creatUnit() {
                // console.log(2222)
                this.unitCreat = true;
            },
            ok() {
                this.unitCreat = false;
            },
            searIconClick() {},
            cancel(value) {
                this.unitCreat = value;
            },
            // 切换分页
            changePage() {}
        },
        watch: {},
        destroyed() {}
    };
</script>

<style scoped lang="less">
    .detail-height {
        //    height:34px;
        line-height: 34px
    }
    .border {
        border-bottom: 2px solid #EEEEEE
    }
    .ml-20 {
        margin-left: -20px
    }
    .line-h30 {
        line-height: 30px
    }
    .ml40 {
        margin-left: 40px
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
        table {
            // width: 70%;
            tr {
                height: 44px; //   line-height: 44px
            }
            tr td:nth-child(1) {
                min-width: 50px;
                text-align: left;
                padding-left: 10px;
                font-weight: 600;
            }
            tr td:nth-child(2) {
                min-width: 80px;
                text-align: left;
                padding-left: 10px;
            }
            tr td:nth-child(3) {
                min-width: 50px;
                text-align: left;
                padding-left: 10px;
                font-weight: 600;
            }
            tr td:nth-child(4) {
                min-width: 50px;
                text-align: left;
                padding-left: 10px;
            }
        }
        ;
        .bottom-style {
            width: 100%;
            position: relative;
            div {
                height: 36px; // .border
            }
            .top-style {
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
</style>
