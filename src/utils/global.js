const time = function (date) {
    const timeArr = date.toLocaleDateString().replace(/\//g, '-').split('-');
    for (const i in timeArr) {
        if (timeArr[i].length <= 1) {
            timeArr[i] = `0${timeArr[i]}`;
        }
    }
    return timeArr.join('-');
};

const kilobit = function (num) {
    return (num || 0) && num.toString(10).split('.')[0].split('').reduceRight((data, item) => {
        data = data[0] && data[0].length % 3 ? data : ['', ...data];
        data[0] = item + data[0];
        return data;
    }, []).join(',');
};
export {
    time,
    kilobit
};
