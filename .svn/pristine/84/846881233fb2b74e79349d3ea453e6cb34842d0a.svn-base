<template>
    <div class="container-padding10 activity-management">
        <Card dis-hover>
            <Tabs>
                <TabPane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.name1"></TabPane>
            </Tabs>
            <Row class="text-align-c">
                <Col span="8" v-for="(item,index) in state" :key="index">
                <strong class="f20 color-blue">{{item.value}}</strong>
                <p class="pt10">{{item.name}}</p>
                </Col>
            </Row>
        </Card>
        <Card dis-hover class="mt10">
            <Row  >
                <Col span='6'>
                <ButtonGroup>
                    <Button v-for="(item,index) in buttonList" :key="index" :type="item.key==buttonActive?'primary':'default'" @click="debounceStatus(item.key)">
                        {{item.value}}
                        </Button>
                </ButtonGroup>
                </Col>
                <Col span='6'>
                <DatePicker type="daterange" placement="bottom-end" placeholder="请选择活动时间" class="width300" :value="dateValue">
                </DatePicker>
                </Col>
                <Col span="7">
                <Input class="dependant-search ml10 " @keyup.native.enter="debounceSearch" @on-change="debounceSearch" v-model="crowdName" placeholder="请输入活动名称" icon="ios-search"></Input>
                </Col>
                <Col span="3" offset="2" style="text-align:right" >
                <Button type="primary" icon="md-add" @click="creatActivity">新建营销活动</Button>
                </Col>
                <!-- 新建营销活动弹框 -->
                <Drawer v-model="activityCreat" width="800" :mask-closable="false">
                    <Creat v-if="activityCreat" @cancelCreateAcivity="cancel" @commitCreateAcivity="ok"></Creat>
                </Drawer>
            </Row>
            <Table class="mt20" :loading="loading" :columns="columns" :data="activityData"></Table>
            <Page class="page-style" :total="total" :current="currentPage" show-elevator @on-change="changePage"></Page>
        </Card>
    </div>
</template>

<script>
    import Creat from '@/views/activity/manage/CreatActivity';

    export default {
        data() {
            return {
                dateValue: ['2019-01-01', '2019-02-01'],
                crowdName: '',
                total: 0,
                currentPage: 1,
                loading: false,
                activityCreat: false,
                tabList: [{
                              name: 'name1',
                              label: '我的'
                          },
                          {
                              name: 'name2',
                              label: '运营组的'
                          },
                          {
                              name: 'name3',
                              label: '下级的'
                          }
                ],
                state: this.$activity.state,
                columns: [{
                              title: '活动名称',
                              key: 'name',
                              ellipsis: true, // 超出省略
                              tooltip: true,
                              render: (h, params) => {
                                  const name = params.row.name;
                                  const des = params.row.description || name;
                                  return h('Poptip', {
                                      props: {
                                          trigger: 'hover',
                                          placement: 'right-start',
                                          'word-wrap': true

                                      },
                                      style: {
                                          width: '300px'
                                      }
                                  }, [
                                      h('span', name),
                                      h('Icon', {
                                          style: {
                                              color: '#19be6b',
                                              padding: '0 4px'
                                          }
                                      }),
                                      h('div', {
                                          slot: 'content'
                                      }, [
                                          h('span', des)
                                      ])
                                  ]);
                              }
                          },
                          {
                              title: '起止时间',
                              key: 'time',
                              ellipsis: true, // 超出省略
                              tooltip: true
                              // width: 250,
                          },
                          {
                              title: '投放单元',
                              key: 'send',
                              width: 180
                          },
                          {
                              title: '创建人',
                              key: 'creater',
                              ellipsis: true, // 超出省略
                              tooltip: true,
                              width: 180
                          },
                          {
                              title: '操作',
                              align: 'center',
                              width: 180,
                              render: (h, params) => h('div', [h('a', {
                                                                   on: {
                                                                       click: () => {
                                                                           this.openDetails(params.index, params.row);
                                                                       }
                                                                   }
                                                               }, '详情'),
                                                               h('a', {
                                                                   style: {
                                                                       padding: '0 8px'
                                                                   },
                                                                   on: {
                                                                       click: () => {
                                                                           // this.downloadButton(params.index, params.row)
                                                                       }
                                                                   }
                                                               }, '修改'),
                                                               h('a', {
                                                                   on: {
                                                                       click: () => {
                                                                           // this.downloadButton(params.index, params.row)
                                                                       }
                                                                   }
                                                               }, '删除')
                              ])
                          }
                ],
                activityData: this.$activity.activityList,
                buttonList: [{
                                 value: '全部',
                                 key: 'all'
                             },
                             {
                                 value: '待开始',
                                 key: 'waiting_start'
                             },
                             {
                                 value: '进行中',
                                 key: 'underway'
                             },
                             {
                                 value: '已结束',
                                 key: 'finished'
                             }
                ],
                buttonActive: 'all'
            };
        },
        methods: {
            initData() {},
            // 打开详情
            openDetails(index, row) {
                this.$router.push({
                    path: '/activity/list',
                    query: {
                        name: 'detail',
                        id: row.id
                    // tabView: row.visibility,
                    }
                });
            },
            activeFn(status) {
                this.buttonActive = status;
            },
            // 搜索
            searIconClick() {
            // this.current_page=1
            // this.changeCrowdList(this.crowd_id)
            },
            // 切换分页
            changePage() {},
            creatActivity() {
                this.activityCreat = true;
            },
            // 取消创建
            cancel(value) {
                this.activityCreat = value;
            },
            ok() {
                this.activityCreat = false;
            }
        },
        computed: {},
        watch: {},
        components: {
            Creat
        },
        mounted() {
            this.initData();
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceStatus = this.$lodash.debounce(this.activeFn, timer); // 切换状态
            this.debounceSearch = this.$lodash.debounce(this.searIconClick, timer); // 搜索
        }
    };
</script>

<style scoped lang="less">
</style>
