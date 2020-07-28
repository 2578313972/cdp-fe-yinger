<template>
<!-- 品牌、区域下拉框 -->
    <div class="BrandArea">
            <Row style="background:white;font-size:18px;font-weight:600;color:#000;display:flex">
                {{new Date | timeLize}}
                    <i-col class="borbox" style="padding-right:25px;">
                        <span>品牌</span>
                        <i-select
                            filterable
                            @on-change="ditchChange"
                            placeholder="请选择品牌"
                        >
                            <i-option
                            v-for="item in selects[0]"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</i-option>
                        </i-select>
                    </i-col>

                    <i-col class="borbox" style="padding-right:25px;">
                        <span>区域</span>
                        <i-select
                            filterable
                            @on-change="areaChange"
                            placeholder="请选择区域"
                        >
                            <i-option
                            v-for="item in selects[1]"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</i-option>
                        </i-select>
                    </i-col>

                    <!-- <i-col style="padding-right:25px;">
                        <span>门店</span>
                        <i-select
                            multiple
                            @on-change="shopChange"
                            placeholder="请选择门店"
                            v-model="queryChannelOptions.shop"
                            style="width:400px;"
                        >
                            <i-option
                            v-for="item in shopList"
                            :key="item.value"
                            :value="item.value"
                            >{{ item.label }}</i-option>
                        </i-select>
                    </i-col> -->
            </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selects: [],
                queryOptions: {
                    brand: '',
                    area: ''
                }
            };
        },
        created() {
            this.$https.analysisManagement.allQueryType().then((res) => {
                this.selects = res.map(data => data.data.data.map(item => ({ label: item.name, value: item.orgId })));
                this.selects[0].unshift({ label: '选择品牌', value: 0 });
                this.selects[1].unshift({ label: '选择区域', value: 0 });
            });
        },
        methods: {
            ditchChange(e) {
                console.log('品牌：', e);
            },
            areaChange(e) {
                console.log('区域：', e);
            },
            find(arr, val, key) {
                if (key) {
                    return arr.find(item => item.key === val);
                }
                return arr.find(item => item === val);
            }
        }
    };
</script>


/**
整体概览   百分位  fix（0）   图片 留padding   title delete第二个   数字加粗


 */
