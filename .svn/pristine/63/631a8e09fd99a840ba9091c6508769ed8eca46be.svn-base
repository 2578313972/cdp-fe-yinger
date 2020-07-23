<template>
    <div class="button-select-box">
        <div class="button-select">
            <Select v-model="tagIdList" label-in-value @on-change="onSelectChange" :multiple="multiple">
                <Option v-for="item in dataList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
        </div>
        <div class="mt16" v-if="isShowTag && tagValueList.length">
            <Tag class="mtb5 select-tag-list" v-for="(data,y) in tagValueList" :key="y" :name="data.value" closable @on-close="closeTag(y)">{{data.label}}</Tag>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ButtonSelect',
        data() {
            return {
                tagValueList: [],
                tagIdList: ''
            };
        },
        props: {
            multiple: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            isShowTag: {
                type: Boolean,
                default: true
            },
            btnText: {
                type: String,
                default: '请选择'
            },
            count: {
                type: [Number, String],
                default: Infinity
            },
            tagList: {
                type: [Array, Object],
                default() {
                    return [];
                }
            },
            dataList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        mounted() {
            const getAllBtnSelect = document.querySelectorAll('.button-select-box .ivu-select-selection>div');
            getAllBtnSelect.forEach((element) => {
                element.innerHTML = (`<button${this.disabled ? ' disabled' : ''} type="button" class="ivu-btn ivu-btn-default"> <i class="ivu-icon ivu-icon-md-add"></i> <span>${this.btnText}</span></button>`);
            });
        },
        methods: {
            // 添加特性到Tag
            onSelectChange(value) {
                if (this.multiple) {
                    if (value.length > this.count) {
                        value.pop();
                        this.tagValueList = value;
                        this.$Message.destroy();
                        this.$Message.error(`最多添加${this.count}个`);
                    }
                    this.tagValueList = value;
                } else {
                    // 单选时，this.tagIdList = ''; 清空赋值的时候会调用on-change事件
                    if (value) {
                        this.tagValueList = [value];
                    }
                    return;
                }
                this.$emit('on-select-change', value);
            },
            setValue() {
                if (this.multiple) {
                    this.tagIdList = this.tagValueList.map(item => item.value);
                } else if (this.tagValueList[0]) {
                    this.tagIdList = this.tagValueList[0].value;
                }
            },
            // 删除特性Taglist
            closeTag(_index) {
                this.tagValueList.splice(_index, 1);
                if (!this.multiple) {
                    this.tagIdList = '';
                }
            }
        },
        watch: {
            tagList: {
                handler() {
                    this.tagValueList = this.tagList;
                },
                immediate: true
            },
            tagValueList: {
                handler() {
                    this.setValue();
                },
                immediate: true
            }
        }
    };
</script>

<style lang='less'>
    .button-select-box {
        div.mtb5 {
            margin: 5px 10px 5px 0;
        }
        .button-select {
            display: inline-block;
            .ivu-select-selection {
                border: none;
                padding: 0;
            }
            .ivu-select .ivu-select-dropdown {
                min-width: 200px!important;
            }
            .ivu-select-visible .ivu-select-selection {
                box-shadow: none;
            }
            .inner-div {
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                color: #999;
            }
        }
    }
</style>
