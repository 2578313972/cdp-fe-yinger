<template>
    <Card dis-hover class="view-card-wrapper">
        <p class="title">{{title}}</p>
        <Row class="change-status-wrapper">
            <Col span="12">
                <div>
                    <div class="num">{{amount | formatAmount}}</div>
                    {{subtitle}}
                </div>
            </Col>
            <Col span="12">
                <div>
                    <div class="num">{{changeNum | formatAmount}}</div>
                    {{changeTitle}}
                </div>
            </Col>
        </Row>
    </Card>
</template>

<script>
    export default {
        name: 'ViewCard',
        props: {
            title: {
                type: String,
                default: ''
            },
            subtitle: {
                type: String,
                default: ''
            },
            amount: {
                type: Number,
                default: 0
            },
            changeTitle: {
                type: String,
                default: ''
            },
            changeNum: {
                type: Number,
                default: 0
            }
        }
    };
</script>

<style lang="less" scoped>
.view-card-wrapper {
    border: 1px solid rgb(233, 233, 233);
    .title {
        font-size: 16px;
    }
    .num {
        font-size: 20px;
        color: #2185F0;
        padding: 15px 0 5px;
    }
    .change-status-wrapper {
        font-size: 13px;
        color: rgba(23,35,61,0.55);
    }
}
</style>
