<template>
    <div>
        <div class="mask-bg">
            <edit-title @cancel-click="cancel" @ok-click="ok" :title="title"></edit-title>
        </div>
        <div class="custom-dialog-content ">
            <div class="m20">
                <Card dis-hover style="padding-bottom:100px">
                    <p slot="title">基本信息</p>
                    <Form class="mt20" ref="formValidate" label-position="left" :label-width="90" :model="formValidate" :rules="ruleValidate" style="padding:0 20px">
                        <Form-item label="所属活动：" prop="activity">
                            <Select v-model="formValidate.activity" class="width500" placeholder='请选择所属活动'>
                                <Option v-for="item in activityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="投放名称：" prop="name">
                            <Input :maxlength='20' v-model.trim="formValidate.name" placeholder="请输入投放单元名称" class="width500" />
                        </Form-item>
                        <Form-item label="交互类型：" prop="interactiveType">
                            <Select v-model="formValidate.interactiveType" class="width500" placeholder="请选择交互类型" @on-change="changeInteractiveType">
                                    <Option v-for="item in responseType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label=" " prop="marketingType">
                            <RadioGroup v-model="formValidate.marketingType">
                                <Radio label="marketing">
                                    <span>营销</span>
                                </Radio>
                                  <Tooltip max-width="300" content="营销投放将启动频次控制、渠道黑白名单、免打扰控制" placement="right">
                                     <i class="fa fa-question-circle-o" style="margin-left:-10px"></i>
                                 </Tooltip>
                                <Radio label="un_marketing" class="ml10">
                                    <span>非营销</span>
                                </Radio>
                            </RadioGroup>
                            <span></span>
                        </Form-item>
                        <Form-item label="投放类别：" prop="putType">
                            <Select v-model="formValidate.putType" filterable multiple class="width500" placeholder="请选择投放类别">
                                <Option v-for="item in putTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="描述：" prop="description">
                            <Input :maxlength='100' type="textarea" v-model.trim="formValidate.description" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入活动描述，最多100个字" class="width500" />
                        </Form-item>
                    </Form>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        props: {
            editContent: {
                type: Object,
                default() {
                    return {};
                }
            },
            title: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                formValidate: {
                    activity: this.editContent.activity || '',
                    name: this.editContent.name || '',
                    marketingType: this.editContent.marketingType || '',
                    interactiveType: this.editContent.interactiveType ? `${this.editContent.interactiveType}` : '',
                    putType: this.editContent.putType || [],
                    description: this.editContent.description || ''
                },
                // 是否必填
                ruleValidate: {
                    // 所属活动
                    activity: [{
                        required: true,
                        message: '请选择所属活动',
                        trigger: 'change'
                    }
                    ],
                    // 投放名称
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
                    // 交互类型
                    interactiveType: [{
                        required: true,
                        message: '请选择交互类型',
                        trigger: 'change'
                    }],
                    // 描述
                    description: [{
                        required: true,
                        message: '请选择交互类型',
                        trigger: 'blur'
                    }]
                },
                activityList: [{
                                   label: '年货节-超级秒杀日，最低1折起',
                                   value: '年货节-超级秒杀日，最低1折起'
                               },
                               {
                                   label: '新装抢鲜，呼气春天，春装全面上市',
                                   value: '新装抢鲜，呼气春天，春装全面上市'
                               },
                               {
                                   label: '四月踏青，魅力出行，缤纷春季购物节',
                                   value: '四月踏青，魅力出行，缤纷春季购物节'
                               },
                               {
                                   label: '五一钜惠，全场满立减，满包邮，满500送20',
                                   value: '五一钜惠，全场满立减，满包邮，满500送20'
                               },
                               {
                                   label: '十周年庆，年中放价，全场满618减60',
                                   value: '十周年庆，年中放价，全场满618减60'
                               },
                               {
                                   label: '夏季初登场，购物送好礼',
                                   value: '夏季初登场，购物送好礼'
                               },
                               {
                                   label: '仲夏大行动，全场9折起，满150再返20',
                                   value: '仲夏大行动，全场9折起，满150再返20'
                               },
                               {
                                   label: '开学季-领跑新学期，开学装备特惠专场',
                                   value: '开学季-领跑新学期，开学装备特惠专场'
                               },
                               {
                                   label: '尽享意外惊喜“国庆购物不花钱”',
                                   value: '尽享意外惊喜“国庆购物不花钱”'
                               },
                               {
                                   label: '庆圣诞迎元旦 精选商品7折起 满400包邮',
                                   value: '庆圣诞迎元旦 精选商品7折起 满400包邮'
                               }

                ],
                responseType: [{
                                   label: '单次通知',
                                   value: '0'
                               },
                               {
                                   label: '事件响应',
                                   value: '1'
                               },
                               {
                                   label: '周期性通知',
                                   value: '2'
                               },
                               {
                                   label: '日期通知',
                                   value: '3'
                               },
                               {
                                   label: '旅程响应',
                                   value: '4'
                               },
                               {
                                   label: '旅程通知',
                                   value: '5'
                               }
                ],
                putTypes: [{
                               label: '拉新',
                               value: '拉新'
                           },
                           {
                               label: '促活',
                               value: '促活'
                           }
                ]
            };
        },
        computed: {},
        components: {
            editTitle
        },
        // created: {},
        mounted() {},
        methods: {
            // 切换交互类型提示
            changeInteractiveType(val) {
                if (this.$route.path == '/activity/list') {

                } else {
                    this.$Modal.confirm({
                        title: '确定要切换交互类型？',
                        content: '<p>切换交互类型后，将重置投放单元</p>',
                        onOk: () => {
                            this.formValidate.interactiveType = `${val}`;
                            this.$Message.destroy();
                            this.$Message.success('已更改');
                        },
                        onCancel: () => {
                            this.formValidate.interactiveType = this.editContent.interactiveType;
                            this.$Message.destroy();
                            this.$Message.success('取消更改');
                        }
                    });
                }
            },
            // /取消创建
            cancel() {
                if (this.editContent == {}) {
                    this.formValidate = {};
                } else {
                    this.formValidate = this.editContent;
                }
                this.$emit('cancelCreateUnit', false);
            },
            // 确定创建
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // 存储类型
                        this.$config.interactive_type = this.formValidate.interactiveType;
                        // 提交弹框
                        this.$emit('submitCreateUnit', false);
                        // 新建活动单元跳转到详情页
                        if (JSON.stringify(this.editContent) == '{}') {
                            this.$router.push({
                                path: '/activity/detail',
                                query: {
                                    name: 'detail'
                                // id: row_id,
                                }
                            });
                        } else {
                            // 跳转步骤
                            this.$tools.bus.$emit('handle-click-step', 0, true);
                        }
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
