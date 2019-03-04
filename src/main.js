import "@babel/polyfill"
// import "./lib/jweixin"
import './compatibility/flexible'
// import './compatibility/faskclick'
import './debug'
import 'weui/dist/style/weui.min.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import routes from './router'
import store from './store'
import './assets/css/index.css'
import 'weui'
// import Mint from 'mint-ui';
// Vue.use(Mint);

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
    // mode: 'history',
    routes
})

router.beforeEach((pageTo, pageFrom, next) => {

    // console.log('store.state' , store.state)
    // if(store.state.showVideo){
    //     console.log('rep')
    //     return next({name:'video'})
    // }

    let {openid,headimgurl,nickname,sex , rand} = pageTo.query
    if(rand){
        console.log('从分享页进入' , pageTo.query)
        next({name:'music-individuality' , query : pageTo.query})
        return
    }
    if(openid){
        store.commit('setopenid' , openid)
        store.commit('setheadimgurl' , headimgurl)
        store.commit('setnickname' , nickname)
        store.commit('setsex' , sex)
        console.log('从微信授权返回' , pageTo.query)
        next({name:'home'})

        return
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
