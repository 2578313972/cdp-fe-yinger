<template>
    <div class="activity-list">
        <Table class="mt20" :loading="loading" :columns="activityData.columns" :data="activityData.data"></Table>
        <Page class="page-style" :total="total" :current="currentPage" show-elevator @on-change="pageChange"></Page>
    </div>
</template>
<script>
    export default {
        name: 'ActivityList',
        data() {
            return {
                total: 0,
                currentPage: 1,
                loading: false,
                activityData: {
                    data: [{
                               id: '1901',
                               name: '年货节-超级秒杀日，最低1折起',
                               time: '2019-01-13 至 2019-01-31',
                               send: 1,
                               creater: '李晓晴',
                               state: 'finished',
                               description: '年货节期间，任意一笔满399元订单均可参加年货节大转盘抽奖活动，有几率赢取1折大奖！'
                           },
                           {
                               id: '1902',
                               name: '新装抢鲜，呼气春天，春装全面上市',
                               time: '2019-02-13 至 2019-03-31',
                               send: 1,
                               creater: '李晓晴',
                               state: 'finished'
                           },
                           {
                               id: '1903',
                               name: '四月踏青，魅力出行，缤纷春季购物节',
                               time: '2019-04-11 至 2019-04-31',
                               send: 1,
                               creater: '周树天',
                               state: 'finished'
                           },
                           {
                               id: '1904',
                               name: '五一钜惠，全场满立减，满包邮，满500送20',
                               time: '2019-05-01 至 2019-01-31',
                               send: 1,
                               creater: '李晓晴',
                               state: 'finished'
                           },
                           {
                               id: '1905',
                               name: '十周年庆，年中放价，全场满618减60',
                               time: '2019-06-11 至 2019-06-31',
                               send: 1,
                               creater: '周树天',
                               state: 'finished'
                           },
                           {
                               id: '1906',
                               name: '夏季初登场，购物送好礼',
                               time: '2019-07-01 至 2019-07-31',
                               send: 1,
                               creater: '孙笑笑',
                               state: 'finished'
                           },
                           {
                               id: '1907',
                               name: '仲夏大行动，全场9折起，满150再返20',
                               time: '2019-08-01 至 2019-08-31',
                               send: 1,
                               creater: '周树天',
                               state: 'finished'
                           },
                           {
                               id: '1908',
                               name: '开学季-领跑新学期，开学装备特惠专场',
                               time: '2019-09-01 至 2019-09-31',
                               send: 1,
                               creater: '孙笑笑',
                               state: 'finished'
                           },
                           {
                               id: '1909',
                               name: '尽享意外惊喜“国庆购物不花钱”',
                               time: '2019-10-01 至 2019-10-31',
                               send: 1,
                               creater: '周树天',
                               state: 'finished'
                           },
                           {
                               id: '1910',
                               name: '庆圣诞迎元旦 精选商品7折起 满400包邮',
                               time: '2019-12-20 至 2019-12-31',
                               send: 2,
                               creater: '孙笑笑',
                               state: 'finished'
                           }
                    ],
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
                                              'word-wrap': true,
                                              width: '300'
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
                                  title: '状态',
                                  key: 'state',
                                  width: 140
                              },
                              {
                                  title: '投放单元',
                                  key: 'send',
                                  width: 140
                              },
                              {
                                  title: '创建人',
                                  key: 'creater',
                                  ellipsis: true, // 超出省略
                                  tooltip: true,
                                  width: 140
                              },
                              {
                                  title: '操作',
                                  align: 'center',
                                  width: 150,
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
                              }]
                }

            };
        },
        methods: {
            // 切换分页
            pageChange() {

            },
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
            }
        }
    };
</script>
<style scoped>
.activity-list {

}
</style>
