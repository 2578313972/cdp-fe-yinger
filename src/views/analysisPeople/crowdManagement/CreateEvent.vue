<template>
  <div class="slide-create-box">
    <edit-title
      :loading="saveBtnStatus"
      @cancel-click="cancel"
      @ok-click="ok"
      title="人群分析-新增人群"
      :disabled="hasChanged"
    ></edit-title>
    <div class="slide-scroll-box dialog-padding20">
      <Card dis-hover class="pl20 pr20">
        <p slot="title">基本信息</p>
        <!-- 新建事件 -->
        <Form
          ref="formValidate"
          class="padding16-18"
          label-position="left"
          :label-width="110"
          :model="formValidate"
          :rules="ruleValidate"
        >
          <Form-item label="人群选择" prop="person">
            <Select filterable v-model="formValidate.person" placeholder="请选择人群" class="width400">
                <Option v-for="item in personList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <p style="font-size:13px;">注： 请先在 <a @click="$router.push('/crowd')">“用户---人群管理”</a> 中创建人群</p>
          </Form-item>

          <Form-item label="分析时间" prop="value1">
            <Date-picker
              class="width400"
              v-model="formValidate.timeValue"
              format="yyyy/MM/dd"
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
            ></Date-picker>
          </Form-item>
          <Form-item label="营销描述">
            <Input
              :maxlength="100"
              class="width400"
              type="textarea"
              v-model.trim="formValidate.description"
              :autosize="{minRows: 2,maxRows: 3}"
              placeholder="请输入营销描述，长度为100字以内"
            />
          </Form-item>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
    import editTitle from '@/components/EditTitle';

    export default {
        data() {
            return {
                saveBtnStatus: false,
                personList: [], // 人群下拉框数据
                formValidate: {
                    code: '',
                    timeValue: [],
                    person: '',
                    description: '',
                    value1: ''
                },
                ruleValidate: {
                    person: [
                        {
                            required: true,
                            message: '请选择人群',
                            trigger: 'blur,change'
                        }
                    ],
                    value1: [
                        {
                            required: true,
                            message: '请选择活动时间,并且时间之差不得超过30天',
                            trigger: 'blur,change'
                        }
                    ],
                    description: [
                        {
                            required: true,
                            message: '请输入活动描述',
                            trigger: 'blur,change'
                        }
                    ]
                },
                dataBack: {}
            };
        },
        created() {
            this.$https.crowdManagement.visible().then((res) => {
                this.personList = res.data.items.map(item => ({ label: item.name, value: item.code }));
            });
        },
        watch: {
            'formValidate.timeValue': function (e) {
                if (e[0] && e[1].getTime() / 1000 / 60 / 60 / 24 - e[0].getTime() / 1000 / 60 / 60 / 24 <= 30) {
                    this.formValidate.value1 = 'true';
                } else {
                    this.formValidate.value1 = null;
                }
            }
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.formValidate, this.dataBack);
            }
        },
        components: {
            editTitle
        },
        mounted() {
            this.dataBack = this.$lodash.cloneDeep(this.formValidate);
        },
        methods: {
            cancel() {
                this.$emit('cancelCreatEvent', false);
            },
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.saveBtnStatus = true;
                        const data = {
                            crowdCode: this.formValidate.person,
                            startTimeDay: this.formValidate.timeValue[0],
                            endTimeDay: this.formValidate.timeValue[1],
                            descriptions: this.formValidate.description
                        };
                        data.startTimeDay = this.$time(data.startTimeDay);
                        data.endTimeDay = this.$time(data.endTimeDay);

                        this.$https.crowdManagement.addMarketingCrowd(data).then((res) => {
                            this.saveBtnStatus = false;
                            this.$Message.destroy();
                            this.$Message.success('已添加');
                            this.$emit('submitCreatEvent', res);
                        }).catch(() => {
                            this.saveBtnStatus = false;
                        });
                    }
                });
            }
        },
        destroyed() {}
    };
</script>

<style lang="less" scoped>
    .pr20 {
        padding: 0;
    }
</style>
