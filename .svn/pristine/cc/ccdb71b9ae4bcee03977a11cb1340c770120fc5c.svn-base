<template>
    <div class="advertise-preview">
        <p class="date-interval">投放时间：
            <span class="key-content">{{ preview.advertiseTime.from }}</span>
            至
            <span class="key-content">{{ preview.advertiseTime.to }}</span>
        </p>
        <Card dis-hover class="card-wrapper">
            <p class="title-wrapper">
                <Icon type="md-checkmark-circle-outline green-icon" size="16"/>
                <span class="title">人群</span>
                <i class="edit ivu-icon ivu-icon-md-create f14" @click="jumpToTab(0)"></i>
            </p>
            <p class="content-wrapper">
                <span class="item">{{ preview.crowd.traitName }}：<span class="key-content">{{ preview.crowd.originNum }}人</span></span>
                <span class="item">人群类型：<span class="key-content">{{ preview.crowd.crowdType }}</span></span>
                <span class="item">最后更新时间：<span class="key-content">{{ preview.crowd.updateTime }}</span></span>
                <span class="item">计划投放人数：<span class="key-content">{{ preview.crowd.planNum }}人</span></span>
                <span class="item">去除人数：<span class="key-content">{{ preview.crowd.minusNum }}人</span></span>
            </p>
        </Card>
        <Card dis-hover class="card-wrapper">
            <p class="title-wrapper">
                <Icon type="md-checkmark-circle-outline green-icon" size="16"/>
                <span class="title">触点</span>
                <i class="edit ivu-icon ivu-icon-md-create f14" @click="jumpToTab(1)"></i>
            </p>
            <p class="content-wrapper">
                <span class="item">渠道：<span class="key-content">{{ preview.touch.channelType }}</span></span>
                <span class="item">触点：<span class="key-content">{{ preview.touch.touchType }}</span></span>
                <span class="item">短信预计发送：<span class="key-content">{{ preview.touch.planSendNum }}</span></span>
                <span class="item">触达率：<span class="key-content">{{ preview.touch.touchRatio }}%</span></span>
            </p>
        </Card>
        <Card dis-hover class="card-wrapper">
            <p class="title-wrapper">
                <Icon type="md-checkmark-circle-outline green-icon" size="16"/>
                <span class="title">模式</span>
                <i class="edit ivu-icon ivu-icon-md-create f14" @click="jumpToTab(2)"></i>
            </p>
            <p class="content-wrapper">
                <span class="item">交互模式：<span class="key-content">{{ preview.mode.interactiveMode }}</span></span>
                <span class="item">发出时间：<span class="key-content">{{ preview.mode.sendTime }}</span></span>
                <span class="item">筛选条件：<span class="key-content">{{ preview.mode.condition }}</span></span>
            </p>
        </Card>
        <Card dis-hover class="card-wrapper">
            <p class="title-wrapper">
                <Icon type="md-checkmark-circle-outline green-icon" size="16"/>
                <span class="title">内容</span>
                <i class="edit ivu-icon ivu-icon-md-create f14" @click="jumpToTab(3)"></i>
            </p>
            <p class="content-wrapper">
                <span class="item">文本：<span class="key-content">{{ preview.content }}</span></span>
            </p>
        </Card>
        <Card dis-hover class="card-wrapper">
            <p class="title-wrapper">
                <Icon type="md-checkmark-circle-outline green-icon" size="16"/>
                <span class="title">报告</span>
                <i class="edit ivu-icon ivu-icon-md-create f14" @click="jumpToTab(4)"></i>
            </p>
            <p class="content-wrapper">
                <span class="item">第一节点：<span class="key-content">计划发送</span></span>
                <span class="item">第二节点：<span class="key-content">预计发送</span></span>
                <span class="item">第三节点：<span class="key-content">实际发送</span></span>
                <template v-for="item in preview.report">
                    <span class="item">第{{ item.step }}节点：<span class="key-content">{{ item.title }}</span></span>
                </template>
            </p>
        </Card>
    </div>
</template>
<script>
    export default {
        name: 'Preview',
        data() {
            return {
                preview: this.$activity.preview
            };
        },
        methods: {
            jumpToTab(index) {
                this.$tools.bus.$emit('handle-click-step', index);
            }
        }
    };
</script>
<style lang="less" scoped>
.advertise-preview {
    padding: 0 26px 0 26px;
    .key-content {
        color: #2d8cf0;
    }
    .green-icon {
        color: #52C41A;
    }
    .date-interval {
        padding-bottom: 16px;
        font-size: 14px;
    }
    .card-wrapper {
        margin-bottom: 16px;
        .title-wrapper {
            font-size: 16px;
            line-height: 32px;
            .edit {
                float: right;
            }
        }
        .content-wrapper {
            padding: 6px 10px 4px 21px;
            .item {
                display: inline-block;
                min-width: 190px;
                padding-right: 16px;
            }
        }
    }
}
</style>
