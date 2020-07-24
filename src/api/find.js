export const find = function (arr, val, key) {
    if (key) {
        return arr.find(item => item.key === val);
    }else{
        return arr.find(item => item === val);
    }
};
export  const findIndex = function (arr, val, key) {
    if (key) {
        return arr.findIndex(item => item.key === val);
    }else{
        return arr.findIndex(item => item === val);
    }
}