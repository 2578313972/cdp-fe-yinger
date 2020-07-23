const debouncePromise = function (inner, ms = 0) {
    let timer = null;
    let resolves = [];
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const result = inner(...args);
            resolves.forEach(r => r(result));
            resolves = [];
        }, ms);
        return new Promise(r => resolves.push(r));
    };
};

export default {
    debouncePromise
};
