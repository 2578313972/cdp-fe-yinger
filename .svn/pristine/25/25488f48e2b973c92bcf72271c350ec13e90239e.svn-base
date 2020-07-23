<template>
    <div class="calendar-list">
        <month v-if="calendarType === 'month'"></month>
        <year v-if="calendarType === 'year'"></year>
    </div>
</template>
<script>
    import Month from './Month.vue';
    import Year from './Year.vue';

    export default {
        name: 'CalendarList',
        components: {
            Month,
            Year
        },
        props: {
            calendarType: {
                type: String
            }
        }
    };
</script>
<style scoped>
</style>
