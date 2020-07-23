<template>
    <div class="pagination">
        <Page :total="total" :current="current" @on-change="handleClick" show-elevator/>
    </div>
</template>
<script>
    export default {
        name: 'pagination',
        props: {
            total: {
                type: Number
            },
            current: {
                type: Number,
                default: 1
            }
        },
        methods: {
            handleClick(num) {
                this.$emit('get-data', num);
            }
        }
    };
</script>
<style lang="less">
.pagination {
    .ivu-page {
        text-align: right;
    }
}
</style>
