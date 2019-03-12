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
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// import MusicPlay from './utils/MusicPlay'
import SoundPlay from './utils/SoundPlay'
import './assets/css/index.css'
import 'weui'
// import Mint from 'mint-ui';
// Vue.use(Mint);

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResource);
Vue.prototype.$sound = new SoundPlay()
Vue.use(MintUI)
//
// const soundlist = [
//     {'do'}
//     ]

const router = new VueRouter({
    // mode: 'history',
    routes
})
//
// window.onload = function () {
//     //alert($(window).height());
//     var u = navigator.userAgent;
//     if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
//     } else if (u.indexOf('iPhone') > -1) {//苹果手机
//                                           //屏蔽ios下上下弹性
//         $(window).on('scroll.elasticity', function (e) {
//             console.log('scroll.elasticity')
//             e.preventDefault();
//         }).on('touchmove.elasticity', function (e) {
//             console.log('scroll.touchmoveelasticity')
//             e.preventDefault();
//         });
//     } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
//     }
//     //预加载
//     // loading();
// }


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
            //不用返回的headurl，使用base64
            // store.commit('setheadimgurl' , headimgurl)
            store.commit('setnickname' , nickname)
            store.commit('setsex' , sex)
            console.log('从微信授权返回' , pageTo.query)
            next({name:'home' , replace: true})

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
