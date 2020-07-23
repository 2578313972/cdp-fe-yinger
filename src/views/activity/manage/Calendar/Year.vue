<template>
    <div class="year-calendar">
        <Row type="flex" justify="center" align="top" class="year-wrapper">
            <Col span="2" class="name-wrapper">
                <p class="title"></p>
                <Tooltip
                    :content="item.name"
                    :disabled="item.name.length<=10"
                    transfer
                    placement="right"
                    :max-width="200"
                    v-for="item in nameList"
                    :key="item.id">
                    <p class="name">{{ item.name }}</p>
                </Tooltip>
            </Col>
            <Col span="22" class="content-wrapper">
                <Row type="flex" justify="center" align="top" class="month">
                    <Col span="2" v-for="item in monthList" :key="item.val" class="content">
                        <span class="title">{{ item.label }}</span>
                        <div class="column">
                            <p v-for="num in nameList.length" :key="num" class="row">
                                <template v-if="nameList[num-1]">
                                   <span
                                        v-for="date in dateList[item.val-1]"
                                        class="cell hand"
                                        :key="date"
                                        :style="{width: `${100/dateList[item.val-1]}%`}"
                                        :class="`${getDate(item.val, date) ? nameList[num-1]['type']: ''}`"
                                        @click="jumpToPage(item)"></span>
                                </template>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        name: 'YearCalendar',
        data() {
            return {
                period: ['7.10', '12.16'],
                nameList: [
                    {
                        id: 0,
                        type: 'all',
                        name: '建行招新活动建行招新活动建行招新活动唬得'
                    }, {
                        id: 1,
                        type: 'process',
                        name: '建行招新活动'
                    }, {
                        id: 2,
                        type: 'finish',
                        name: '建行招新活动'
                    }
                ],
                currentYear: '2019',
                dateList: [],
                monthList: [
                    {
                        val: '1',
                        label: '一月'
                    }, {
                        val: '2',
                        label: '二月'
                    }, {
                        val: '3',
                        label: '三月'
                    }, {
                        val: '4',
                        label: '四月'
                    }, {
                        val: '5',
                        label: '五月'
                    }, {
                        val: '6',
                        label: '六月'
                    }, {
                        val: '7',
                        label: '七月'
                    }, {
                        val: '8',
                        label: '八月'
                    }, {
                        val: '9',
                        label: '九月'
                    }, {
                        val: '10',
                        label: '十月'
                    }, {
                        val: '11',
                        label: '十一月'
                    }, {
                        val: '12',
                        label: '十二月'
                    }
                ]
            };
        },
        created() {
            for (let i = 1; i <= 12; i++) {
                this.dateList.push(new Date(this.currentYear, i, 0).getDate());
            }
        },
        methods: {
            getDate(month, date) {
                return new Date(`${month}.${date}`).getTime() >= new Date(`${this.period[0]}`).getTime() && new Date(`${month}.${date}`).getTime() < new Date(`${this.period[1]}`).getTime();
            },
            jumpToPage() {

            }
        }
    };
</script>
<style lang="less" scoped>
.year-calendar {
    padding-top: 16px;
    .year-wrapper {
        .name-wrapper {
            .title {
                height: 22px;;
            }
            .name {
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                line-height: 20px;
            }
        }
        .content-wrapper {
            .month {
                border-right: 1px solid #dcdee2;
                .content {
                    border: 1px solid #dcdee2;
                    border-right: none;
                    text-align: center;
                    .column {
                        border-top: 1px solid #dcdee2;
                        min-height: 300px;
                        .row {

                        }
                        .cell {
                            padding: 1px 0;
                            display: inline-block;
                            height: 20px;
                        }
                        .hand {
                            cursor: pointer;
                        }
                        .all {
                            background: #000
                        }
                        .pre {
                            background: #ff9900;
                        }
                        .process {
                            background: #008cf8;
                        }
                        .finish {
                            background: #808695;
                        }
                    }
                }
            }
        }
    }
}
</style>
