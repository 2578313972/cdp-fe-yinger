<template>
    <div id="app">
        <router-view/>
        <Modal v-model="changeActiveModal" title="活动数据类型" @on-ok="ok" @on-cancel="cancel">
            <div style="height:100px;">
                <Select v-model="activeType" @on-change="changeActiveType">
                    <Option
                        v-for="item in activeTypeList"
                        :value="item.value"
                        :key="item.value">{{item.name}}</Option>
                </Select>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                changeActiveModal: false,
                activeType: localStorage.getItem('activeType') || 'general',
                activeTypeList: []
            };
        },
        mounted() {
            const _this = this;
            window.addEventListener('keydown', (ev) => {
                const result = _this.$config.login_info.menuListArr.some(item => item == '/depActivity' || item == '/activity');
                if (ev.ctrlKey && ev.shiftKey && ev.keyCode == 65 && result) {
                    _this.changeActiveModal = true;
                }
            });
            this.activeTypeList = Object.values(this.$activitySelct).map((item, index) => ({
                name: item.name,
                value: Object.keys(this.$activitySelct)[index]
            }));
        },
        methods: {
            changeActiveType(val) {
                this.activeType = val;
            },
            cancel() {
                this.changeActiveModal = false;
            },
            ok() {
                this.changeActiveModal = false;
                if (localStorage.getItem('activeType') !== this.activeType) {
                    localStorage.setItem('activeType', this.activeType);
                    window.location.reload();
                }
            }
        }
    // methods: {
    //     hashChangeHandler: function() {
    //         var target = window.location.hash;
    //         this.$router.push(target.substring(1, target.length));
    //     }
    // },
    // mounted: function() {
    //     // fix for IE 11
    //     if (!!window.MSInputMethodContext && !!document.documentMode) {
    //         window.addEventListener('hashchange', this.hashChangeHandler);
    //     }
    // },
    // destroyed: function() {
    //     // fix for IE 11
    //     if (!!window.MSInputMethodContext && !!document.documentMode) {
    //         window.removeEventListener('hashchange', this.hashChangeHandler);
    //     }
    // }
    };
</script>

<style lang="less">
.flex{display: flex;}
.borbox{box-sizing: border-box;}
</style>
