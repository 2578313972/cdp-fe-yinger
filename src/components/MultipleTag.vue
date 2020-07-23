<template>
    <div class="multiple-tag" :class="{'multiple-tag-select-box':isSelect}" @click.stop="clickbox">
        <formItem class="text-wrapper"
            :class="{'padding': hasEditIcon}"
            :label="labelName"
            :prop="formProp"
            :label-width="formLabelWidth"
             @mouseenter.native="mouseEnter"
             @mouseleave.native="mouseLeave">
            <div class="tag-wrapper"
                :style="{'min-width': tagWidth+'px','padding-left':type=='Time'?'3px':'5px'}"
                @click="activeText"
                @mouseenter="over"
                @mouseleave="leave()"
                :class="{'active':isActive && !hasEditIcon, 'hover':isHover, 'notHelp':!isShowTip, 'ivu-select-visible':isSelectUp, 'show-border': !isView}"
                ref="lblBox">
                <div class="test-width" ref="lblContent">{{getText}}</div>
                <span class="iplaceholder" v-show="!isView && showPlaceholder && type!=='Time'">{{tagPlaceholder}}</span><Tag ref="tagElement" v-for="(item, index) in initialTagArr" :key="index" :name="item" :closable="!isView" @on-close="handleClose(index)">{{item}}</Tag>
                <Input v-if="isView && !initialTagArr.length && type!=='Time'"
                    :readonly="true"
                    :placeholder="tagPlaceholder"
                    class="multiple-tag-text"
                    style="width: 50px"/>
                <TimePicker
                    v-if="type=='Time'"
                    :value="tagContent"
                    confirm
                    :editable="false"
                    class="inline"
                    @on-ok="timeOk"
                    @on-open-change="openChange"
                    @on-clear="clear"
                    Type="time"
                    placeholder="请选择时间"
                    @on-change="timeChange"
                    style="width:100px">
                </TimePicker>
                <InputNumber
                    class="multiple-tag-text"
                    v-model.number="numberContent"
                    v-else-if="!isView && number && showInput"
                    ref="txtKeyword"
                    @on-change="change"
                    @on-blur="blur"
                    @on-focus="focus"
                    @keydown.native.capture="keydown"
                    @input.native="keydown"
                    @compositionstart.native="compositionstart"
                    @compositionend.native="compositionend"
                    @keyup.native="keyup"
                    @onpaste.native="keydown"
                    :max="999999999999999"
                    />
                <Input class="multiple-tag-text"
                    v-model="tagContent"
                    v-else-if="!isView && showInput"
                    ref="txtKeyword"
                    @on-change="change"
                    @on-blur="blur"
                    @on-focus="focus"
                    @keydown.native.capture="keydown"
                    @input.native="input"
                    @onpaste.native="input"
                    @compositionstart.native="compositionstart"
                    @compositionend.native="compositionend"
                    @keyup.native="keyup"
                    :maxlength="48"/>

                <!-- isSelect == true时才生成 -->
                <i v-if="isSelect" class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
                <div v-show="isSelect" style="position:relative">
                    <transition :name="transitionType">
                        <ul ref="mslt" class="multiple-tag-select-box-list" v-show="!isView && showInput && isShow" >
                            <li class="multiple-tag-select-box-list-item"
                                v-for="text in itemsData" :value="text" :key="text"
                                :class="{'multiple-tag-select-box-list-item-selected':isSelectItem(text)}"
                                @click.stop="clickItem(text)">{{text}}</li>
                            <li class="multiple-tag-select-box-list-item multiple-tag-select-box-list-item-empty" v-show="isShowEmpty">无匹配数据</li>
                        </ul>
                    </transition>
                </div>
            </div>
            <span class="icon-wrapper" v-if="isShowTip || hasEditIcon">
                <Tooltip transfer v-if="isShowTip" class="tip" :content="tipContent" placement="bottom" max-width="200">
                    <span class="iconfont icon-action_help_outline"></span>
                </Tooltip>
                <span class="icon" v-if="hasEditIcon">
                    <span class="iconfont icon-content_create edit" v-if="isView && mouseIn" @click="edit"></span>
                    <span class="iconfont icon-nav_check confirm" v-if="!isView" @click="confirm"></span>
                    <span class="iconfont icon-nav_close cancel" v-if="!isView" @click="close"></span>
                </span>
            </span>
        </formItem>
    </div>
