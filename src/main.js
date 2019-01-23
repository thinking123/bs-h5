import "@babel/polyfill"
import './compatibility/flexible'
import './debug'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import routes from './router'
import store from './store'
import './assets/css/index.css'
import 'weui'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
    // mode: 'history',
    routes
})

router.beforeEach((pageTo, pageFrom, next) => {
    if (pageTo.path === '/') {
    }
    next()
})

router.afterEach((route) => {
    document.title = route.meta.title;
});

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
