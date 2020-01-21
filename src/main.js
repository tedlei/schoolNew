import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/css/global.css'   // 全局样式
import {Api, mixins} from './mixin'
Vue.use(mixins);

Api.install.call(Vue);

new Vue({
    router,
    store,
    components: {App},
    template: '<App/>',
    ...Api
}).$mount('#app');
