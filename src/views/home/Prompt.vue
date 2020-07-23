<template>
    <div class="mask-bg">
        <edit-title :is-show-btn="false" title="消息列表"></edit-title>
        <div class="custom-dialog-content">
            <div>
                <div class="message-main">
                    <Row class="message-title">
                        <Col span="12" class="view-btn">
                            <span v-for="(item, index) in titleList" :key="index" :class="{'selected': item.isClick}" @click="debounceClick(item.key)">{{item.name}}</span>
                        </Col>
                        <Col span="12" class="set-btn">
                            <span @click="setAllRead" :class="{'not-allread': !unread}">全部标为已读</span>
                        </Col>
                    </Row>
                    <template>
                        <template v-if="msgNum">
                            <div class="message-list"
                                v-for="(item,index) in list"
                                :key="index"
                                @click="viewDetails(item, index)">
                                <div class="message-box content-title">
                                    <p class="message-left" :class="{'unread-status': !item.read_status}">
                                        <i v-if="!item.read_status">•</i>
                                        <span>{{item.message_title}}</span>
                                    </p>
                                    <p class="message-right">{{item.create_time | timeLize}}</p>
                                </div>
                                <div class="message-box">
                                    <p :class="{'message-left': !item.isShow}">{{item.content}}</p>
                                </div>
                            </div>
                        </template>
                        <div v-else class="no-message">
                            {{loadingOrNoData}}
                        </div>
                    </template>
                </div>
                <p class="scroll-tip" @click="handleReachBottom" :class="{'is-no-msg': isNoMsg}">{{scrollTip}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        name: 'Prompt',
        components: {
            editTitle
        },
        props: {
            unread: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                pageNo: 1,
                loadingOrNoData: '数据加载中...',
                list: [],
                msgNum: 0,
                isNoMsg: false,
                scrollTip: '',
                titleList: [{
                    name: '全部',
                    key: 'all',
                    isClick: true
                }, {
                    name: '未读',
                    key: 'unread',
                    isClick: false
                }, {
                    name: '已读',
                    key: 'read',
                    isClick: false
                }],
                currentTab: 'all'
            };
        },
        created() {
            this.getList();
            this.debounceClick = this.$lodash.debounce(this.handleClick, this.$config.debounce_wait);
        },
        methods: {
            // 全部/已读/未读
            handleClick(key) {
                this.currentTab = key;
                this.pageNo = 1;
                this.titleList.forEach((item) => {
                    if (key !== item.key) {
                        item.isClick = false;
                    } else {
                        item.isClick = true;
                        this.getList();
                    }
                });
            },
            // 一键已读
            setAllRead() {
                if (this.unread) {
                    const url = `${this.$config.apiDomain}/sys/messages/read/all`;
                    this.$axios
                        .put(url)
                        .then(() => {
                            this.getList();
                            this.$emit('get-unread-msg');
                        });
                }
            },
            // 数据处理
            dealData(data, pageNo) {
                if (data && data.items) {
                    if (pageNo === 1) {
                        this.list = data.items;
                    } else {
                        data.items.forEach((i) => {
                            this.list.push(i);
                        });
                    }
                    this.msgNum = this.list.length;
                    if (!this.msgNum) {
                        this.loadingOrNoData = '暂无数据';
                    }
                }
                if (data.total <= pageNo * 10) {
                    this.scrollTip = '';
                    this.isNoMsg = true;
                } else {
                    this.scrollTip = '点击加载更多信息';
                    this.isNoMsg = false;
                }
            },
            // 获取站内信列表请求
            getList(isLoad, pageNo = 1) {
                this.loadingOrNoData = '数据加载中...';
                const url = `${this.$config.apiDomain}/sys/messages/list/${this.currentTab}`;
                const params = {
                    page: pageNo,
                    size: 10
                };

                this.$axios
                    .get(url, {
                        params
                    })
                    .then(({ data }) => {
                        this.dealData(data, pageNo);
                    })
                    .catch(() => {
                        this.loadingOrNoData = '数据加载失败';
                        if (isLoad && pageNo <= this.pageNo) {
                            this.pageNo--;
                        }
                    });
            },
            // 设置为已读态请求
            setReadStatus(item) {
                const { message_id } = item;
                const url = `${this.$config.apiDomain}/sys/messages/read/message-list`;
                const params = [message_id];
                this.$axios
                    .put(url, params)
                    .then(() => {
                        // read_status: 0(未读)/1(已读)
                        this.$set(item, 'read_status', 1);
                    });
            },
            // 点击消息
            viewDetails(item) {
                const { read_status } = item;
                if (!read_status) {
                    this.setReadStatus(item);
                    this.$emit('get-unread-msg');
                }
                if (!item.isShow) {
                    this.$set(item, 'isShow', true);
                } else {
                    this.$set(item, 'isShow', !item.isShow);
                }
            },
            // 底部加载
            handleReachBottom() {
                if (!this.isNoMsg) {
                    this.pageNo++;
                    this.getList(true, this.pageNo);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.mask-bg {
    .custom-dialog-content {
        padding-bottom: 24px;
        .scroll-tip {
            text-align: center;
            font-size: 14px;
            color: grey;
            letter-spacing: 2px;
            cursor: pointer;
        }
        .is-no-msg {
            cursor: auto;
        }
        .message-main {
            margin:24px;
            background: #fff;
            padding: 0 24px;
            box-shadow: 0 0 5px #dcdee2;
            border-radius: 5px;
            color: #17233D;
            .message-title {
                border-bottom: 1px #e8eaec solid;
                padding: 16px 0;
                font-size: 14px;
                .title {
                    font-size: 16px;
                }
                .view-btn {
                    span {
                        cursor: pointer;
                        border-right: 1px solid rgba(23,35,61,0.15);
                        padding: 0 6px;
                        &:last-child {
                            border: none;
                        }
                        &:first-child {
                            padding-left: 0;
                        }
                    }
                }
                .set-btn {
                    color: #2185F0;
                    text-align: right;
                    span {
                        cursor: pointer;
                    }
                    .not-allread {
                        color: #ccc;
                        cursor: default;
                    }
                }
            }
            .selected {
                color: #2185F0;
            }
            .message-list {
                border-bottom: 1px #e8eaec solid;
                padding-bottom: 16px;
                cursor: pointer;
                .content-title {
                    margin: 6px 0;
                    height:40px;
                    line-height:40px
                }
                .message-box{
                    display: flex;
                    font-size: 14px;
                    .message-left{
                        flex: 1;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        i{
                            color: #2185F0;
                            font-size: 22px;
                            padding-right: 4px;
                        }
                        span{
                            color:#17233D;
                            font-size: 14px;
                            line-height: 40px;
                        }
                    }
                    .message-right {
                        min-width: 60px;
                        font-size: 14px;
                        text-align: right;
                    }
                }
            }
            .unread-status {
                font-weight: bold;
            }
        }
        .no-message {
            padding: 50px 0;
            font-size: 14px;
            text-align: center;
            color: grey;
            letter-spacing: 2px;
        }
    }
}
</style>
