import Layout from '../components/Layout'

const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home')
// const ArrangementsInteract = () => import(/* webpackChunkName: "Home" */ '../views/ArrangementsInteract/ArrangementsInteract')
const ArrangementsInteract = () => import(/* webpackChunkName: "Home" */ '../views/rhythm-select')
// const MusicIndividuality = () => import(/* webpackChunkName: "Home" */ '../views/MusicIndividuality/MusicIndividuality')
const MusicIndividuality = () => import(/* webpackChunkName: "Home" */ '../views/rhythm-share')

export default [
    {
        path: '/', component: Layout,
        children: [
            {path: '/', redirect: {name: 'individuality'}},
            {path: '/home', name: 'home', component: Home,  meta: { title: '首页' }},
            {path: '/arrangements-interact', name: 'interact', component: ArrangementsInteract,  meta: { title: '编曲互动页' }},
            {path: '/music-individuality', name: 'individuality', component: MusicIndividuality,  meta: { title: '音乐人格页' }},
        ]
    },
]
