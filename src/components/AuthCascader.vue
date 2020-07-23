<template>
    <div class="auth-cascader" ref="authCascader">
        <div v-if="readonly || isReadonly">
            <Tooltip placement="bottom" :content="showValue" :max-width="250" :disabled="showValue.length<25">
                <Input readonly :value="showValue" />
            </Tooltip>
        </div>
        <Tooltip v-else-if="text" placement="bottom" :content="showValue" :max-width="250" :disabled="showValue.length<25">
            <span class="text">{{showValue}}</span>
        </Tooltip>

        <Tooltip v-else-if="!text && !readonly" placement="bottom" :content="showValue" :max-width="250" :disabled="showValue.length<25">
            <span class="hide" ref="hideNode">{{showValue}}</span>
            <Cascader
                v-model="value"
                :data="data"
                transfer
                change-on-select
                :clearable="clearable"
                @on-change="handleClick"></Cascader>
        </Tooltip>
    </div>
</template>
<script>
    export default {
        name: 'AuthCascader',
        props: {
            maxWidth: {
                type: Number,
                default: 500
            },
            data: {
                type: Array,
                default: []
            },
            initValue: {
                type: Array,
                default: []
            },
            isReadonly: {
                type: Boolean,
                default: false
            },
            text: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            showValue() {
                const _this = this;
                function dealData(arr) {
                    arr = arr || [];
                    let result = [];
                    arr.some((item) => {
                        const isFinded = _this.value.indexOf(item.value) > -1;
                        if (!isFinded) {
                            return false;
                        }
                        result.push(item.label);
                        result = result.concat(dealData(item.children));
                        return isFinded;
                    });
                    return result;
                }
                const val = dealData(this.data).join(' / ');
                return val;
            }
        },
        data() {
            return {
                value: [],
                readonly: false,
                roleKeys: ['readonly']
            };
        },
        mounted() {
            this.value = this.initValue; // 加这句因为下边的watch方法，如果initValue没有变化时就会导致空value.by pyz 2019-10-18.
            this.setWidth();
            window.addEventListener('resize', this.setWidth);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.chartResizeFn);
        },
        watch: {
            initValue() {
                this.$nextTick(() => {
                    this.value = this.initValue;
                });
            },
            showValue() {
                this.setWidth();
            }
        },
        methods: {
            handleClick(val, selectedData) {
                this.setWidth();
                this.$emit('change', val, selectedData);
            },
            setWidth() {
                this.$nextTick(() => {
                    // 选择框根据文本宽度自适应
                    const node = this.$refs.hideNode;
                    const box = this.$refs.authCascader;
                    const input = box && box.querySelector('.auth-cascader .ivu-input-wrapper input');
                    if (!node || !input) {
                        return;
                    }
                    const size = node.getBoundingClientRect();
                    const size2 = box.getBoundingClientRect();
                    const width = size.width + 46;
                    const maxWidth = size2.width; // = this.maxWidth
                    input.style.width = width <= maxWidth ? `${width}px` : `${maxWidth}px`;
                });
            }
            // handleTooltipIn(index, ev) {
            //     this.$nextTick(() => {
            //         const element = ev.target;
            //         this.isShowTooltip = element.scrollWidth > element.offsetWidth;
            //     });
            // }
        }
    };
</script>
<style lang="less">
.auth-cascader {
    position: relative;
    height: 32px;
    width: 100%;
    .ivu-tooltip {
        width: 100%;
    }
    .text {
        display: inline-block;
        line-height: 32px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .hide{
        position: absolute;
        left: -9999px;
        top: -9999px;
        opacity: 0;
    }
    .ivu-input-wrapper {
        input {
            border: none;
            padding-left: 0;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .ivu-cascader-rel {
        width: auto;
    }
    .ivu-cascader input.ivu-input[readonly]:focus {
        box-shadow: none;
    }
}
</style>
