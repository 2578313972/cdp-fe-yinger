<template>
    <el-select
        class="custom-select"
        v-model="value"
        :multiple="isMutiple"
        :multiple-limit="limitNum"
        filterable
        allow-create
        default-first-option
        no-data-text="暂无数据"
        @keyup.native="keyup"
        @keydown.native="keydown">
        <el-option
            v-for="item in options"
            :key="item"
            :value="item">
        </el-option>
    </el-select>
</template>
<script>
    export default {
        name: 'CustomSelect',
        props: {
            initVal: {
                type: Array,
                default: () => []
            },
            options: {
                type: Array,
                default: () => []
            },
            isMutiple: {
                type: Boolean,
                default: true
            },
            limitNum: {
                type: Number,
                default: 0
            },
            maxlength: {
                type: Number,
                default: 20
            }
        },
        data() {
            return {
                value: this.initVal
            };
        },
        watch: {
            value() {
                this.$emit('on-change', this.value);
            }
        },
        methods: {
            keyup(e) {
                const input = e.path[0];
                input.setAttribute('maxlength', this.maxlength);
            },
            keydown(e) {
                const input = e.path[0];
                input.setAttribute('maxlength', this.maxlength);
            }
        }
    };
</script>
<style lang="less">
.custom-select {
    width: 100%;
}
.el-select {
    .el-tag {
        padding: 0 8px;
        height: 24px;
        line-height: 22px;
        border: 1px solid #e8eaec;
        border-radius: 3px;
        background-color: #f7f7f7;
        cursor: pointer;
        color: #515a6e;
        i.el-icon-close {
            background-color: #f7f7f7!important;
        }
        i.el-icon-close::before {
            color: #666;
            opacity: 0.66;
            font-size: 17px;
        }
    }
    .el-tag__close.el-icon-close {
        right: -5px;
    }
}
.el-popper[x-placement^=top] {
    margin-bottom: 4px!important;
}
.el-popper[x-placement^=bottom] {
    margin-top: 4px!important;
}
.el-select-dropdown {
    .el-select-dropdown__item {
        font-size: 12px;
        height: 28px;
        line-height: 28px;
    }
    .el-select-dropdown__item.selected {
        font-weight: normal;
    }
    .popper__arrow {
        display: none;
    }
}
</style>
