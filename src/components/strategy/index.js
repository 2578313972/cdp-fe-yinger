import Vue from 'vue';
import ExpressControl from './ExpressControl';
import StrategyModel from './strategyModel';
import ParamsSelector from './ParamsSelector';
import TraitInput from './TraitInput';
import OperatorSelector from './OperatorSelector';
import CustomInput from './CustomInput';
import Condition from './Condition';

Vue.component('ExpressControl', ExpressControl);
Vue.component('ParamsSelector', ParamsSelector);
Vue.component('TraitInput', TraitInput);
Vue.component('OperatorSelector', OperatorSelector);
Vue.component('CustomInput', CustomInput);
Vue.component('Condition', Condition);

export default {
    Expression: StrategyModel.Expression
};
