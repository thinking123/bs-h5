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
import VueResource from 'vue-resource'
import MusicPlay from './utils/MusicPlay'
import './assets/css/index.css'
import 'weui'
// import Mint from 'mint-ui';
// Vue.use(Mint);

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResource);
Vue.prototype.$music = MusicPlay
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
    let l = location;
    let h = l.href

    // alert(h)
    console.log('route 当前href' , h)
    const reg = /[?].*[#]/
    if(h.match(reg)){
        //微信分享信息

        // setTimeout(()=>{
        //     let r = l.href.replace(reg , '#')
        //
        //     console.log('r' , r)
        //     l.href = r
        //     return
        // } , 30000)



        let r = l.href.replace(reg , '#')

        console.log('r' , r)
        l.href = r
        return

    }else{
        let {openid,headimgurl,nickname,sex , rand} = pageTo.query
        // if(rand){
        //     console.log('从分享页进入' , pageTo.query)
        //     next({name:'share' , query : pageTo.query})
        //     return
        // }
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
    }



})

router.afterEach((route) => {
    // let l = location;
    // // //强制?#方式访问 以兼容微信分享
    // if (l.href.indexOf('?#') === -1) {
    //     location.href = l.origin + l.pathname + '?' + l.hash;
    //     console.log('b',location.href)
    //     return false;
    // }

    document.title = route.meta.title;
});

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')
