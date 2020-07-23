<template>
    <div class="inline">
        <Select class="w120" v-model="model_select" @on-change="changeVal">
            <Option
                v-for="(item,index) in itemData"
                :value="item.crowd_code"
                :key="index">
                {{item.name}}
            </Option>
        </Select>
    </div>
</template>

<script>
    export default {
        props: {
            itemData: { // list
                type: Array,
                default: []
            },
            mSelect: { // model
                type: String,
                default: ''
            },
            is_sub: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                model_select: ''
            };
        },
        methods: {
            changeVal(v) {
                this.$emit('trans', v);
            }
        },
        computed: {

        },
        watch: {
            mSelect(val) {
                this.model_select = val;
            }
        },
        components: {

        },
        mounted() {
            this.model_select = this.mSelect;
        }
    };
</script>

<style scoped lang="less">
    .inline{
        display: inline-block;
    }
    .w120{
        width: 120px;
    }
</style>
