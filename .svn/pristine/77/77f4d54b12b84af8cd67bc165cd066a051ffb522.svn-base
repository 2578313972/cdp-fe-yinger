import Vue from 'vue';
import date from 'dayjs';

function timeLize(val) {
    if (val) {
        return date(+val).format('YYYY-MM-DD HH:mm:ss');
    }
}

export default Vue.filter('timeLize', timeLize);
