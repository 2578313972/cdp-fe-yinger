<template>
    <div class="analysisKanban">
      <div class="page-title bottom-shadow page-title-tab">
        <Menu class="pl24" mode="horizontal" theme="light" :active-name="1">
          <MenuItem :key="0" :name="1">营销人群分析看板</MenuItem>
        </Menu>
      </div>
      <div>
        <router-view />
      </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        components: {},
        created() {},
        mounted() {},
        methods: {}
    };
</script>
