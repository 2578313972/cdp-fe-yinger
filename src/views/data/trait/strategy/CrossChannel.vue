<template>
    <div>
        <div class="cross-box">
            <Row type="flex" justify="start" align="middle">
                <Col class="cross-box-title mr10">触发方式：</Col>
                <Col>{{cross_channel.channel_name||'-'}}</Col>
            </Row>
        </div>
        <div class="cross-box mt10 mb10">
            <Row type="flex" justify="start" align="middle">
                <Col class="cross-box-title mr10">授权状态：</Col>
                <Col>{{cross_channel_status}}</Col>
            </Row>
            <Row type="flex" justify="start" align="middle">
                <Col class="cross-box-title mr10">{{cross_channel_time_name}}</Col>
                <Col>{{cross_channel_time}}</Col>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            cross_channel: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        computed: {
            cross_channel_status() {
                return this.cross_channel.authorized ? '授权中，特性将实时更新' : '已取消授权，特性将不再更新';
            },
            cross_channel_time_name() {
                return this.cross_channel.authorized ? '授权时间：' : '取消授权时间：';
            },
            cross_channel_time() {
                return this.$date(+this.cross_channel.authorize_time).format('YYYY-MM-DD HH:mm:ss') || '-';
            }
        }
    };
</script>

<style scoped lang="less">
    .cross-box{
        border: 1px solid #e8eaec;
        border-radius: 4px;
        padding: 10px 16px;
        line-height: 30px;
        .cross-box-title{
            font-size: 14px;
            font-weight: 700;
            color: #17233d;
        }
    }
</style>
