<template>
  <div class="slide-create-box">
    <edit-title
      :loading="saveBtnStatus"
      @cancel-click="cancel"
      @ok-click="ok"
      :title="title"
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
          <Form-item label="人群选择" prop="code">
            <Input
              class="width400"
              :maxlength="32"
              v-model.trim="formValidate.code"
              placeholder="请输入活动名称"
            />
          </Form-item>
          <Form-item label="分析时间" prop="value1">
            <Date-picker
              class="width300"
              v-model="formValidate.timeValue"
              format="yyyy/MM/dd"
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
            ></Date-picker>
          </Form-item>
          <Form-item label="营销描述" prop="description">
            <Input
              :maxlength="100"
              class="width400"
              type="textarea"
              v-model.trim="formValidate.description"
              :autosize="{minRows: 2,maxRows: 3}"
              placeholder="请输入描述，长度为100字以内"
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
                title: '人群分析-新增人群',
                saveBtnStatus: false,
                formValidate: {
                    code: '',
                    timeValue: [],
                    description: '',
                    value1: ''
                },
                ruleValidate: {
                    code: [
                        {
                            required: true,
                            message: '请输入活动名',
                            trigger: 'blur,change'
                        }
                    ],
                    value1: [
                        {
                            required: true,
                            message: '请选择活动时间',
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
        watch: {
            'formValidate.timeValue': function (e) {
                if (e[0]) {
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
        // created: {},
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
                            display_name: this.formValidate.code,
                            starttime_day: this.formValidate.timeValue[0],
                            endtime_day: this.formValidate.timeValue[1],
                            descriptions: this.formValidate.description
                        };
                        data.starttime_day = this.$time(data.starttime_day);
                        data.endtime_day = this.$time(data.endtime_day);

                        this.$axios.post(
                            '/cdp-web/marketplugin/calendarManagement/addActivity', data,
                            { headers: { 'Content-Type': 'application/json' } }
                        ).then((res) => {
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
