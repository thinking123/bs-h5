import Layout from '../components/Layout'

const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home')
const ArrangementsInteract = () => import(/* webpackChunkName: "Home" */ '../views/ArrangementsInteract')
const MusicIndividuality = () => import(/* webpackChunkName: "Home" */ '../views/MusicIndividuality')

export default [
    {
        path: '/', component: Layout,
        children: [
            {path: '/', redirect: {name: 'home'}},
            {path: '/home', name: 'home', component: Home,  meta: { title: '首页' }},
            {path: '/arrangements-interact', name: 'home', component: ArrangementsInteract,  meta: { title: '编曲互动页' }},
            {path: '/music-individuality', name: 'home', component: MusicIndividuality,  meta: { title: '音乐人格页' }},
        ]
    },
]
