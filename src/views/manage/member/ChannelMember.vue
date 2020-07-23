<template>
<div class="page-warpper">
    <div class="page-title bottom-shadow page-title-tab">
        <Menu class="pl24" mode="horizontal" theme="light" :active-name="activeName" @on-select="debounceChange">
            <MenuItem
                v-for="(item, index) in tabList"
                :key="index"
                :name="item.name">
                {{item.label}}
            </MenuItem>
        </Menu>
    </div>
    <div class="page-content page-content-tab">
        <component isOrg :name="activeName" :is="activeName"></component>
    </div>
</div>
</template>
<script>
    import OperationGroup from '@/views/manage/authorization/group/Group.vue';
    import Specialist from '@/views/manage/authorization/Specialist.vue';

    export default {
        name: 'Group',
        components: {
            OperationGroup,
            Specialist
        },
        data() {
            return {
                activeName: 'OperationGroup',
                tabList: [{
                    label: '运营组管理',
                    name: 'OperationGroup'
                }, {
                    label: '成员管理',
                    name: 'Specialist'
                }]
            };
        },
        created() {
            const timer = this.$config.debounce_wait;
            this.debounceChange = this.$lodash.debounce(this.handleChange, timer);
        },
        methods: {
            handleChange(val) {
                this.activeName = val;
            }
        }
    };
</script>
<style lang="less" scoped>

</style>
