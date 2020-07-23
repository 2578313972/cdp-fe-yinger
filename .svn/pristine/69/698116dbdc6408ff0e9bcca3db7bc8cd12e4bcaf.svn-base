<template>
    <Row class="edit-btn-box">
        <Col :span="isShowBtn?12:24" class="edit-title">{{title}}</Col>
        <Col v-if="isShowBtn" span="12" style="text-align:right;">
            <Button @click="cancelEdit">{{cancelText}}</Button>&nbsp;&nbsp;
            <Button :loading="loading" :disabled="disabled" type="primary" @click="okEdit">{{okText}}</Button>
        </Col>
    </Row>
</template>

<script>
    export default {
        name: 'EditAccount',
        data() {
            return {};
        },
        props: {
            title: {
                type: String,
                default: '修改账号'
            },
            okText: {
                type: String,
                default: '确定'
            },
            cancelText: {
                type: String,
                default: '取消'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            isShowBtn: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            cancelEdit() {
                this.$emit('cancel-click');
            },
            okEdit() {
                this.$emit('ok-click');
            }
        }
    };
</script>

<style lang='less' scoped>
    .edit-btn-box {
        padding: 10px 20px;
        background: #fff;
        border-bottom: 1px solid #eee;
        .edit-title {
            font-size: 16px;
            font-weight: bold;
            padding: 5px 0 0 35px;
        }
    }
</style>
