<template>
    <Submenu v-if="!nameIsEmpty" :name="`${data.idx}`">
        <template v-if="data.name" slot="title">
            <!-- <div v-el-title="data.name"> -->
                <Icon v-if="hasIcon" :type="data.icon||'md-list-box'"></Icon><span>{{data.name}}</span>
            <!-- </div> -->
        </template>
        <template v-for="(item,index) in data.children">
            <router-link :key="index" :to="item.path" v-if="!item.children">
                <MenuItem v-el-title="item.name" v-if="item.name" :name="item.idx">{{item.name}}</MenuItem>
            </router-link>
            <ItemMenu v-else :key="index" :data="item"></ItemMenu>
        </template>
    </Submenu>
</template>

<script>
    export default {
        name: 'ItemMenu',
        data() {
            return {
                nameIsEmpty: false
            };
        },
        props: {
            hasIcon: Boolean,
            data: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        mounted() {
            // 隐藏超过N个外部链接的目录
            if (this.data.children && this.data.children.length && this.data.type === 'outer') {
                const nameIsEmpty = this.data.children.every(item => item.name === '');
                this.nameIsEmpty = nameIsEmpty;
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
