import Vue from 'vue';

// 数值千分位（整数类型）
function formatAmount(amount) {
    amount = amount.toString(10).split('.');
    const _int = amount[0].split('');
    let _num = '';
    for (let i = _int.length - 1, j = 1; i >= 0; i--, j++) {
        _num += _int[i];
        if (j % 3 === 0 && j < _int.length) {
            _num += ',';
        }
    }
    _num = _num.split('').reverse().join('');
    return _num;
}

export default Vue.filter('formatAmount', formatAmount);
