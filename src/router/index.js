import Layout from '../components/Layout'
import store from '../store'
const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home')
const ArrangementsInteract = () => import(/* webpackChunkName: "ArrangementsInteract" */ '../views/rhythm-select')
const MusicIndividuality = () => import(/* webpackChunkName: "MusicIndividuality" */ '../views/rhythm-share')
const Video = () => import(/* webpackChunkName: "Video" */ '../views/rhytem-video1')

export default [
    {
        path: '/', component: Layout,
        children: [
            {path: '/', redirect: {name: 'video'}},
            {path: '/home', name: 'home', component: Home,  meta: { title: '我的音乐人格' }},
            {path: '/video', name: 'video', component: Video,  meta: { title: '我的音乐人格' },beforeEnter: (to, from, next) => {
                    // ...
                    console.log(store.state.showVideo)
                    if(!store.state.showVideo){
                        console.log('go to home')
                        next({name:'home'})
                    }else{
                        console.log('play video')
                        next()
                    }
                }},
            {path: '/arrangements-interact', name: 'interact', component: ArrangementsInteract,  meta: { title: '我的音乐人格' }},
            {path: '/music-individuality', name: 'individuality', component: MusicIndividuality,  meta: { title: '我的音乐人格' }},
        ]
    },
]