</template>
<script>
    import _ from 'lodash';

    export default {
        name: 'multipleTag',
        props: {
            hasEditIcon: {
                type: Boolean,
                default: false
            },
            isSelect: {
                type: Boolean,
                default: false
            },
            canKeyDel: {
                type: Boolean,
                default: false
            },
            maxTagNum: {
                type: Number,
                default: -1
            },
            filterWords: {
                type: String,
                default: ''
            },
            labelName: {
                type: String
            },
            formLabelWidth: {
                type: Number
            },
            isView: {
                type: Boolean,
                default: true
            },
            tagArr: {
                type: Array
            },
            tipContent: {
                type: String
            },
            isShowTip: {
                type: Boolean,
                default: false
            },
            formProp: {
                type: String
            },
            tagPlaceholder: {
                type: String,
                default: '请输入'
            },
            tagWidth: {
                type: Number,
                default: 150
            },
            number: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'text' // 因为时间历史的原因，number属性，应该混合到type属性中，因为number先有，就先不兼容
            },
            listData: { // 是select时才生效
                type: Array,
                default() {
                    return []; // ["文", "本"]
                }
            },
            customReg: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                sq: `M${Math.ceil(Math.random() * 10000000000)}`,
                isShow: false,
                isShowEmpty: false,
                transitionType: 'slide-up',
                inputChinese: false,
                showPlaceholder: true,
                tmpInputValue: '',
                tagContent: '',
                numberContent: null,
                isShowIcon: false,
                isActive: false, // 显示样式用，是否获取光标
                isHover: false, // 显示样式用，是否有光标移入
                isUp: false, // 是Select的时候,
                mouseIn: false // 鼠标移入时
            };
        },
        created() {
            // document.addEventListener('click', () => {
            //     this.hideDropDown();
            // });
        },
        mounted() {
            const _this = this;
            this.setWidth();
            this.showPlaceholderFn();

            this.isSelect && this.addEvent();

            this.$nextTick(() => {
                document.addEventListener('click', (ev) => {
                    // _this.hideDropDown();
                    !(_this.isClickSelf(ev.target)) && _this.hideDropDown();
                });
                document.addEventListener('mydomclick', (ev) => {
                    const data = ev.data || {};
                    const sq = data.sq;
                    _this.sq != sq && _this.hideDropDown();
                });
            });
        },
        computed: {
            hasIcon() {
                return !this.isView && this.showInput && this.isShowIcon;
            },
            initialTagArr() {
                return this.tagArr || [];
            },
            showInput() {
                return this.initialTagArr.length < this.maxTagNum || this.maxTagNum == -1;
            },
            itemsData() {
                return this.initListData();
            },
            isSelectUp() {
                return this.isSelect && this.isUp;
            },
            getText() {
                return this.number
                    ? (_.isNumber(this.numberContent) ? `${this.numberContent}` : null)
                    : this.tagContent;
            }
        },
        watch: {
            isView() {
                const _this = this;
                this.$nextTick(() => {
                    _this.setWidth();
                });
            },
            initialTagArr() {
                if (this.type != 'Time') {
                    this.showPlaceholderFn();
                }
                this.isSelect && this.addEvent();
            }
        },
        methods: {
            mouseEnter() {
                this.mouseIn = true;
            },
            mouseLeave() {
                this.mouseIn = false;
            },
            // 点击编辑按钮
            edit() {
                this.$emit('edit');
                this.$emit('change-status', false);
                this.$nextTick(function () {
                    this.activeText();
                    this.isActive = true;
                });
            },
            // 点击确认按钮
            confirm() {
                // if (this.customReg && !this.$config.reg_input.custom_allow_empty_reg.test(this.tagContent)) {
                //     this.$Message.destroy();
                //     this.$Message.error(this.$config.reg_input.custom_msg);
                //     return;
                // }
                this.tagContent = '';
                this.tagContent = this.tagContent.replace(' ', '');
                this.mouseIn = false;
                this.isActive = false;
                this.$emit('confirm', this.initialTagArr);
            },
            close() {
                this.tagContent = '';
                this.mouseIn = false;
                this.$emit('close', this.tagArr);
                this.$emit('change-status', true);
                this.isActive = false;
            },
            addEvent() {
                // 解决点击tag时不触发下拉的问题，只有select时才使用
                const elements = this.$refs.tagElement;
                this.isSelect && elements && elements.map((node) => {
                    node && node.$el && node.$el.removeEventListener('click', this.clickbox);
                    node && node.$el && node.$el.addEventListener('click', this.clickbox);
                });
            },
            isClickSelf(dom) {
                let node = dom;
                let isSelf = false;
                let maxLoopCnt = 1000;
                if (node == null) {
                    return;
                }

                do {
                    if (/multiple\-tag/.test(node.className)) {
                        isSelf = true;
                        break;
                    }
                    maxLoopCnt--;
                    node = node.parentNode;
                }
                while (node && node.nodeName && node.nodeName.toUpperCase() != 'HTML' && maxLoopCnt > 0);
                return isSelf;
            },
            clickbox() {
                this.toggleDropDown();
                this.activeText();

                // 事件派发，解决点击相同控件间，之前的控件没有被收起的问题
                const evt = document.createEvent('Event');
                evt.initEvent('mydomclick', true, true);
                evt.data = {
                    sq: this.sq
                };
                document.dispatchEvent(evt);
            },
            toggleDropDown() {
                this.isShow ? this.hideDropDown() : this.showDropDown();
            },
            hideDropDown() {
                // const msltElement = this.getListElement();
                // msltElement && (msltElement.style.display = 'none');
                this.isUp = false;
                this.isShow = false;
            },
            showDropDown() {
                // const msltElement = this.getListElement();
                // msltElement && (msltElement.style.display = 'block');
                this.isUp = true;
                this.isShow = true;
            },
            isSelectItem(text) {
                const selecteds = this.initialTagArr;
                if (selecteds.indexOf(text) > -1) {
                    return true;
                }
                return false;
            },
            clickItem(text) {
                const selecteds = this.initialTagArr;
                const index = selecteds.indexOf(text);
                if (index > -1) {
                    this.tagArr.splice(index, 1);
                } else if (this.showInput) {
                    this.tagArr.push(text);
                }
                this.tagContent = '';

                const tagArr = this.$lodash.cloneDeep(this.initialTagArr);
                this.changeTag(tagArr);
            },
            getListElement() {
                return this.$refs.mslt;
            },
            initListData() {
                const initData = this.listData || [];
                const context = this.tagContent;
                const data = [];
                initData.map((text) => {
                    if (text.indexOf(context) > -1) {
                        data.push(text);
                    }
                });
                if (data.length == 0) {
                    this.isShowEmpty = true;
                } else {
                    this.isShowEmpty = false;
                }
                return data;
            },
            sltContentChange() {
                this.initListData();
            },
            // 关闭标签
            handleClose(index) {
                const tagArr = this.$lodash.cloneDeep(this.initialTagArr);
                tagArr.splice(index, 1);
                this.changeTag(tagArr);
                this.showPlaceholderFn();
                this.showPlaceholderFn(tagArr);
            },
            leave() {
                !this.isView && (this.isHover = false);
            },
            over() {
                !this.isView && (this.isHover = true);
            },
            showPlaceholderFn(tagArr) {
                this.sltContentChange();
                if (this.inputChinese) {
                    return;
                }
                const arr = tagArr || this.initialTagArr;
                if (!!arr.length || !!this.tagContent || !!this.numberContent) {
                    this.showPlaceholder = false;
                } else {
                    this.showPlaceholder = true;
                }
            },
            blur() {
                setTimeout(() => {
                    this.showPlaceholderFn();
                    this.add();
                }, 850);
                !this.isView && (this.isActive = false);
            },
            focus() {
                this.showPlaceholderFn();
                !this.isView && (this.isActive = true);
            },
            change() {
                this.showPlaceholderFn();
                this.setWidth();
            },
            input() {
                this.showPlaceholderFn();
                this.showDropDown();
            },
            compositionstart() {
                this.inputChinese = true;
                this.showPlaceholder = false;
            },
            compositionend() {
                this.inputChinese = false;
                this.showPlaceholderFn();
            },
            keydown(ev) {
                this.showPlaceholderFn();
                const value = ev.target.value;
                this.tmpInputValue = value;
            },
            keyup(ev) {
                const reg = new RegExp(`[${this.filterWords}]`, 'g');
                this.tagContent = this.tagContent.replace(reg, '');
                this.showPlaceholderFn();
                const value = ev.target.value;
                // 当输入框已经没有内容时，按下回退键，若有标签存在，则进行删除最后一个
                if (ev.keyCode == 8
                    && value === ''
                    && this.tmpInputValue === ''
                    && this.initialTagArr.length > 0
                    && this.canKeyDel) {
                    this.handleClose(this.initialTagArr.length - 1);
                    this.setWidth();
                } else if (ev.keyCode == 13) {
                    this.add();
                }
            },
            timeChange(value) {
                this.tagContent = value;
            },
            clear() {
                this.tagContent = '';
            },
            openChange(isOpen) {
                !isOpen && this.timeOk();
            },
            timeOk() {
                this.add();
            },
            // 添加标签
            add() {
                const content = this.number
                    ? (_.isNumber(this.numberContent) ? `${this.numberContent}` : null)
                    : this.tagContent;
                if (content) {
                    if (this.maxTagNum) {
                        if (this.customReg && !this.$config.reg_input.custom_allow_empty_reg.test(content)) {
                            this.$Message.destroy();
                            this.$Message.error(this.$config.reg_input.custom_msg);
                            return;
                        }
                        if (this.initialTagArr.length < this.maxTagNum || this.maxTagNum == -1) {
                            const tagArr = this.$lodash.cloneDeep(this.initialTagArr);

                            // 程序中止
                            if (tagArr.indexOf(content) != -1) {
                                this.$Message.warning(`【${content}】已经存在`);
                                this.setEmpty();
                                return;
                            }

                            tagArr.push(content);
                            this.changeTag(tagArr);

                            this.setEmpty();
                        } else {
                        // this.$Message.warning(`最多添加${this.maxTagNum}个`);
                        }
                    }
                }
            },
            changeTag(tagArr) {
                this.$emit('change-tag', tagArr || this.initialTagArr);
            },
            setEmpty() {
                this.tagContent = '';
                this.$nextTick(() => {
                    this.numberContent = null;
                    this.setWidth();
                });
            },
            activeText() {
                if (this.$refs.txtKeyword == null) {
                    return;
                }
                // this.$refs.txtKeyword && this.$refs.txtKeyword.focus();
                // this.$refs.txtKeyword && this.$refs.txtKeyword.$el && this.$refs.txtKeyword.$el.focus();
                const dom = this.findDom(this.$refs.txtKeyword.$el, 'input');
                dom && dom.focus();
            },
            findDom(dom, tagName) {
                if (dom == null || dom.childNodes == null) {
                    return null;
                }
                const nodes = dom.childNodes;
                let node = null;
                let result = null;
                for (let mi = 0; mi < nodes.length; mi++) {
                    node = nodes[mi];
                    if (node.nodeName && node.nodeName.toLocaleUpperCase() == tagName.toLocaleUpperCase()) {
                        return node;
                    } if (node.childNodes.length > 0) {
                        result = this.findDom(node, tagName);
                        if (result != null) {
                            return result;
                        }
                    }
                }
            },
            setWidth() {
                if (!this.$refs.txtKeyword) {
                    return;
                }

                this.$nextTick(() => {
                    // const boxDom = this.$refs.lblBox;
                    const testDom = this.$refs.lblContent;
                    const txtDom = this.$refs.txtKeyword.$el;
                    // const boxSize = boxDom.getBoundingClientRect();
                    const testSize = testDom.getBoundingClientRect();
                    const minWidth = 50;
                    const offet1 = 28;
                    // const offet2 = 10;
                    let size = testSize.width + offet1;
                    size = size < minWidth ? minWidth : size;

                    // 在特性创建时，写的内容特别多的时候会不够，显示的字看不全，再加是输入的最大字数本来已经有限制，且目前都能放的下，所以下面这句注释掉了, 2019.11.14 update ywchen
                    // size = size > (boxSize.width - offet2) ? boxSize.width - offet2 : size;
                    txtDom.style.width = `${size}px`;
                });
            },
            // 隐藏输入框
            cancel() {
                const _this = this;
                this.tagContent = '';
                this.numberContent = null;
                this.$nextTick(() => {
                    _this.setWidth();
                });
            }
        }
    };
