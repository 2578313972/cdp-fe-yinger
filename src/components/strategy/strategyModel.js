
import _ from 'lodash';

let _id_counter = 0;
class ExpressionObject {
    constructor({
        code, value, is_script, script, name, names, data_type, scope, scopes, source, res_type, data_type_limit
    }) {
        // scope是特性详情get到的当前特性的scope
        // scopes是传策略条件单选或多选的特性scope组合
        this.value = value || (code ? [code] : null);
        this.name = name || name;
        this.names = names || (this.name ? [this.name] : null);
        this.data_type = data_type;
        this.scope = scope;
        this.scopes = scopes || [scope];
        this.is_script = is_script;
        this.script = script;
        this.source = source || res_type || 'trait'; // TODO: 后面兼容人群。
        this.data_type_limit = data_type_limit; // 对象限制
    }

    isEqual(other) {
        if (!other) {
            return false;
        }
        if (!(other instanceof ExpressionObject)) {
            return false;
        }
        if (this === other) {
            return true;
        }

        if (!!this.is_script != !!other.is_script) {
            return false;
        }
        if (!_.isEqual(this.source, other.source)) {
            return false;
        }
        if (!_.isEqual(this.data_type, other.data_type)) {
            return false;
        }
        if (!_.isEqual(this.value, other.value)) {
            return false;
        }
        if (!!this.script && !!other.script) {
            const thisExpTmp = new Expression(this.script);
            const otherExpTmp = new Expression(other.script);
            const result = thisExpTmp.isEqual(otherExpTmp);
            if (!result) {
                return false;
            }
        }
        return true;
    }
}
class Expression {
    constructor(object, operation, params, result_type = null) {
        if (!object) {
            // 空创建
            this.id = `l_${_id_counter++}`;
            object = {};
            operation = {};
            params = [];
        }
        else if (!operation) {
            // 传递过来的是一个expression
            this.id = object.id || `l_${_id_counter++}`;
            operation = object.operation || {};
            params = object.params || [];
            result_type = object.result_type;
            object = object.object || {};
        } else {
            this.id = `l_${_id_counter++}`;
        }

        if (operation.has_more_operation) {
            // 说明选择了 一个需要主参作为表达式的算子。
            this.operation = new Operator({});
            this.result_type = this.operation.result_data_type || result_type;
            this.params = [];
            operation.has_more_operation = null;
            this.object = new ExpressionObject({
                source: 'script',
                is_script: true,
                data_type: operation.result_data_type,
                script: new Expression(object, operation, params)
            });
        } else {
            this.result_type = operation.result_data_type || result_type;
            this.object = object.is_script || object.source == 'script' ? new ExpressionObject({
                source: 'script',
                is_script: true,
                data_type: object.script.result_type || object.data_type,
                scopes: [object.scope],
                script: new Expression(object.script)
            }) : new ExpressionObject(object);
            this.operation = new Operator(operation);
            if (!!params && params.length > 0) {
                this.params = _.map(params, param => new Param(param));
            } else {
                this.params = [];
            }
        }
    }

    isEqual(other) {
        if (!other) {
            return false;
        }
        if (!(other instanceof Expression)) {
            return false;
        }

        if (this == other) {
            // 自己比较
            return true;
        }
        let result;


        // Object比较
        if (!!this.object != !!other.object) { // 存在性比较
            return false;
        }
        if (!!this.object && !!other.object) {
            result = this.object.isEqual(other.object);
            if (!result) {
                return false;
            }
        }

        // operator比较
        if (!!this.operation != !!other.operation) {
            return false;
        }
        if (!!this.operation && !!other.operation) {
            result = this.operation.isEqual(other.operation);
            if (!result) {
                return false;
            }
        }

        // params
        if (!!this.params != !!other.params) {
            return false;
        }
        if (this.params) {
            for (let i = 0; i < this.params.length; i++) {
                result = this.params[i].isEqual(other.params[i]);
                if (!result) {
                    return false;
                }
            }
        }
        return true;
    }

    check() {
        if (!this.object || !this.operation || !this.params) {
            return false;
        }

        if (this.object.is_script) {
            // 子表达式判断
            let result = true;
            if (!this.object.script || !this.object.data_type) {
                result = false;
            }
            if (!(this.object.script instanceof Expression)) {
                const scriptObj = new Expression(this.object.script);
                result = scriptObj.check();
            } else {
                result = this.object.script.check();
            }
            if (!result) {
                return false;
            }
        }
        else if (!this.object.value || !this.object.source || !this.object.data_type || !this.object.value[0]) {
            console.error('主参内容不完整', this.object);
            return false;
        }

        if (!this.operation.code) {
            return false;
        }

        if (this.operation.has_params && this.params.length < 1) {
            console.error('缺少参数', this.operation, this.params);
            return false;
        }

        for (const index in this.params) {
            const param = this.params[index];
            if (param.is_script) {
                if (!param.script) {
                    return false;
                }
                let result = true;
                if (param.script instanceof Expression) {
                    result = param.script.check();
                } else {
                    const scriptObj = new Expression(this.object.script);
                    result = scriptObj.check();
                }
                if (!result) {
                    return false;
                }
            }
            else if (!param.source || !param.value || !param.data_type || !param.value[0]) {
                console.error('参数错误内容', param);
                return false;
            }
        }
        return true;
    }
}

class Operator {
    code;

