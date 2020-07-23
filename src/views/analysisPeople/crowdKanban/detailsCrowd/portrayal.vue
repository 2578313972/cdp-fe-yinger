<template>
    <div class="portrayal">
        <Row class="padding16-18" style="background:white;font-size:18px;font-weight:600;color:#000">
            <i-col span="6" style="font-size:18px;font-weight:600;">
                <slot name="title"></slot>
            </i-col>
            <i-col span="5" offset="13" style="text-align:center;">
                <i style="font-weight:700;font-size:25px;margin-right:20px;cursor: pointer;" class="el-icon-download"></i>
                <i style="font-weight:700;font-size:25px;cursor: pointer;" class="el-icon-question"></i>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        mounted() {},
        methods: {}
    };
</script>
