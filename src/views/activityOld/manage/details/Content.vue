<template>
    <div class="advertise-content">
        <Card dis-hover>
            <p slot="title">文本内容</p>
            <Row>
                <Col span="15" class="edit-wrapper">
                    <div>
                        <Input
                            v-model="value"
                            type="textarea"
                            :autosize="{minRows: 7}"
                            :placeholder="$activity.content.defaultTip"/>
                        <Row class="btn-wrapper">
                            <Col span="12" @click.native="insertTrait">
                                <span>+ 插入特性</span>
                            </Col>
                            <Col span="12" @click.native="insertUrl">
                                <span>+ 插入链接</span>
                            </Col>
                        </Row>
                    </div>
                    <Row class="send">
                        <Col span="3" class="send-item">
                            <span>发送到手机</span>
                        </Col>
                        <Col span="18" class="send-item">
                            <Select v-model="userVal" filterable multiple>
                                <Option v-for="item in userList" :value="item.value" :key="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </Col>
                        <Col span="3" class="send-item">
                            <Button type="primary" :disabled="!(userVal.length) || !value.trim()" @click="send">发送</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span="9" class="view-wrapper">
                    <Card class="view-card" dis-hover>
                        <p slot="title">预览</p>
                        <p class="content">{{ mockValue }}</p>
                    </Card>
                    <p class="tip-wrapper">
                        <span>预计 {{ mockValue.length }} 个字， {{ Math.ceil(mockValue.length/70) }} 条短信
                            <Tooltip max-width="240" transfer content="插入的特性以8个字符（4个字）长度计算，实际字数可能会发生变化">
                                &nbsp;<i class="fa fa-question-circle-o f14"></i>
                            </Tooltip>
                        </span>
                    </p>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    /* eslint-disable vue/no-unused-components */
    import TraitInput from '@/components/strategy/TraitInput.vue';

    export default {
        name: 'Content',
        components: {
            TraitInput
        },
        computed: {
            traitVal() {
                return this.propsData.value;
            }
        },
        watch: {
            value() {
                console.log('value: ', this.value);
                if (this.value.length) {
                    this.mockValue = this.$activity.content.previewContent;
                } else {
                    this.mockValue = '';
                }
                console.log('mockValue: ', this.mockValue);
            }
        },
        data() {
            return {
                mockValue: '',
                url: '',
                value: '',
                userVal: '',
                userList: this.$activity.content.userList,
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
                }
            };
        },
        methods: {
            // 插入链接
            insertUrl() {
                this.$Modal.confirm({
                    render: h => h('Input', {
                        props: {
                            autofocus: true,
                            placeholder: '请输入链接'
                        },
                        on: {
                            input: (val) => {
                                this.url = val;
                            }
                        }
                    }),
                    width: 640,
                    title: '插入链接',
                    onOk: () => {
                        this.value += this.url;
                        this.url = '';
                    }
                });
            },
            // 插入特性
            insertTrait() {
                this.$Modal.confirm({
                    render: h => h(TraitInput, {
                        props: Object.assign(this.propsData, {
                            value: this.traitVal
                        }),
                        on: {
                            'on-change': (val) => {
                                this.propsData.value = val;
                            }
                        },
                        style: {
                            width: '100%'
                        }
                    }),
                    width: 640,
                    height: 600,
                    title: '插入特性',
                    onOk: () => {
                        this.value += `{${this.traitVal.names[0]}}`;
                        this.propsData.value = {};
                    }
                });
            },
            // 发送短信
            send() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定发送短信吗',
                    onOk: () => {
                        this.$Message.success({
                            content: '短信已发送',
                            duration: 5
                        });
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
.advertise-content {
    .edit-wrapper {
        padding-right: 16px;
        .btn-wrapper {
            .ivu-col {
                border: 1px dashed #dcdee2;
                border-radius: 0 0 4px 4px;
                border-top: none;
                text-align: center;
                cursor: pointer;
                &:first-child {
                    border-right: none;
                }
                &:hover {
                    color: #2d8cf0;
                }
                span {
                    font-size: 14px;
                    line-height: 30px;
                }
            }
        }
        .send {
            padding-top: 16px;
            line-height: 32px;
            .send-item {
                &:first-child {
                    font-size: 14px;
                }
                &:last-child {
                    text-align: right;
                }
            }
        }
    }
    .view-wrapper {
        .view-card {
            min-height: 186px;
            margin-bottom: 16px;
            .content {
                white-space: pre-wrap;
            }
        }
    }
}
</style>
