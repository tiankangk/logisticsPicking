import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('view/login')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('view/home'),
            children: [
                {
                    path: '',
                    name: 'singleShopInfo',
                    component:() => import('components/singleShopInfo.vue')
                },
                {
                    path: 'variousShopInfo',
                    name: 'variousShopInfo',
                    component:() => import('components/variousShopInfo.vue')
                }
            ]
        },
        {
            path: '/order',
            name: 'order',
            component: () => import('view/order')
        },
        {
            path: '/singleOrder',
            name: 'singleOrder',
            component: () => import('view/singleOrder')
        }
    ]
});

router.beforeEach((to, from, next) => {
    let username = localStorage.getItem('username');
    console.log(username);
    if (username) {
        next();
    } else {
        if (to.path !== '/login') {
            next({ path: '/login' });
        } else {
            next();
        }
    }
})


export default router;
