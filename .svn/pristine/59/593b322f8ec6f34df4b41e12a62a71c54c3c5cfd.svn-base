<template>
    <div class="event-content">
        <Menu
            class="pl24 bottom-shadow"
            mode="horizontal"
            theme="light"
            :active-name="activeName"
            @on-select="debounceSelect">
            <MenuItem
                v-for="(item,index) in tabList"
                v-role-button="`${item.type}_tab`"
                :key="index" :name="`${item.name}`">
                {{item.value}}
            </MenuItem>
        </Menu>
        <div class="tab-content">
            <component :is="activeName"></component>
        </div>
    </div>
</template>

<script>
    import Content from './EventContent.vue';
    import Attribute from './EventAttribute.vue';

    export default {
        data() {
            return {
                activeName: 'Content',
                tabList: [
                    {
                        value: '事件',
                        name: 'Content',
                        type: 'event'
                    },
                    {
                        value: '属性',
                        name: 'Attribute',
                        type: 'event_property'
                    }
                ],
                isDisable: 'event',
                debounceSelect: null
            };
        },
        methods: {
            handleSelect(currentName) {
                this.activeName = currentName;
            }
        },
        components: {
            Content, // 事件tab
            Attribute // 属性teb
        },
        created() {
            this.debounceSelect = this.$lodash.debounce(this.handleSelect, this.$config.debounce_wait);
        }
    };
</script>

<style scoped lang="less">
    .event-content {
        position: relative;
        height: 100%;
        .tab-content {
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: hidden;
        }
    }
</style>
