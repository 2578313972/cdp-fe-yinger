<template>
    <div class="edit-input" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <div class="edit-input-content">
            <template>
                <FormItem :prop="formProp" :label="label" :style="{width: !isText && '80%'}" :class="{'text': isText && editShow}">
                    <div v-if="isText" class="table-edit clearfix">
                        <span class="edit-input-label" v-show="editShow" v-if="currentValue">{{currentValue}}</span>
                        <span class="edit-input-label edit-input-empty" v-show="editShow" v-if="currentValue == ''">{{emptyLabel}}</span>
                        <Input v-show="!editShow"
                            :value="currentValue"
                            @input="change"
                            :placeholder="defaultPlaceholder"
                            :maxlength="maxLength"
                            :style="{width: width}"
                            :type="textarea"
                            :autosize="sizeObj"/>
                    </div>
                    <Input v-else
                        style="width: 100%"
                        :readonly="editShow"
                        :value="currentValue"
                        @input="change"
                        :placeholder="defaultPlaceholder"
                        :type="textarea"
                        :autosize="sizeObj"
                        :maxlength="maxLength"/>
                </FormItem>
            </template>
            <span class="edit-input-btn">
                <Tooltip class="id-tip" :disabled="!tipContent" :content="tipContent" placement="top" transfer>
                    <span v-show="isShowTip" class="iconfont icon-action_help_outline"></span>
                </Tooltip>
                <span class="icon" v-if="showIconSpecial && isShowIcon">
                    <span class="iconfont icon-content_create edit" v-if="editShow && mouseIn" @click="edit"></span>
                    <span class="iconfont icon-nav_check confirm" v-if="!editShow" @click="confirm"></span>
                    <span class="iconfont icon-nav_close cancel" v-if="!editShow" @click="cancel"></span>
                </span>
            </span>
        </div>
    </div>
</template>
<script>
    import roleMixin from '@/mixin/role-mixin';

    export default {
        name: 'EditInput',
        mixins: [roleMixin],
        props: {
            label: {
                type: String
            },
            labelName: {
                type: String
            },
            formProp: {
                type: String
            },
            isShowTip: {
                type: Boolean,
                default: false
            },
            tipContent: {
                type: String
            },
            emptyLabel: {
                type: String,
                default: '无'
            },
            defaultPlaceholder: {
                type: String,
                default: '请输入'
            },
            value: {
                type: String,
                default: ''
            },
            maxLength: {
                type: Number,
                default: 20
            },
            width: {
                type: String,
                default: '320px'
            },
            isText: {
                type: Boolean,
                default: true
            },
            textarea: {
                type: String,
                default: 'text'
            },
            editShow: {
                type: Boolean,
                default: true
            },
            showIconSpecial: {
                type: Boolean,
                default: true
            },
            sizeObj: {
                type: Object,
                default() {
                    return {
                        minRows: 5
                    };
                }
            }
        },
        data() {
            return {
                mouseIn: false
            };
        },
        computed: {
            currentValue() {
                return this.value.replace(/^\s+|\s+$/g, '');
            }
        },
        methods: {
            change(v) {
                this.$emit('change', v);
            },
            mouseEnter() {
                this.mouseIn = true;
            },
            mouseLeave() {
                this.mouseIn = false;
            },
            edit() {
                this.$emit('edit-info');
                this.$emit('change-status', false);
            },
            confirm() {
                this.mouseIn = false;
                this.$emit('confirm-info', this.currentValue, this.labelName);
            },
            cancel() {
                this.mouseIn = false;
                this.$emit('cancel-edit');
            }
        }
    };
</script>
<style lang="less">
@edit-box-width : 64px;
@edit-input-right: 0px;
.edit-input {
    // height: 32px;   // 不可以加高，要不textarea就不能多行了
    line-height: 32px; // 为了SMCERS-1460的第三个问题，编辑按钮对齐的问题
    margin-bottom: 0;
    .edit-input-btn{
        padding-left: 2px;
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translateY(-50%);
        width: @edit-box-width - @edit-input-right;
    }
    .edit-input-content {
        display: inline-block;
        position: relative;
        .ivu-form-item {
            display: inline-block;
            // max-width: 90%;
            padding-right: @edit-box-width - @edit-input-right;
            margin: 0;
            vertical-align: middle;
        }
    }
    .icon {
        float: left;
        user-select: none;
        padding-left: 4px;
        display: block;
        vertical-align: middle;
        line-height: 32px;
        height: 32px;
        .edit, .confirm, .cancel {
            cursor: pointer;
            &:hover {
                color: #2d8cf0;
            }
        }
    }
    .id-tip {
        float: left;
        display: block;
        cursor: pointer;
        font-size: 16px;
        .ivu-tooltip-inner {
            max-width: none;
        }
    }
    .table-edit {
        display: block;
        float: left;
        .edit-input-label {
            word-break: break-word;
        }
        .edit-input-empty{
            color: #ccc;
        }
    }
}
</style>
