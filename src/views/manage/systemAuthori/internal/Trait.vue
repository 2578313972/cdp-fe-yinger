<template>
    <div class="mask-bg">
        <edit-title :loading="saveBtnStatus" :disabled="hasChanged" @cancel-click="cancel" @ok-click="ok" title="授权特性"></edit-title>
        <div class="custom-dialog-content">
            <div class="dialog-padding20">
                <Card dis-hover class="item-box">
                    <Row style="font-weight:bold;">
                        <Col> 授权给{{itemInfo.titleType}}：{{itemInfo.title}}
                        </Col>
                    </Row>
                    <Divider style="margin:20px 0 0;" />
                    <Row class="mt20">
                        <Col>
                        <Form label-position="left" :label-width="80">
                            <Form-item class="nopl" style="margin-bottom:0;" label="授权特性">
                                <TraitInput :count="100" :closable="true" :btnType="true" :isShowTagList="true" :URI="URI" :selfTrait="selfTrait" :groupTrait="groupTrait" :multiple="true" @on-change="setObject" :value="objectAndDefine"></TraitInput>
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
    import TraitInput from '@/components/strategy/TraitInput.vue';

    export default {
        data() {
            return {
                saveBtnStatus: false,
                objectAndDefine: {},
                tagList: [],
                dataBack: []
            };
        },
        props: {
            selfTrait: {
                type: Boolean,
                default: true
            },
            groupTrait: {
                type: Boolean,
                default: true
            },
            URI: {
                type: Object,
                default() {

                }
            },
            itemInfo: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        components: {
            editTitle,
            TraitInput
        },
        computed: {
            hasChanged() {
                const orignData = this.$lodash.cloneDeep(this.tagList.map(item => item.code)).sort();
                const backData = this.$lodash.cloneDeep(this.dataBack.map(item => item.code)).sort();
                return this.$lodash.isEqual(orignData, backData);
            }
        },
        watch: {
            itemInfo: {
                handler() {
                    this.initData();
                },
                deep: true
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                this.tagList = this.$lodash.cloneDeep(this.itemInfo.values || []);
                if (!this.tagList) {
                    return;
                }
                const names = this.$lodash.cloneDeep(this.tagList.map(item => item.name));
                const value = this.$lodash.cloneDeep(this.tagList.map(item => item.code));
                this.objectAndDefine = {
                    names,
                    value
                };
                this.dataBack = this.$lodash.cloneDeep(this.tagList);
            },
            ok() {
                this.$emit('confirm', this.itemInfo, this.tagList);
            },
            cancel() {
                this.$emit('cancel');
                this.$emit('close-modal', false);
            },
            // 添加特性到Tag
            setObject(value) {
                if (value.names.length > 100) {
                    return;
                }
                this.objectAndDefine = this.$lodash.cloneDeep(value);
                this.clearSetObject(value);
            },
            clearSetObject() {
                this.tagList = this.objectAndDefine.names.map((item, i) => ({
                    name: item,
                    code: this.objectAndDefine.value[i]
                }));
            }
        }
    };
</script>

<style>
    .item-box .mtb5 {
        margin: 5px;
    }
</style>
