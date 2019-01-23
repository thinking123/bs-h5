const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home')
// const Layout = import(/* webpackChunkName: "Layout" */ '../components/Layout')
import Layout from '../components/Layout'

export default [
    {
        path: '/', component: Layout,
        children: [
            {path: '/', redirect: {name: 'home'}},
            {path: '/home', name: 'home', component: Home}
        ]
    },
]
