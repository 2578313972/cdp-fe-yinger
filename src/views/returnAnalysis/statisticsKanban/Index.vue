<template>
  <div class="statisticsKanban">
    <div class="page-title bottom-shadow page-title-tab">
      <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
        <MenuItem :key="0" :name="1">回访统计看板</MenuItem>
      </Menu>
    </div>
    <div>
      <keep-alive include="Group">
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        components: {},
        created() {},
        mounted() {},
        methods: {}
    };
</script>
