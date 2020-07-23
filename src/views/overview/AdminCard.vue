<template>
<div class="admin-box">
    <div class="admin-title"><span>{{title}}</span></div>
    <ul class="admin-list">
        <li v-for="(item,index) in data" :key="index">
            <span :class="item.state" class="iconfont icon-server"></span>
            <div style="flex:1;color: #17233D;">{{item.name}}</div>
            <div style="flex:1;">{{item.access_ip}}</div>
            <div style="flex:1;">
                <span :style="{color:state[item.state].color}">{{state[item.state].text}}</span>
                <Button class="td-btn-primary ml20" v-if="item.state=='down'&&item.allow_start=='allow'" @click="reStart(item)">启动</Button>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
    export default {
        name: 'AdminCard',
        data() {
            return {
                state: {
                    unknown: {
                        color: '#808695',
                        text: '未知'
                    },
                    down: {
                        color: '#ed4014',
                        text: '异常'
                    },
                    up: {
                        color: '#19be6b',
                        text: '正常'
                    },
                    starting: {
                        color: '#ff9900',
                        text: '启动中'
                    }
                }
            };
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            data: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        methods: {
            reStart(params) {
                const apiUrl = `/board/start-instances/${params.id}`;
                this.$axios.post(`${this.$config.apiDomain}${apiUrl}`)
                    .then(() => {
                        this.$parent.getData();
                    })
                    .catch(() => {
                        this.$parent.getData();
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
.admin-box{
    display: flex;
    color: rgba(23,35,61,0.55);
    border-bottom: 1px solid #e8eaec;
    .admin-title{
        width: 200px;
        display: flex;
        align-items: center;
        color: rgba(23,35,61,0.75);
        padding-left: 24px;
    }
    .admin-list{
        flex: 1;
        & li{
            &+li{
                border-top: 1px solid #e8eaec;
            }
            border-left: 1px solid #e8eaec;
            display: flex;
            list-style: none;
            line-height: 55px;
            & .icon-server {
                padding:0 20px;
                font-size:14px;
                border-radius: 50%;
                &:before {
                    padding:4px;
                    border-radius: 50%;
                    color: #fff;
                }
                &.starting:before {
                    background: #F19E38;
                    border:5px solid #F5E5CA;
                }
                &.unknown:before {
                    background: #808695;
                    border:5px solid #DBE1F6;
                }
                &.up:before {
                    background: #52B467;
                    border:5px solid #D4F0E0;
                }
                &.down:before {
                    background: #D44038;
                    border:5px solid #F8E1E1;
                }
            }

        }
    }
}
</style>
