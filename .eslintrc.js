module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb-base",
        "plugin:vue/essential",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "parser": "babel-eslint",
    },
    "plugins": [
        "vue",
    ],
    "rules": {
        'indent': ["off", 4],
        'vue/script-indent': ['error', 4, {
                'baseIndent': 1
            }
        ],
        "no-console": 'off',
        "no-debugger": 'off',
        // "no-tabs":"off",    // 5973
        "eqeqeq": "off",    // 263
        "vue/no-parsing-error": [2, {
            "x-invalid-end-tag": false
        }],                 // 312
        "camelcase": "off", // 189
        "max-len": "off", // 550
        // "max-len": ["error", { "code": 120 }],   // max-len标准
        // "no-unused-vars": "off",   // 210
        "no-param-reassign": "off", // 141 [不修改此规则]赋值给声明为函数参数的变量可能会引起误解，并导致混淆行为，因为修改函数参数也会使arguments对象变异。通常，对函数参数的赋值是意想不到的，并且指示错误或程序员错误
        // "no-mixed-spaces-and-tabs": "off", // 185
        "no-void": "off",   // 7
        // "no-undef": "off",  // 48
        "no-shadow": "off", // 45
        "import/no-unresolved": "off",  // 162
        "func-names": "off",    // 29
        "no-plusplus": "off",   // 33
        "consistent-return": "off", // 23
        "array-callback-return": "off", // 24
        "prefer-destructuring": "off",  // 3
        // "import/extensions": "off",     // 19
        "vue/no-use-v-if-with-v-for": "off", // 5
        "no-unused-expressions": "off", // 46
        "no-underscore-dangle": "off",  // 23
        // "no-mixed-operators": "off",    // 16
        "vue/no-side-effects-in-computed-properties": "off",  // 11
        "no-bitwise": "off",    // 11
        "no-empty": "off",  // 10
        "no-irregular-whitespace": "off",   // 6
        "import/no-extraneous-dependencies": "off", // 10
        // "default-case": "off",  // 14
        "no-useless-escape": "off", // 5
        "no-restricted-syntax": "off",  // 9
        "radix": "off", // 5
        "no-use-before-define": "off",  // 7
        // "no-lonely-if": "off",  // 2 
        "guard-for-in": "off",  // 6
        // "vue/no-unused-components": "off",  // 15
        "vue/valid-v-else-if": "off",   // 6
        // "no-prototype-builtins": "off", // 2
        "vue/require-v-for-key": "off", // 2
        "vue/require-valid-default-prop": "off",    // 7
        // "no-return-await": "off",   // 3
        // "vue/valid-v-else": "off",  // 1
        "import/no-named-as-default": "off",    // 5
        "import/no-named-as-default-member": "off", // 5
        "no-restricted-globals": "off", // 2
        "no-multi-assign": "off",   // 7
        "vue/return-in-computed-property": "off",  // 5
        "brace-style": "off",   // 4
        "no-nested-ternary": "off", // 3
        "comma-dangle": ["error", "never"],  //对象数组等后边补逗号，用不要，by 陈哥。
        // "function-paren-newline": "off",    // 1
        // "import/order": "off",  // 1
        // "vue/require-prop-type-constructor": "off", // 3
        "import/prefer-default-export": "off",  // 1 js文件可不需要 export default
        // "vue/no-unused-vars": "off",    // 1
        // "import/named": "off",  // 1
        // "no-new": "off",    // 1
        // "no-return-assign": "off",  // 1
        // "no-sequences": "off",  // 1
        // "no-script-url": "off", // 1
		// "comma-spacing": "off",		// 2
    }
};
