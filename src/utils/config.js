const domain = window.location.hostname;
// 末尾不能加斜杠（/）,window.location.origin此属性不支持IE9
const apiDomain = {
    localhost: 'http://localhost:8080'
    // localhost: 'http://172.23.4.146'
    // localhost: 'http://52.82.42.134:50080'
    // localhost: "http://172.23.7.143:8008"
    // localhost: 'http://localhost:3000'
}[window.location.hostname]
    || `${window.location.protocol
    }//${
        window.location.hostname
    }${window.location.port == 80 ? '' : `:${window.location.port}`}`;

// 公用配置
const config = {
    // domain 配置
    domain,
    apiDomain: `${apiDomain}/cdp-web`,
    // 预设iframe个数
    iframeCount: 3,
    // 登录信息
    login_info: {},
    // 系统字典
    sys_config: {},
    throttle_wait: 200,
    debounce_wait: 400,
    // 键值状态字典
    status_config: {},
    // 分页入参
    table_page: {
        page: 1,
        size: 10
    },
    interactive_type: 0,
    // 系统名称正则限制（SMCERS-1336，【名称类放开对特殊符号输入限定】）
    reg_input: {
        msg: '',
        reg: /^.*$/,
        allow_empty_reg: /^.*$/,
        custom_msg: '只支持中英文、数字、下划线，请正确填写',
        custom_reg: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
        custom_allow_empty_reg: /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/
    },
    // 特性/人群分析-数字/标记、分类、是否、地址
    data_type_list: [
        'Number',
        'Badge',
        'Enum',
        'Bool',
        'String',
        'Date',
        'StringSet',
        'Address'
    ]
};

export default config;
