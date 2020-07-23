<template>
    <div>
        <div class="mask-bg">
            <edit-title @cancel-click="cancel" @ok-click="ok" title="新建营销活动"></edit-title>
        </div>
        <div class="custom-dialog-content m20">
                <Card dis-hover style="padding-bottom:150px">
                    <p slot="title">基本信息</p>
                    <Form class="mt20" ref="formValidate" label-position="left" :label-width="90" :model="formValidate" :rules="ruleValidate" style="padding:0 20px">
                        <Form-item label="名称：" prop="name">
                            <Input :maxlength='20' v-model.trim="formValidate.name" placeholder="请输入活动名称" class="width500" />
                        </Form-item>
                        <Form-item label="活动审核ID：" prop="id">
                            <Input v-model.trim="formValidate.id" placeholder="请输入有OA系统生成的活动审核ID" class="width500" />
                        </Form-item>
                        <Form-item label="时间：" prop="date">
                            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择活动起止时间" :value="formValidate.date" class="width500" @on-change="changeDate"></DatePicker>
                        </Form-item>
                        <Form-item label="描述：" prop="description">
                            <Input :maxlength='100' type="textarea" v-model.trim="formValidate.description" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入描述" class="width500" />
                        </Form-item>
                    </Form>
                </Card>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        props: {},
        data() {
            return {
                formValidate: {
                    name: '',
                    id: '',
                    date: [],
                    description: ''
                },
                ruleValidate: {
                    name: [{
                               required: true,
                               message: '请输入活动名称',
                               trigger: 'blur'
                           },
                           {
                               pattern: this.$config.reg_input.reg,
                               message: this.$config.reg_input.msg,
                               trigger: 'blur'
                           }
                    ],
                    date: [
                        {
                            required: true,
                            type: 'array',
                            message: '请选择活动起止时间',
                            trigger: 'change'
                        }
                    ]
                }
            };
        },
        computed: {},
        components: {
            editTitle
        },
        // created: {},
        mounted() {},
        methods: {
            changeDate(val) {
                this.formValidate.date = val;
            },
            // /取消创建
            cancel() {
                this.formValidate = {};
                this.$emit('cancelCreateAcivity', false);
            },
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.$emit('commitCreateAcivity', false);
                        this.$router.push({
                            path: '/activity/detail',
                            query: {
                                name: 'detail'
                            // id: row.id,
                            // tabView: row.visibility,
                            }
                        });
                    }
                });
            }
        },
        watch: {},
        destroyed() {}
    };
</script>

<style scoped lang="less">

</style>
