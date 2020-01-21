import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/index'
import components_lzj from './router_lzj'
import components_lm from './router_lm'

Vue.use(Router);

let result = components_lzj.concat(components_lm);

const router =  new Router({
    routes: [
        // index 首页
        { path: '/', redirect: '/index' },
        { path: '/index',component: Index, props: true,
            children: result
        }
    ]
});

export default router;
