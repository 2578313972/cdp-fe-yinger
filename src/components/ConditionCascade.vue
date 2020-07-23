<template>
    <div>
        <div :class="{'minWidth':!btnType}" class="condition-cascade ivu-select ivu-select-single ivu-select-default" ref="conditionBox"
            @mouseenter="over"
            @mouseleave="leave">
            <Dropdown trigger="custom" transfer transfer-class-name="condition-cascade condition-cascade-box" :visible="isShow" @on-visible-change="visibleChange" @on-clickoutside="clickoutside">

                <div :class="{'disabled':disabled,'inline-block':btnType}">
                    <div v-if="!btnType" class="trait-select-btn"
                        :class="{'active':isShow, 'hover':isHover&&!disabled, 'tag-input':true, 'ivu-select-visible':isShow}"
                        placeholder="请选择" style="width:100%;"  @click="onfocus">
                        <template v-if="isShowTag">
                            <Tag :closable="closable" v-for="(value ,index) in values" :key="index" @on-close="unSelectItem(value, index)">{{value.name}}</Tag>
                        </template>
                        <div class="placeholder" v-if="values.length == 0||!isShowTag">{{placeholder}}</div>
                        <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
                    </div>
                    <Button :disabled="disabled" :type="btnColor" class="trait-select-btn" v-else @click.stop="onfocus" icon="md-add">{{btnText}}</Button>
                </div>
                <DropdownMenu slot="list">
                <!-- <transition :name="transitionType"> -->
                    <div class="condition-cascade-list" v-bind:uid="_uid" ref="conditionList">
                        <div class="condition-search">
                            <Input class="mt10" v-model="searchName" @on-change="search" @keyup.native.enter="search" placeholder="请搜索">
                                <Button @click="search" slot="append" icon="ios-search"></Button>
                            </Input>
                            <div class="bread-crumb"  v-if="!searchName || searchName.length == 0">
                                <p>
                                    <span
                                        v-for="(item,index) in titleCatalog"
                                        :key="index"
                                        @click="breadChange(item,index)">
                                        {{item.name}} /
                                    </span>
                                </p>
                            </div>
                            <div class="catalog-box">
                                <!-- 目录部分 -->
                                <div v-if="!searchName || searchName.length == 0">
                                    <p :title="item.name" class="s-tag catalog-list"
                                        v-for="(item,index) in catalogParent"
                                        :key="index"
                                        @click="findCatalog(item)">
                                        <Icon type="ios-folder" style="margin-right:5px"/>
                                        {{item.name}}
                                    </p>
                                </div>
                                <!-- 人群部分 -->
                                <div class="tag-type-list">
                                    <div :class="{'select-item':item.select}" :title="item.name" class="s-tag"
                                        v-for="(item,index) in catalogChildExceptValues"
                                        :key="index"
                                        @click="curCatalog(item)">
                                        <i :class="{
                                            gray: isNormal(item),
                                            yellow: !isNormal(item)}"
                                            v-if="item.res_type=='crowd'"
                                            class="fa fa-user"></i>
                                        <!-- 事件或者(策略与计算结果同步时，是黑色) -->
                                        <i :class="{
                                            gray: item.calc_status=='normal' || isEvent(item),
                                            yellow: item.calc_status!='normal'}"
                                            v-else
                                            class="fa fa-circle"></i>
                                        <span>{{item.name}}</span>
                                    </div>
                                </div>
                                <Spin size="large" fix v-if="loading">
                                </Spin>
                            </div>
                        </div>
                    </div>
                <!-- </transition> -->
                </DropdownMenu>
            </Dropdown>
        </div>
        <div v-if="isShowTagList && values.length" class="mt16">
            <Tag class="mtb5 select-tag-list" :closable="closable" v-for="(value ,index) in values" :key="index" @on-close="unSelectItem(value, index)">{{value.name}}</Tag>
        </div>
    </div>
</template>

