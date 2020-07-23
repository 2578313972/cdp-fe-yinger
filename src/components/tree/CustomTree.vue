<template>
    <div class="tree" id="cusTree" :ref="treeId">
        <Tree
            :data="data"
            :empty-text="noData"
            :load-data="loadData"
            :render="renderTree"
            @on-toggle-expand="toggleExpand">
        </Tree>
    </div>
</template>
<script>
    import tree from './tree';
    import roleMixin from '@/mixin/role-mixin';

    export default {
        name: 'CustomTree',
        mixins: [tree, roleMixin],
        props: {
            loadData: {
                type: Function,
                default() {
                    return (item, cb) => {
                        cb();
                    };
                }
            }
        },
        data() {
            return {
                treeId: `tree_${Math.ceil(Math.random() * 100000000)}`
            };
        },
        methods: {
            toggleExpand(data) {
                if (data && Object.prototype.hasOwnProperty.call(data, 'loading') && !data.expand) {
                    data.children = [];
                }
            }
        }
    };
</script>
<style lang="less">
@import "~@/assets/styles/tree.less";
.ivu-tree ul li{
    position: relative;
}
.ivu-tree ul li.before:before{
    position: absolute;
    top: -5px;
    font-size: 0px;
    content: " ";
    display: block;
    width: 100%;
    height: 0px;
    border-top: 2px #2D8CF0 solid;
}
.ivu-tree ul li.after:after{
    position: absolute;
    bottom: -5px;
    font-size: 0px;
    content: " ";
    display: block;
    width: 100%;
    height: 0px;
    border-top: 2px #2D8CF0 solid;
}
</style>
