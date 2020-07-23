<template>
    <div class="iframeWarp" :style="{'height':height+'px'}">
        <iframe style="margin:0;padding:0;" ref="iframe" width="100%" :height="height" :src="url" frameborder="0"></iframe>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                height: 0,
                spinShow: true,
                url: ''
            };
        },
        mounted() {
            this.getIurl();
            this.$Loading.start();
            if (this.$refs.iframe.attachEvent) {
                // IE
                this.$refs.iframe.attachEvent('onload', () => {
                    this.setHeight();
                });
            } else {
                // 非IE
                this.$refs.iframe.onload = () => {
                    this.setHeight();
                };
            }
            window.addEventListener('resize', this.setHeight);
        },
        methods: {
            getIurl() {
                const iUrl = this.$route.path.split('outer')[1];
                this.url = this.$config.login_info.iframeUrl[iUrl];
            },
            setHeight() {
                this.$Loading.finish();
                this.spinShow = false;
                this.$nextTick(() => {
                    const hasScrollX = document.querySelector('.main-right').scrollWidth > document.querySelector('.main-right').clientWidth;
                    this.height = hasScrollX ? document.documentElement.clientHeight - 8 : document.documentElement.clientHeight;
                });
            }
        },
        watch: {
            $route() {
                this.$Loading.start();
                this.getIurl();
                this.$nextTick(() => {
                    this.$Loading.finish();
                });
            }
        },
        destroyed() {
            // 销毁后解绑resize事件
            window.removeEventListener('resize', this.setHeight);
        }
    };
</script>

<style lang="less" scoped>
.iframeWarp{
    overflow: hidden;
}
</style>
