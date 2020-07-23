<template>
    <div>
        <template v-if="true">
            <Tooltip placement="top" transfer :content="configCon" :disabled="!showTooltip" :max-width="250" class="ivu-table-cell-tooltip">
                <span ref="content" @mouseenter="handleTooltipIn" @mouseleave="handleTooltipOut" class="ivu-table-cell-tooltip-content">{{ configCon }}</span>
            </Tooltip>
        </template>
        <span v-else>{{configCon}}</span>
    </div>
</template>

<script>
    export default {
        name: 'StrategyExpression',
        data() {
            return {
                configCon: '',
                showTooltip: false
            };
        },
        props: {
            configData: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        mounted() {
            this.setData();
        },
        methods: {
            handleTooltipIn() {
                const $content = this.$refs.content;
                this.showTooltip = $content.scrollWidth > $content.offsetWidth;
            },
            handleTooltipOut() {
                this.showTooltip = false;
            },
            setData() {
                let strategy = '';
                if (this.configData.data_type === 'Enum') {
                    if (this.configData.optional_config) { // 增加判断，防止数据问题。
                        const typeCode = this.configData.optional_config.value_type_code;
                        if (typeCode === 'input') {
                            strategy = `自定义：${this.configData.optional_config.values
                                ? this.configData.optional_config.values.join(',') : ''}`;
                        } else if (typeCode === 'Zodiac' || typeCode === 'ChineseZodiac') {
                            strategy = this.configData.optional_config.name;
                        }
                    } else {
                        strategy = '特性配置错误，没有配置枚举值';
                    }
                } else if (this.configData.time_line_config) {
                    const timeLineConfig = this.configData.time_line_config;
                    const captureType = {
                        Counter: '计数器',
                        Number: '数字'
                    };
                    const captureUnit = {
                        day: '天'
                    };
                    strategy = `记录最近${timeLineConfig.capture_date}${captureUnit[timeLineConfig.capture_unit]}的一个${captureType[timeLineConfig.capture_type]}类型的特性`;
                } else {
                    strategy = '无特殊配置';
                    if (this.configData.data_type === 'String') {
                        if (this.configData.format_limit_code) {
                            strategy = this.$config.status_config[this.configData.format_limit_code];
                        } else {
                            strategy = '不限';
                        }
                    }
                }
                this.configCon = strategy;
            }
        },
        watch: {
            configData: {
                handler() {
                    this.setData();
                },
                deep: true
            }
        }
    };
</script>
