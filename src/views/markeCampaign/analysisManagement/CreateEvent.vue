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
          :label-width="120"
          :model="formValidate"
          :rules="ruleValidate"
          @on-validate="formRules"
        >
          <Form-item label="任务名称" prop="code">
            <Input
              class="width400"
              :maxlength="32"
              v-model.trim="formValidate.code"
              placeholder="请输入任务名称"
            />
          </Form-item>
          <Form-item label="交易起止时间" prop="value1">
            <Date-picker
              class="width400"
              v-model="formValidate.timeValue"
              format="yyyy/MM/dd"
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
            ></Date-picker>
          </Form-item>
          <Form-item label="品牌" prop="copyditch">
              <i-select
                class="width400"
                clearable
                filterable
                multiple
                :max-tag-count='3'
                @on-change="ditchChange"
                placeholder="品牌"
                v-model="formValidate.ditch"
              >
                <i-option
                  v-for="item in ditchList"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</i-option>
              </i-select>
          </Form-item>
          <Form-item label="已选品牌">{{ditchVal}}</Form-item>
          <Form-item label="渠道" prop="copyOto">
            <i-select class="width400" multiple @on-change="otoChange" v-model="formValidate.oto">
              <i-option
                v-for="item in otoList"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="已选渠道">{{selectVal}}</Form-item>
          <Form-item label="组织" required>
            <Form-item prop="copyditch" >
              区域&nbsp;
              <i-select
                filterable
                @on-change="areaChange"
                placeholder="区域"
                v-model="formValidate.area"
                style="width:100px"
              >
                <i-option
                  v-for="item in areaList"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</i-option>
              </i-select>
            </Form-item>
            <span v-if="onLine">&nbsp;&nbsp;&nbsp;选择门店&nbsp;</span>
            <Form-item v-if="onLine">
              <i-select
                filterable
                @on-change="shopChange"
                multiple
                :max-tag-count='1'
                placeholder="门店"
                v-model="formValidate.shop"
                style="width:195px;"
              >
                <i-option
                  v-for="item in shopList"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</i-option>
              </i-select>
            </Form-item>

          </Form-item>
          <Form-item label="已选组织">{{selectDitch}}</Form-item>
          <Form-item label="金蓝标选择" prop="copymodel">
            <i-select class="width400" multiple @on-change="optionChange" v-model="formValidate.model">
              <i-option
                v-for="item in colorList"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="已选择金蓝标">{{jlbVal}}</Form-item>

          <Form-item label="任务描述">
            <Input
              :maxlength="100"
              class="width400"
              type="textarea"
              v-model.trim="formValidate.description"
              :autosize="{minRows: 2,maxRows: 3}"
              placeholder="请输入描述，100字以内"
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
                title: '订单分析-新增分析任务',
                selectVal: '',
                ditchVal: '',
                jlbVal: '',
                saveBtnStatus: false,
                ditchList: [], // 渠道
                areaList: [], // 区域
                shopList: [], // 门店
                colorList: [], // 金蓝标选择
                otoList: [], // 线上 线下选择

                onLine: true,

                formValidate: { // 表单数据
                    code: '',
                    timeValue: [],
                    oto: [],
                    ditch: [],
                    area: '',
                    shop: [],
                    model: [],
                    description: '',

                    value1: '',
                    copyditch: '',
                    copyshop: '',
                    copyOto: '',
                    copymodel: ''
                },
                ruleValidate: {
                    code: [{ required: true, message: '请输入任务名', trigger: 'blur,change' }],
                    value1: [{ required: true, message: '请选择任务时间,并且时间之差不得超过30天', trigger: 'blur,change' }],
                    copyOto: [{ required: true, message: '请选择渠道（可多选）', trigger: 'blur,change' }],
                    copymodel: [{ required: true, message: '请选择金蓝标（可多选）', trigger: 'blur,change' }],
                    copyditch: [{ required: true, message: '请选择品牌或者区域', trigger: 'blur,change' }],
                    copyshop: [{ required: true, message: '请选择门店', trigger: 'change' }],
                    description: [{ required: true, message: '请输入任务描述', trigger: 'blur,change' }]
                },
                dataBack: {},
                shopData: []
            };
        },
        watch: {
            'formValidate.timeValue': function (e) {
                if (e[0] && e[1].getTime() / 1000 / 60 / 60 / 24 - e[0].getTime() / 1000 / 60 / 60 / 24 <= 30) {
                    this.formValidate.value1 = 'true';
                } else {
                    this.formValidate.value1 = null;
                }
            },
            'formValidate.shop': function (e) {
                if (this.formValidate.area === 'o57') {
                    this.$set(this.formValidate, 'copyshop', 'true');
                    return;
                }
                if (e[0]) {
                    this.formValidate.copyshop = 'true';
                } else {
                    this.formValidate.copyshop = null;
                }
            },
            'formValidate.ditch': function (newVal) {
                console.log('品牌：', newVal);
                if (newVal.length) {
                    this.ditchVal = [];
                    newVal.forEach((data) => {
                        console.log(data);
                        this.ditchVal.push(this.ditchList.find(item => item.value === data).label);
                    });
                    this.ditchVal = `[ ${this.ditchVal.toString()} ]`;
                    this.formValidate.copyditch = 'true';
                } else if (!this.formValidate.area) {
                    this.ditchVal = '';
                    this.formValidate.copyditch = '';
                }
            },
            'formValidate.area': function (newVal) {
                console.log('区域：', newVal);
                if (newVal) {
                    this.formValidate.copyditch = 'true';
                } else if (!this.formValidate.ditch.length) {
                    this.formValidate.copyditch = '';
                }
            }
        },
        computed: {
            hasChanged() {
                return this.$lodash.isEqual(this.formValidate, this.dataBack);
            },
            selectDitch() {
                let value = '';
                this.shopData = [];
                // const ditch = this.ditchList.find(item => item.value === this.formValidate.ditch);
                const area = this.areaList.find(item => item.value === this.formValidate.area);
                const shop = this.formValidate.shop.length;
                // if (ditch) {
                //     value += `[ ${ditch.label} ]`;
                // }
                if (area) {
                    value += `[ ${area.label} ]`;
                }
                if (shop) {
                    this.formValidate.shop.forEach((item) => {
                        this.shopData.push(this.shopList.find(item_2 => item_2.value === item).label);
                    });
                    value += `[ ${this.shopData.toString().replace(/\,/g, '，')} ]`;
                }
                return value.replace(/\[/g, '， [').replace(/\，/, '');
            }
        },
        components: {
            editTitle
        },
        created() {
            this.$https.analysisManagement.allQueryType().then((res) => {
                this.ditchList = res[0].data.data.map(item => ({ label: item.name, value: item.orgId }));
                this.areaList = res[1].data.data.map(item => ({ label: item.name, value: item.orgId }));
                this.areaList.unshift({ label: '选择区域', value: '0' });
            });
            // 线上 线下选择
            this.otoList = [
                { value: '线上', label: '线上' },
                { value: '线下', label: '线下' }
            ];
            // 金蓝标选择
            this.colorList = [
                { value: '金标', label: '金标' },
                { value: '蓝标', label: '蓝标' }
            ];

            const timer = this.$config.debounce_wait; // 节流的延迟时间
            this.changeStroeTime = this.$lodash.debounce(this.changeStroe, timer); // 门店接口延迟
        },
        mounted() {
            this.dataBack = this.$lodash.cloneDeep(this.formValidate);
        },
        methods: {
            cancel() {
                this.$emit('cancelCreatEvent', false);
            },
            /** 提交创建 */
            ok() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.saveBtnStatus = true;
                        const data = {
                            displayName: this.formValidate.code,
                            channel: this.formValidate.oto.toString(),
                            brand: '',
                            store: '',
                            area: '',
                            jlb: this.formValidate.model.toString(),
                            startTimeDay: this.$time(this.formValidate.timeValue[0]),
                            endTimeDay: this.$time(this.formValidate.timeValue[1]),
                            descriptions: this.formValidate.description
                        };
                        if (this.formValidate.ditch.length) { // 品牌
                            // this.formValidate.ditch
                            data.brand = this.formValidate.ditch.map(data => this.ditchList.find(item => item.value === data).label).toString();
                        }
                        if (this.formValidate.area) { // 区域
                            data.area = this.areaList.find(item => item.value === this.formValidate.area).label;
                        }
                        if (this.formValidate.shop.length) { // 门店
                            // this.formValidate.shop
                            data.store = this.shopData.toString();
                        }
                        this.$https.analysisManagement.addOrderAnalysis(data).then((res) => {
                            switch (res.data.success) {
                            case 'true':
                                this.saveBtnStatus = false;
                                this.$Message.destroy();
                                this.$Message.success(res.data.msg);
                                this.$emit('submitCreatEvent', res);
                                break;
                            default:
                                break;
                            }
                        })
                            .catch(() => {
                                this.saveBtnStatus = false;
                            });
                    }
                });
            },
            /** 品牌 */
            ditchChange() {
                if (this.formValidate.ditch === '0') this.formValidate.ditch = '';
                this.formValidate.shop = [];
                this.changeStroeTime();
            },
            /** 区域 */
            areaChange() {
                if (this.formValidate.area === '0') this.formValidate.area = '';
                this.formValidate.shop = [];
                this.changeStroeTime();
            },
            /** 门店 */
            shopChange() {
                if (this.formValidate.shop.length > 0) {
                    this.formValidate.copyshop = 'true';
                } else {
                    this.formValidate.copyshop = null;
                }
            },
            /** 线上线下 */
            otoChange(e) {
                if (e.length) {
                    this.formValidate.copyOto = 'true';
                } else {
                    this.formValidate.copyOto = undefined;
                }
                if (this.formValidate.oto.toString()) {
                    this.selectVal = `[ ${this.formValidate.oto.toString()} ]`;
                } else {
                    this.selectVal = '';
                }
                if (e.length === 1 && e[0] === '线上') {
                    console.log('login');
                    this.onLine = false;
                    this.formValidate.shop = [];
                } else {
                    this.onLine = true;
                }
            },
            /** 金蓝标 */
            optionChange(e) {
                if (e.length) {
                    this.formValidate.copymodel = 'true';
                } else {
                    this.formValidate.copymodel = undefined;
                }
                if (this.formValidate.model.toString()) {
                    this.jlbVal = `[ ${this.formValidate.model.toString()} ]`;
                } else {
                    this.jlbVal = '';
                }
            },
            /** 门店接口 */
            changeStroe() {
                // /**
                // 区域
                const areaObj = this.areaList.find(item => item.value === this.formValidate.area);
                // 品牌
                console.log(this.formValidate.ditch);
                const brandObj = this.formValidate.ditch.map(data => this.ditchList.find(item => item.value === data).label);

                let area; let brand;
                if (areaObj) {
                    area = areaObj.label;
                }
                if (brandObj) {
                    brand = brandObj.toString();
                }

                this.$https.analysisManagement.queryChannelOptions({
                    queryType: 'stroe',
                    brand,
                    area
                }).then((res) => {
                    this.shopList = res.data.data.map(item => ({ label: item.storeName, value: item.storeNo }));
                });
                // */
            },
            /** 表单验证触发 */
            formRules(prop, status, error) {
                console.log(prop, status, error);
            }
        }
    };
</script>

<style lang="less" scoped>
/deep/ .ivu-form-item-content{
  display: flex;
}

.pr20 {
  padding: 0;
}
</style>
