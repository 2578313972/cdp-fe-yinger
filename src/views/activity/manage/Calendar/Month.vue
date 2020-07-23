<template>
    <div class="month-calendar">
        <calendar :events="fcEvents" lang="zh"></calendar>
    </div>
</template>
<script>
    import calendar from 'vue-fullcalendar';

    const demoEvents = [{
        title: '一二三四五一二三四五一二三四五一二三四五',
        start: '2019-04-01',
        end: '2019-05-01',
        cssClass: 'family',
        YOUR_DATA: {}
    }, {
        title: 'event2',
        start: '2019-04-02',
        end: '2019-05-03',
        // cssClass: ['family', 'career'],
        YOUR_DATA: {}
    }, {
        title: 'event1',
        start: '2019-04-01',
        end: '2019-05-01',
        // cssClass: 'family',
        YOUR_DATA: {}
    }];

    export default {
        name: 'MonthCalendar',
        components: {
            calendar
        },
        data() {
            return {
                fcEvents: demoEvents
            };
        }
    };
</script>

<style>
.full-calendar-body .dates .dates-events .events-week .events-day {
    min-height: 110px;
    overflow: visible;
}
.full-calendar-body .dates .week-row .day-cell {
    min-height: 110px;
}
.full-calendar-body .dates .more-events {
    width: auto;
}
.full-calendar-body .dates .more-events .more-body .body-list .body-item {
    padding: 0 8px;
}
.full-calendar-body .dates .dates-events .events-week .events-day .event-box .family {
    background: rgb(154, 226, 95);
}
</style>
<style scoped>
.month-calendar {

}
</style>
