<template>
    <div class="slide-create-box">
        <edit-title
            :loading="saveBtnStatus"
            :disabled="hasChanged"
            :title="titleName"
            @cancel-click="cancelEdit"
            @ok-click="okEdit">
        </edit-title>
        <div class="dialog-padding20 slide-scroll-box">
            <Card dis-hover class="p10">
                <CreateAttribute
                    ref="createAttr"
                    :createURI="apiUrl"
                    :editInfo="editInfo"
                    @changeLoading="changeLoading"
                    @changed="changed">
                </CreateAttribute>
            </Card>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';
    import CreateAttribute from './CreateAttribute';

    export default {
        data() {
            return {
                saveBtnStatus: false,
                hasChanged: true,
                apiUrl: {
                    url: '/properties',
                    type: ''
                }
            };
        },
        props: {
            titleName: {
                type: String,
                default: '新建属性'
            },
            editInfo: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        components: {
            editTitle,
            CreateAttribute
        },
        methods: {
            changed(val) {
                this.hasChanged = val;
            },
            changeLoading(val) {
                this.saveBtnStatus = val;
            },
            cancelEdit() {
                this.$tools.bus.$emit('hideDrawer');
            },
            okEdit() {
                this.$refs.createAttr.handleSubmit('formValidate');
            }
        }
    };
</script>
