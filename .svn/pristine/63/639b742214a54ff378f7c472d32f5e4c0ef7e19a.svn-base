<template>
    <div id="app" class="container-min-width">
        <Row>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">概览页卡片</p>
                <view-card
                    numFontSize="40px"
                    fontWeight="normal"
                    showTitleTooltip
                    toolTipContent="这是提示内容"
                    :shadow="false"
                    align="center"
                    title="卡片标题"
                    :amount="123"
                    showActive
                    :activeNum="365"
                    :frozenNum="5123"
                ></view-card>
            </Card>
            </Col>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">特性发布对话框</p>
                <Button type="primary" @click="handlePublish">发布</Button>
                <Publish :isShow="this.isShowPublish" @publish="publishClick" @cancel="publishClick"></Publish>
            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">分页</p>
                <Pagination :total="104"></Pagination>
            </Card>
            </Col>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">操作详情下拉（发布/导出/激活/冻结/删除）</p>特性：
                <OperationList tabView="public" type="trait" pageType="list" :authorized="true"></OperationList>
                <br />人群：
                <OperationList tabView="public" type="crowd" pageType="list" :authorized="true"></OperationList>
            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">标签输入框</p>
                <Form v-on:submit.native="stopFormAction">
                    <multiple-tag
                        labelName="标签名："
                        :form-label-width="130"
                        :is-view="false"
                        :tag-arr="multipleArr"
                        isShowTip
                        canKeyDel
                        tipContent="提示内容"
                        :tag-width="300"
                        v-on:change-tag="changeTag"
                    ></multiple-tag>
                </Form>
            </Card>
            </Col>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">滑窗</p>
                <Button type="primary" @click="handleToggle">显示</Button>
                <Drawer v-model="showDrawer" width="500" :mask-closable="false">
                    <edit-title @cancel-click="close" @ok-click="close"></edit-title>
                </Drawer>
            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">确定取消输入框</p>
                <Form inline class="test-edit-input">
                    <edit-input
                        label="名称："
                        :max-length="20"
                        default-placeholder="请输入事件名称"
                        :content="content"
                        v-on:confirm-info="confirm"
                        :edit-show="editShow"
                        v-on:change-status="changeStatus"
                    ></edit-input>
                </Form>
            </Card>
            </Col>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">复制粘贴</p>
                <p>复制这句话</p>
                <Clipboard content="复制这句话"></Clipboard>
                <br />
                <Input style="width: 200px; margin-top: 16px;" />
            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">多选标签下拉列表</p>
                <button-select
                    btn-text="事件"
                    @on-select-change="onChange"
                    :tag-list="tags"
                    :data-list="options"
                ></button-select>
            </Card>
            </Col>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">文件树</p>
                <CustomTree
                    :data="treeData"
                    isShowAddIcon
                    isShowDelIcon
                    isShowEditIcon
                    :isShowNum="false"
                    v-on:add-tree-node="addTree"
                    v-on:remove-tree-node="removeTreeNode"
                ></CustomTree>
            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">特性选择面板</p>
                <TraitInput></TraitInput>
            </Card>
            </Col>
            <Col span="12" class="pad">
            <Card class="common-card" dis-hover>
                <p slot="title">策略组件</p>
                <!-- <Strategy isEdit @on-change="syChange"></Strategy> -->
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import ViewCard from '@/components/ViewCard';
    import Publish from '@/components/Publish';
    import Pagination from '@/components/Pagination';
    import OperationList from '@/components/OprationList';
    import MultipleTag from '@/components/MultipleTag';
    import EditTitle from '@/components/EditTitle';
    import EditInput from '@/components/EditInput';
    import Clipboard from '@/components/Clipboard';
    import ButtonSelect from '@/components/ButtonSelect';
    import CustomTree from '@/components/tree/CustomTree';
    import TraitInput from '@/components/strategy/TraitInput';
    // import Strategy from '@/components/condition/strategy';

    export default {
        name: 'app',
        components: {
            ViewCard,
            Publish,
            Pagination,
            OperationList,
            MultipleTag,
            EditTitle,
            EditInput,
            Clipboard,
            ButtonSelect,
            CustomTree,
            TraitInput
            // Strategy
        },
        data() {
            return {
                isShowPublish: false,
                checkedList: [],
                multipleArr: ['TD09089', 'TED14323'],
                showDrawer: false,
                content: '',
                editShow: true,
                tags: [],
                options: [
                    {
                        label: 'sunny',
                        value: 'sunny'
                    },
                    {
                        label: 'moon',
                        value: 'moon'
                    },
                    {
                        label: 'star',
                        value: 'star'
                    }
                ],
                treeData: [
                    {
                        name: '公共树节点',
                        id: 0,
                        expand: true,
                        children: [
                            {
                                name: '第一节',
                                id: 1,
                                children: []
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            handlePublish() {
                this.isShowPublish = true;
            },
            publishClick() {
                this.isShowPublish = false;
            },
            changeTag(values) {
                this.multipleArr = values.concat([]);
            },
            // 阻止表单默认提交刷新页面行为
            stopFormAction(e) {
                e.preventDefault();
            },
            handleToggle() {
                this.showDrawer = true;
            },
            close() {
                this.showDrawer = false;
            },
            confirm() {
                this.editShow = true;
            },
            changeStatus(status) {
                this.editShow = status;
            },
            onChange(value) {
                this.tags = value;
            },
            syChange() {

            },
            addTree(obj) {
                const { parent, data } = obj;
                const newId = parent.id + 1;
                this.$set(data, 'id', newId);
            },
            removeTreeNode(obj) {
                const { data, node, root } = obj;
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            }
        }
    };
</script>

<style lang="less">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    padding: 20px;

    .pad {
        padding: 6px;
    }

    .test-edit-input {
        .ivu-form-inline .ivu-form-item {
            display: inline-block;
        }

        .ivu-form-item-content {
            display: inline-block;
        }

        .edit-input .edit-input-btn {
            left: 166px;
        }
    }
}

.common-card {
    margin-bottom: 20px;
}

.ivu-drawer-body {
    padding: 0;
}
.mt10{
    margin-top: 10px;
}
.ivu-drawer-wrap .ivu-drawer-close {
    left: -25px;
    right: 0;
}

.ivu-drawer-close .ivu-icon-ios-close {
    font-size: 20px;
    color: #f8f8f9;
}
</style>