    data_type;

name;

const_value;

value;

source;

is_multiple;

has_params;

is_script;

result_data_type;

constructor({
    code, data_type, name, const_value, value, source, is_multiple, has_params, is_script, result_data_type
}) {
    this.code = code;
    this.data_type = data_type;
    this.name = name;
    this.const_value = const_value;
    this.value = value;
    this.source = source;
    this.is_multiple = is_multiple;
    this.has_params = has_params;
    this.is_script = is_script;
    this.result_data_type = result_data_type;
}

isEqual(other) {
    if (!other) {
        return false;
    }
    if (!(other instanceof Operator)) {
        return false;
    }
    if (this === other) {
        return true;
    }

    if (!_.isEqual(this.code, other.code)) {
        return false;
    }
    if (!_.isEqual(this.result_data_type, other.result_data_type)) {
        return false;
    }
    return true;
}
}

class Param {
    source;

data_type;

value;

name;

param_type;

is_multiple;

has_more_params;

is_script;

result_type;

script;

constructor({
    source, data_type, value, name, names, scopes, is_multiple, param_type, has_more_params, is_script, result_type, script
}) {
    this.source = source;
    this.data_type = data_type;
    this.value = value;
    this.name = name;
    this.names = names || [];
    this.scopes = scopes || [];
    this.param_type = param_type;
    this.is_multiple = is_multiple;
    this.has_more_params = has_more_params;

    // script
    this.result_type = result_type;
    this.is_script = is_script;
    if (is_script) {
        this.script = new Expression(script);
    }
}

isEqual(other) {
    if (!other) {
        return false;
    }
    if (!(other instanceof Param)) {
        return false;
    }
    if (this === other) {
        return true;
    }

    if (!!this.is_script != !!other.is_script) {
        return false;
    }
    if (!_.isEqual(this.source, other.source)) {
        return false;
    }
    if (!_.isEqual(this.data_type, other.data_type)) {
        return false;
    }
    if (!_.isEqual(this.value, other.value)) {
        return false;
    }
    if (!_.isEqual(this.param_type, other.param_type)) {
        return false;
    }
    if (!!this.is_multiple != !!other.is_multiple) {
        return false;
    }
    if (!!this.script && !!other.script) {
        const thisExpTmp = new Expression(this.script);
        const otherExpTmp = new Expression(other.script);
        const result = thisExpTmp.isEqual(otherExpTmp);
        if (!result) {
            return false;
        }
    }
    return true;
}
}

// 为啥要写这个
class TraitModel {
    constructor({
        code, calc_status, audit_status, catalog_id, template_code, creator, description, name, is_id, id,
        last_freeze_time, lifecycle_status, scope, tenant_id, data_type, user_count, visibility, group_id,
        strategies, last_active_time, last_update_time, lastSet_lifeCycle_time, user_info, group_info, format_limit_code,
        optional_config, time_line_config, owner, quoted_by_crowd, quote_trait, quoted_by_trait, last_set_lifecycle_time, org_hierarchy_id,
        cross_channel_auth_info
    }) {
        this.code = code;
        this.calc_status = calc_status;
        this.audit_status = audit_status;
        this.catalog_id = catalog_id;
        this.name = name;
        this.name = name;
        this.creator = creator;
        this.template_code = template_code;
        this.tenant_id = tenant_id;
        this.description = description;
        this.is_id = is_id;
        this.id = id;
        this.last_freeze_time = last_freeze_time;
        this.lifecycle_status = lifecycle_status;
        this.scope = scope;
        this.data_type = data_type;
        this.user_count = user_count;
        this.visibility = visibility;

        this.strategies = strategies;
        this.last_active_time = last_active_time;
        this.last_update_time = last_update_time;
        this.lastSet_lifeCycle_time = lastSet_lifeCycle_time;
        this.user_info = user_info;
        this.group_info = group_info;
        this.group_id = group_id;
        this.res_type = 'trait';
        this.format_limit_code = format_limit_code;

        this.time_line_config = time_line_config;
        this.optional_config = optional_config;
        this.owner = owner;
        this.quote_trait = quote_trait;
        this.quoted_by_crowd = quoted_by_crowd;
        this.quoted_by_trait = quoted_by_trait;
        this.last_set_lifecycle_time = last_set_lifecycle_time;
        this.cross_channel_auth_info = cross_channel_auth_info;
        this.org_hierarchy_id = org_hierarchy_id;
    }
}

class CrowdModel {
    constructor({
        id, code, crowd_code, name, owner, group_id, catalog_id, audit_status, crowd_scale, crowd_status, estimated_scale, biz_type, lifecycle_status, calc_status, update_time, already_have_portrait
    }) {
        this.id = id;
        this.code = code || crowd_code || id;
        this.name = name;
        this.owner = owner;
        this.catalog_id = catalog_id;
        this.group_id = group_id;
        this.audit_status = audit_status;
        this.crowd_scale = crowd_scale;
        this.crowd_status = crowd_status;
        this.estimated_scale = estimated_scale;
        this.biz_type = biz_type;
        this.lifecycle_status = lifecycle_status;
        this.calc_status = calc_status;
        this.update_time = update_time;
        this.already_have_portrait = already_have_portrait;
        this.res_type = 'crowd';
        this.data_type = 'Badge';
    }
}

export default {
    Expression,
    Operator,
    TraitModel,
    CrowdModel

};
