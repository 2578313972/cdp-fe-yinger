<template>
    <Tooltip placement="top" content="复制">
        <Icon @click="doCopy" color="#008cf8" size="16" type="md-copy" />
    </Tooltip>
</template>

<script>
    export default {
        name: 'Clipboard',
        data() {
            return {};
        },
        props: {
            content: {
                type: String,
                default: ''
            }
        },
        methods: {
            doCopy() {
                this.$Message.destroy();
                this.$copyText(this.content).then(() => {
                    this.$Message.success('已复制');
                }, function () {
                    this.$Message.success('复制失败');
                });
            }
        }
    };
</script>

<style lang='less'>

</style>
