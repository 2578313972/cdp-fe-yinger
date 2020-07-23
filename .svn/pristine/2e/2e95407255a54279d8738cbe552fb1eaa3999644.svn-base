<template>
    <div class="mask-bg">
        <p class="title">切换渠道</p>
        <div class="custom-dialog-content">
            <div class="channel-content">
                <div class="channel-item" @click="changeRole(item.channel_id)"
                    v-for="(item,index) in list"
                    :key="index"
                    :class="{'channel-active':item.active}">
                    <Row class="channel-row"
                        type="flex"
                        justify="start">
                            <Col>
                                <div class="channel-logo">
                                    <!-- <img :src="item.src"> -->
                                    <i :class="item.icon_type" style="font-size:2em; line-height:1.4em;"></i>
                                </div>
                            </Col>
                            <Col>
                                <p class="channel-title">{{item.channel_name}}（{{item.channel_id}}）</p>
                                <p class="channel-name">
                                    {{item.role_name}}
                                    <span v-if="item.org_id">( {{item.org_name}} )</span>
                                </p>
                            </Col>
                    </Row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                list: [],
                channel_id: ''
            };
        },

        methods: {

            init() {
                this.channel_id = this.$config.login_info.cur_channel_id;
                this.getList();
            },

            getList() {
                const user_channels = this.$config.login_info.user_channels;
                user_channels.forEach((item) => {
                    if (item.channel_id == this.channel_id) this.$set(item, 'active', true);
                });
                this.list = user_channels;
            },

            changeRole(id) {
                if (this.channel_id == id) return; // 当前角色
                this.$axios.put(`${this.$config.apiDomain}/user/channel?channel_id=${id}&is_setting_default=false`)
                    .then(() => {
                        window.location.href = window.location.origin + window.location.pathname;
                    });
            }

        },

        mounted() {
            this.init();
        }

    };
</script>

<style lang="less" scoped>
    .title{
        line-height: 50px; font-weight: bold;
        font-size: 16px; background: #fff;
        border-bottom: 1px solid #eee;
        text-indent: 20px;
    }
    .channel-content{
        margin:20px;
        background: #fff;
        box-shadow: 0 0 5px #dcdee2;
        border-radius: 5px;
        .channel-item{
            cursor: pointer;
        }
        .channel-row{
            height: 60px;
            border-bottom: 1px #dddee1 solid;
            .channel-logo{
                width: 30px; height: 30px;
                border-radius: 5px;
                overflow: hidden;
                margin-top: 15px;
                margin-left: 10px;
                /*
                img{
                    width: 100%;
                    height: 100%;
                }
                */
            }
            .channel-title{
                margin: 12px 0 0 5px;
                line-height: 22px;
                color: #17233d;
            }
            .channel-name{
                margin-left: 5px;
                color: #808695;
            }
        }
        .channel-active{
            background: rgba(92, 173, 255, 0.1);
        }
    }
</style>
