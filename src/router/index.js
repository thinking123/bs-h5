import Layout from '../components/Layout'
import store from '../store'
const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home')
const RhytemSelect = () => import(/* webpackChunkName: "RhytemSelect" */ '../views/rhythm-select')
const RhythmShare = () => import(/* webpackChunkName: "RhythmShare" */ '../views/rhythm-share')
const Video = () => import(/* webpackChunkName: "Video" */ '../views/rhytem-video')
const MusicTest = () => import(/* webpackChunkName: "MusicTest" */ '../views/MusicTest')

export default [
    {
        path: '/', component: Layout,
        children: [
            {path: '/', redirect: {name: 'test'}},
            {path: '/home', name: 'home', component: Home,  meta: { title: '我的音乐人格' }},
            {path: '/video', name: 'video', component: Video,  meta: { title: '我的音乐人格' }},
            {path: '/select', name: 'select', component: RhytemSelect,  meta: { title: '我的音乐人格' }},
            {path: '/share', name: 'share', component: RhythmShare,  meta: { title: '我的音乐人格' }},
            {path: '/test', name: 'test', component: MusicTest,  meta: { title: '我的音乐人格' }},
        ]
    },
]