</script>

<style lang="less">
    .multiple-tag {
        .ivu-form-item-label {
            font-family: 'PingFangSC-Medium', sans-serif;
            color: #17233D;
        }
        // 重写时间控件样式
        .ivu-date-picker{
            .ivu-input{
                height: 26px;
                box-shadow:0 0 0 rgba(45,140,240,.2) !important;
                border-width:0px;
            }
            .ivu-input-icon{
                height: 26px;
                line-height: 26px;
            }
        }

        .multiple-tag-text{
            & input{
                background: transparent;
            }
            height:24px !important;
            border: 0px solid #dcdee2 !important;
            box-shadow:0 0 0 rgba(45,140,240,.2) !important;
        }
        .multiple-tag-text input{
            padding: 4px 8px;
            vertical-align:top;
            border: 0px solid #dcdee2 !important;
            outline: none;
            box-shadow:0 0 0 rgba(45,140,240,.2);
            height:24px;
        }
        .multiple-tag-text input:focus{
            outline: none;
            box-shadow:0 0 0 rgba(45,140,240,.2);
        }
    }
    .mutiple-tag .ivu-form-item-content{
        line-height: 28px;
    }
</style>
<style lang="less" scoped>
.multiple-tag {
    .multiple-tag-select-box-icon{
        display: none;
    }
    &.multiple-tag-select-box{
        display: block;
        .multiple-tag-select-box-list{
            // display: none;
            position: absolute;
            top: 0px;
            min-width: 100%;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            max-height: 200px;
            overflow: auto;
            margin: 5px 0;
            padding: 5px 0;
            background-color: #fff;
            box-sizing: border-box;
            border-radius: 4px;
            z-index: 900;
            .multiple-tag-select-box-list-item{
                user-select: none;
                margin: 0;
                line-height: normal;
                padding: 7px 16px;
                clear: both;
                color: #515a6e;
                font-size: 12px!important;
                white-space: nowrap;
                list-style: none;
                cursor: pointer;
                transition: background .2s ease-in-out;
                &:hover{
                    background: #f3f3f3;
                }
                &.multiple-tag-select-box-list-item-selected{
                    color: #2d8cf0;
                }
            }
            .multiple-tag-select-box-list-item-empty{
                cursor: text;
                text-align: center;
                color: #c5c8ce;
                &:hover{
                    background: #fff;
                }
            }
        }
    }
    .padding {
        padding-right: 110px;
    }
    .text-wrapper{
        margin: 0px 20px 0 0;
        white-space: nowrap;
        .tag-wrapper {
            position: relative;
            line-height: 27px;
            vertical-align: top;
            border: 1px solid #fff;
            padding-right: 4px;
            padding-bottom: 3px;
            padding-left: 5px;
            margin-right: 40px;
            display: inline-block;
            background: #fff;
            cursor: text;
            box-sizing: border-box;
            border-radius: 4px;
            white-space: normal;
            transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
            .test-width{
                padding: 5px 8px;
                position: fixed;
                left: -9999px;
                top: -9999px;
                white-space: pre-wrap;
                display: inline-block;
                border: 1px solid red;
            }
            .ivu-tag {
                // height: auto;
                // margin: 0;
                // margin-left: 4px;
                line-height: 22px !important;
                margin: 2px 4px 0 0 !important;
            }
            &.active{
                border-color: #2185f0;
                box-shadow: 0 0 0 1px rgba(33,133,240,.9);
            }
            &.hover{
                border-color: #4d9df3;
            }
            &.notHelp{
                margin-right: 0px;
            }
            .iplaceholder{
                position: absolute;
                width: 100px;
                left: 14px;
                top: 2px;
                color: #ccc;
            }
            .multiple-tag-text {
                width: 100px;
            }
        }
        .show-border {
            border-color: #dcdee2;
        }
        .icon-wrapper {
            cursor: pointer;
            position: relative;
            z-index: 99;
            vertical-align: top;
            margin-left: -40px;
            padding-left: 40px;
            .icon {
                .iconfont {
                    margin-left: 4px;
                    &:hover {
                        color: #2d8cf0;
                    }
                }
            }
        }
    }
}
</style>
