<template>
    <div class="channel-manage page-warpper">
        <div class="page-title bottom-shadow page-title-tab">
            <Menu class="pl24" mode="horizontal" theme="light" :active-name="activeName" @on-select="debounceTab">
                <MenuItem name="ChannelTable">渠道数据集</MenuItem>
                <MenuItem name="ChannelAssociated" v-role-button="`create_channel_mapping`">渠道关联</MenuItem>
            </Menu>
        </div>
        <div class="page-content page-content-tab container-padding24">
            <component :name="activeName" :is="activeName"></component>
        </div>
    </div>
</template>

<script>
    import ChannelTable from './ChannelTable.vue';
    import ChannelAssociated from './ChannelAssociated';

    export default {
        name: 'ChannelManage',
        data() {
            return {
                activeName: 'ChannelTable'
            };
        },
        created() {
            this.debounceTab = this.$lodash.debounce(this.tabChange, this.$config.debounce_wait);
        },
        mounted() {},
        methods: {
            tabChange(name) {
                this.activeName = name;
            }
        },
        watch: {},
        destroyed() {},
        components: {
            ChannelTable,
            ChannelAssociated
        }
    };
</script>

<style lang="less" scoped>

</style>
