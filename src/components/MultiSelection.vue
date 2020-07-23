<template>
    <div class="checked-box">
        <Cascader :data="listData" @on-change="handleChange" @on-visible-change="onOff" change-on-select transfer>
            <div class="checked-tag ivu-select ivu-select-single ivu-select-default" :class="{'ivu-select-visible':isShow}">
                <p v-if="!checkedItemList.length" class="choose">请选择</p>
                <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
                <!-- 选中的小标签 -->
                <template v-if="checkedList.length">
                    <Tag
                        v-for="(item,index) in checkedItemList"
                        :key="index"
                        closable
                        :fade="false"
                        @on-close="tagClose(index)">
                        {{item.label}}
                    </Tag>
                </template>

            </div>
        </Cascader>
    </div>
</template>

<script>
    const _findItemDeep = (items, value) => {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.value == value) {
                return [item];
            } if (!!item.children && !!item.children.length) {
                const childItem = _findItemDeep(item.children, value);
                if (!!childItem && !!childItem.length) {
                    return [item, ...childItem];
                }
            }
        }
        return null;
    };

    export default {
        props: {
            listData: {
                type: Array,
                default: () => []
            },
            multiple: {
                type: Boolean,
                default: false
            },
            checkedList: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            checkedItemList() {
                const result = [];
                const _ = this.$lodash;

                for (let index = 0; index < this.checkedList.length; index++) {
                    const itemDeep = _findItemDeep(this.listData, this.checkedList[index].value);
                    if (itemDeep && itemDeep.length) {
                        const item = {
                            label: _.chain(itemDeep).map(item => item.label).join('/').value(),
                            value: _.last(itemDeep).value
                        };
                        if (item) {
                            result.push(item);
                        }
                    }
                }
                return result;
            }
        },
        data() {
            return {
                isShow: false
            /* list: [
                    {
                        value: 'beijing',
                        label: '北京',
                        children: [
                            {
                                value: 'gugong',
                                label: '故宫'
                            },
                            {
                                value: 'tiantan',
                                label: '天坛'
                            },
                            {
                                value: 'wangfujing',
                                label: '王府井'
                            }
                        ]
                    },
                    {
                        value: 'jiangsu',
                        label: '江苏',
                        children: [
                            {
                                value: 'nanjing',
                                label: '南京',
                                children: [
                                    {
                                        value: 'fuzimiao',
                                        label: '夫子庙',
                                    }
                                ]
                            },
                            {
                                value: 'suzhou',
                                label: '苏州',
                                children: [
                                    {
                                        value: 'zhuozhengyuan',
                                        label: '拙政园',
                                    },
                                    {
                                        value: 'shizilin',
                                        label: '狮子林',
                                    }
                                ]
                            }
                        ]
                    }
                ] */
            // checkedList:[]   //选中的数组
            };
        },
        methods: {

            handleChange(value, selectedData) {
                const curLabel = selectedData.map(o => o.label).join('/'); // 名称
                const curVal = value.pop(); // id
                const curTag = {
                    label: curLabel, // 名称
                    value: curVal // id
                };
                const len = this.$lodash.filter(this.checkedList, i => i.value === curVal);
                if (!len[0]) {
                    // 添加
                    let checkedList = this.$lodash.cloneDeep(this.checkedList);
                    if (this.multiple) {
                        checkedList.push(curTag);
                    } else {
                        checkedList = [curTag];
                    }
                    this.$emit('handleChange', checkedList);
                }
            },

            onOff(isShow) {
                this.isShow = isShow;
            },

            // 关闭小标签
            tagClose(index) {
                const checkedList = this.$lodash.cloneDeep(this.checkedList);
                checkedList.splice(index, 1);
                this.$emit('handleChange', checkedList);
            }

        },
        mounted() {}
    };
</script>

<style scoped lang="less">
    .checked-box{
        vertical-align: middle;
        min-width:200px;
        // max-width:400px;
        min-height:32px;
        // line-height: 32px;
        border:1px solid #dcdee2;
        // box-shadow:0 0 3px #e8eaec;
        border-radius:4px;
        background:#fff;
        overflow:hidden;
        .checked-tag{
            position: relative;
            width: 100%;
            height: 100%;
            padding:0px 24px 2px 6px;
            line-height: 28px;
            vertical-align: middle;
            .choose{
                line-height: 28px;
                text-indent: 2px;
                color: #c5c8ce;
                font-size: 12px;
                float: left;
            }
        }
    }
</style>