<script>

    import _ from 'lodash';

    const defaultRootCatalogTile = { name: '全部' };
    export default {
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            count: {
                type: [Number, String],
                default: Infinity
            },
            closable: {
                type: Boolean,
                default: true
            },
            btnColor: {
                type: String,
                default: 'default'
            },
            btnType: {
                type: Boolean,
                default: false
            },
            btnText: {
                type: String,
                default: '特性'
            },
            isShowTag: {
                type: Boolean,
                default: true
            },
            isShowTagList: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            loading: {
                type: Boolean,
                default: false
            },
            catalogParent: {
                type: Array,
                default() {
                    return [];
                }
            },
            catalogChild: {
                type: Array,
                default() {
                    return [];
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            // titleCatalog: {
            //     type: Array,
            //     default(){
            //         return []
            //     }
            // },
            // 选中的第一个条件
            mCheckedCon: {
                default: '',
                type: String
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                // transitionType: 'transition-drop',
                isHover: false, // 显示样式用，是否有光标移入
                catalogName: '',
                isShow: false,
                searchName: '',
                titleCatalog: [defaultRootCatalogTile],
                origonCatalogChild: []
            };
        },
        methods: {

            clickoutside(ev) {
                const isSelt = this.isClickSelf(ev.target);
                if (!isSelt) {
                    this.isShow = false;
                }
                console.log('clickoutside:', isSelt);
            },
            visibleChange(visible) {
                console.log('visible:', visible);
            },
            // 计算状态为normal时
            isNormal(item) {
                item = item || {};
                if ((item.calc_status == 'clean_success') || (item.calc_status == 'clean_failed') || (item.calc_status == 'calc_failed') || (item.calc_status == 'calc_success') || (item.calc_status == 'initial')) {
                    return true;
                }
                return false;
            },
            // 是否是事件属性
            isEvent(item) {
                item = item || {};
                if (/^event/.test(item.scope)) {
                    return true;
                }
                return false;
            },
            // 取消冒泡
            stopFn() {},
            leave() {
                this.isHover = false;
            },
            over() {
                this.isHover = true;
            },
            // 光标移入点击,emit打开初始化
            onfocus() {
                // 事件派发，解决点击相同控件间，之前的控件没有被收起的问题
                // const evt = document.createEvent('Event');
                // evt.initEvent('mydomclick', true, true);
                // evt.data = {
                //     uid: this._uid
                // };
                // document.dispatchEvent(evt);

                this.toggleDropDown();
                this.searchName = '';
                this.$emit('focusInit');
            },

            // 搜索条件
            search() {
                setTimeout(() => {
                    this.titleCatalog = [defaultRootCatalogTile];
                    this.$emit('searchCatalog', this.searchName);
                }, 400);
            },

            // 选中的条件
            curCatalog(item) {
                if (item.select) {
                    this.multiple && this.unSelectItem(item);
                } else if (this.values.length > this.count - 1) {
                    this.$Message.destroy();
                    this.$Message.error(`最多添加${this.count}个`);
                    return;
                }
                item.select = !item.select;
                if (this.multiple) {
                    const exist = _.find(this.values, value => value.code === item.code);
                    if (exist) {
                        return;
                    }
                    this.$emit('curChecked', [...this.values, item]);
                } else {
                    this.hideDropDown();
                    this.$emit('curChecked', [item]);
                }
                this.isHover = false;

            // this.catalogName = item.name||'';
            // if(item.crowd_code) this.catalogName = item.name;
            },
            unSelectItem(item) {
                const unSelectedValues = _.filter(this.values, value => value.code != item.code);
                this.$emit('curChecked', unSelectedValues);
            },
            // 查询下一级目录和人群
            findCatalog(item) {
                const hasSelectCatalog = _.find(this.titleCatalog, catalog => _.isEqual(item, catalog));
                if (hasSelectCatalog) {
                    this.emitFindCatalog('findCatalog', item);
                    return;
                }
                this.titleCatalog.push(item);
                this.emitFindCatalog('findCatalog', item);
            },

            // 触发目录查找的事件派发
            emitFindCatalog(eventType, data) {
                setTimeout(() => {
                    this.$emit(eventType, data);
                }, 100);
            },

            // 点击面包屑,返回当前id
            breadChange(obj, idx) {
                const selectCatalog = this.titleCatalog[idx];
                if (selectCatalog) {
                    this.titleCatalog = _.take(this.titleCatalog, idx + 1);
                    this.$emit('findCatalog', idx == 0 ? null : selectCatalog);
                    this.$emit('breadChange', { id: obj.id, index: idx });
                }
            },
            showDropDown() {
                this.titleCatalog = [defaultRootCatalogTile];
                const lastState = this.isShow;
                this.isShow = true;
                this.setStyle();
                this.$emit('on-show', true, lastState);
            },
            hideDropDown() {
                if (!this.isShow) {
                    return;
                }
                const lastState = this.isShow;
                this.isShow = false;
                this.$emit('on-show', false, lastState);
            },
            toggleDropDown() {
                this.isShow ? this.hideDropDown() : this.showDropDown();
            },
            setStyle() {
                // if (!this.isShow) return;
                // const boxElement = this.$refs.conditionBox;
                // const listElement = this.$refs.conditionList;
                // const contentElement = document.querySelector('.container-min-width');

                // const bsize = boxElement.getBoundingClientRect();
                // const lsize = listElement.getBoundingClientRect();
                // const csize = contentElement.getBoundingClientRect();

                // const lwid = lsize.width || 600; // 因为隐藏时不能计算出宽度
                // const cwid = csize.width;
                // const bleft = bsize.left;
                // const bwid = bsize.width;

                // if (cwid < (bleft + lwid + 20)) {
                //     // console.log(cwid ,bleft , lwid, "if")
                //     listElement.style.left = `${bwid - lwid}px`;
                // } else {
                //     // console.log(cwid ,bleft , lwid, "else")
                //     listElement.style.left = '0px';
                // }

                // const lheight = lsize.height || 310; // 因为隐藏时不能计算出高度
                // const cheight = csize.height;
                // const btop = bsize.top;
                // const bheight = bsize.height;

                // // console.log(lheight,cheight,btop,bheight);

                // if (cheight < btop + lheight + bheight + 10) {
                //     if (btop < lheight) {
                //         listElement.style.top = `${-btop + 60}px`;
                //     } else {
                //         listElement.style.top = `${-lheight}px`;
                //     }
                //     this.transitionType = 'slide-up';
                // } else {
                //     listElement.style.top = '35px';
                //     this.transitionType = 'transition-drop';
                // }
            },
            isClickSelf(dom) {
                let node = dom;
                let isSelf = false;
                let maxLoopCnt = 1000;
                if (node == null) {
                    return;
                }

                do {
                    if (/condition\-cascade\-list/.test(node.className)) {
                        isSelf = true;
                        break;
                    }
                    maxLoopCnt--;
                    node = node.parentNode;
                }
                while (node && node.nodeName && node.nodeName.toUpperCase() != 'HTML' && maxLoopCnt > 0);
                return isSelf;
            }
        },

        computed: {
            values() {
                return _.isArray(this.value) ? this.value : [this.value];
            },
            catalogChildExceptValues() {
                this.origonCatalogChild = this.catalogChild.map(item => ({
                    ...item,
                    name: item.name || item.name,
                    select: false
                }));

                this.origonCatalogChild.forEach((items) => {
                    this.values.forEach((item) => {
                        if (items.code == item.code) {
                            items.select = true;
                        }
                    });
                });

                return this.origonCatalogChild;
            }

        },

        watch: {
            mCheckedCon(v) {
                this.catalogName = v;
            }
        },

        components: {

        },

        mounted() {
            this.catalogName = this.mCheckedCon;
            // const _this = this;
            // this.$nextTick(() => {
            //     document.addEventListener('click', (ev) => {
            //         // _this.hideDropDown();
            //         !(_this.isClickSelf(ev.target)) && _this.hideDropDown();
            //     });
            //     document.addEventListener('mydomclick', (ev) => {
            //         const data = ev.data || {};
            //         const uid = data.uid;
            //         _this._uid != uid && _this.hideDropDown();
            //     });

            //     // 绑定缩放
            //     window.addEventListener('resize', this.setStyle);
            // });
        },

        destroyed() {
            // document.removeEventListener('click', () => {});
            // // 销毁后解绑resize事件
            // window.removeEventListener('resize', this.setStyle);
        }

    };
</script>
<style lang="less">

    .condition-cascade-box{
        max-height: 500px;
        width: 600px;
    }

    .condition-cascade{
        .ivu-dropdown-rel{
            display: inline-block;
        }
        &.minWidth{
            .ivu-dropdown-rel{
                display: block;
            }
        }
    }

    .tag-type-list{
        & i.fa{
            padding-right: 3px;
            color: #515a6e;

            // 人群用小人图标，特性用圆形；
            // 计算状态共有3种，正常--->黑色；  等待/正在计算--->黄色
            &.yellow{
                color: #ff9900;
            }
            &.gray{
                color: #515a6e;
            }
        }
        & i.fa-user{
            font-size: 14px;
            padding-right: 2px;
        }
    }
</style>

<style scoped lang="less">
    div.mtb5 {
        margin: 5px 10px 5px 0;
    }
    .ivu-icon,.ivu-icon::before{
        transition: all .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
    }
    .condition-cascade{
        &.minWidth{
            min-width: 222px;
        }
        display: block;
        position: relative;
        & .disabled{
            cursor: not-allowed;
            .trait-select-btn{
                background-color: #f3f3f3;
                pointer-events: none;
            }
        }
        & .inline-block{
            display: inline-block;
        }
        .condition-cascade-list{
            // position: absolute;
            // top: 36px;
            // z-index: 9;
            user-select:none;
        }
        .placeholder{
            color: #c5c8ce;
            padding: 6px 3px 0;
            font-size: 12px;
            display: inline-block;
        }
        .tag-input{
            border: 1px solid #dcdee2;
            background-color: #fff;
            border-radius: 4px;
            padding-left: 5px;
            min-height:  32px;
            padding-bottom: 3px;
            padding-right: 30px;
            cursor: pointer;
            transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
            .ivu-tag{
                /* 在策略中显示比其它组件高，所以去掉 */
                // margin: 4px 4px 0px 0!important;
                margin: 3px 4px 0 0 !important;
                // line-height: 22px !important;
            }
            &.active{
                border-color: #57a3f3;
                box-shadow: 0 0 0 2px rgba(45,140,240,.2);
            }
            &.hover{
                border-color: #57a3f3;
            }
        }
        .condition-search{
            // position: absolute;
            // top: 0px;
            // z-index: 100;
            // margin-bottom: 10px;
            width: 600px;
            // box-shadow: 0 0 4px #c5c8ce;
            padding: 0 10px;
            background: #fff;
            overflow: hidden;
            border-radius: 4px;
            font-size:12px;
            transition: height .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
            &.unactive{
                height: 0;
            }
            .bread-crumb{
                margin-top: 5px;
                line-height: 30px;
                padding: 0 10px;
                border-bottom: 1px #e8eaec solid;
                color: #17233d;
                font-weight: 500;
                overflow: hidden;
                color:#2b85e4;
                span{
                    cursor: pointer;
                }
            }
            .catalog-box{
                height: 220px;
                margin: 5px 0;
                overflow-y: auto;
                position: relative;
                .loader{
                    width: 30px;
                    height: 30px;
                    position: relative;
                    margin: 0 auto;
                    .circular{
                        animation: rotate 2s linear infinite;
                        animation: rotate 2s linear infinite;
                        height: 100%;
                        -webkit-transform-origin: center center;
                        transform-origin: center center;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        .path{
                            stroke-dasharray: 1,200;
                            stroke-dashoffset: 0;
                            -webkit-animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
                            animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
                            stroke-linecap: round;
                        }
                    }
                }
                .s-tag{
                    width: 31%;
                    display: inline-block;
                    border-radius: 2px;
                    padding: 4px 24px 4px 6px;
                    margin: 4px 0px 0 4px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    position: relative;
                    &.select-item:after{
                        font-family: Ionicons;
                        line-height: 1;
                        font-size: 24px;
                        content: '\F171';
                        color: rgba(45,140,240,.9);
                        position: absolute;
                        top: 2px;
                        right: 0px;
                        box-sizing: border-box;
                    }
                    &:hover{
                        background: #f3f3f3;
                        cursor: pointer;
                    }
                    &.select-item span{
                        color: #2d8cf0;
                    }
                }
                .catalog-list{
                    &:hover{
                        background: none;
                        cursor: pointer;
                        color: #2d8cf0;
                    }
                }
            }
        }
    }
</style>
