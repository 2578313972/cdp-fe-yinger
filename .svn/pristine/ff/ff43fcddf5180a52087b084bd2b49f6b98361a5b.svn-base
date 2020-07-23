<template>
    <div class="mask-bg">
        <edit-title :loading="saveBtnStatus" :disabled="hasChanged" @cancel-click="cancel" @ok-click="saveEvent" title="授权事件"></edit-title>
        <div class="custom-dialog-content">
            <div class="dialog-padding20">
                <Card dis-hover class="item-box">
                    <Row style="font-weight:bold;">
                        <Col> 授权给渠道：{{itemInfo.target_channel_name}}
                        </Col>
                    </Row>
                    <Divider style="margin:20px 0 0;" />
                    <Row class="mt20">
                        <Col>
                        <Form label-position="left" :label-width="70">
                            <Form-item style="margin-bottom:0;" label="授权事件:">
                                <button-select count="100" btn-text="事件" @on-select-change="onChange" :tag-list="tagList" :data-list="dataList"></button-select>
                            </Form-item>
                        </Form>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle.vue';
    import buttonSelect from '@/components/ButtonSelect.vue';

    export default {
        data() {
            return {
                saveBtnStatus: false,
                tagList: [],
                dataList: [],
                dataBack: []
            };
        },
        props: {
            itemInfo: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        components: {
            editTitle,
            buttonSelect
        },
        computed: {
            hasChanged() {
                const orignData = this.$lodash.cloneDeep(this.tagList.map(item => item.value)).sort();
                const backData = this.$lodash.cloneDeep(this.dataBack.map(item => item.value)).sort();
                return this.$lodash.isEqual(orignData, backData);
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getEventList().then(({
                    data
                }) => {
                    this.dataList = data.items.map(item => ({
                        label: item.name,
                        value: item.code
                    }));
                    this.getTagList();
                });
            },
            getEventList() {
                return this.$axios.get(`${this.$config.apiDomain}/events`, {
                    params: {
                        authorized: false,
                        size: -1
                    }
                });
            },
            getTagList() {
                const itemCode = this.itemInfo;
                const apiUrl = `/res-auth/source-channel/cur-channel/target-channel/${itemCode.target_channel_code}/events-auth`;
                const params = {};
                this.$axios
                    .get(`${this.$config.apiDomain}${apiUrl}`, {
                        params
                    })
                    .then(({
                        data
                    }) => {
                        if (data.auth_info) {
                            this.tagList = data.auth_info.map(item => ({
                                label: item.source_name,
                                value: item.source_code
                            }));
                            this.dataBack = this.$lodash.cloneDeep(this.tagList);
                        }
                    });
            },
            saveEvent() {
                const itemCode = this.itemInfo;
                const apiUrl = `/res-auth/source-channel/cur-channel/target-channel/${itemCode.target_channel_code}/events-auth`;
                const params = this.tagList.map(item => item.value);
                this.$axios({
                    method: 'put',
                    url: `${this.$config.apiDomain}${apiUrl}`,
                    data: params
                })
                    .then(() => {
                        this.saveBtnStatus = false;
                        this.cancel();
                        this.$Message.destroy();
                        this.$Message.success('已修改');
                        // 更新列表
                        this.$parent.$parent.getData();
                    })
                    .catch(() => {
                        this.saveBtnStatus = false;
                    });
            },
            cancel() {
                this.$parent.$parent.showDetail = false;
            },
            onChange(value) {
                this.tagList = value;
            }
        }
    };
</script>

<style lang="less">

</style>
