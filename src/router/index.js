import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import HelloWorld from '@/components/HelloWorld'
import Order from '@/components/Order'
import Calculate from '@/components/Calculate'
import Sales from '@/components/Sales'
import Sns from '@/components/Sns'
import Kakao from '@/components/Kakao'
import CallOrder from '@/components/CallOrder'
import Search from '@/components/Search'
import Axios from 'axios'
import Product from '@/components/Product'
import DeliveryNum from '@/components/DeliveryNum'
Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/main',
            name: 'HelloWorld',
            component: HelloWorld,
            meta: {
            requireAuth: true
            }

        },
        {
            path: '/order',
            name: 'Order',
            component: Order,
            meta: {
            requireAuth: true
            }
        },
        {
            path: '/calculate',
            name: 'Calculate',
            component: Calculate,
            meta: {
            requireAuth: true
            }
        },
        {
            path: '/sales',
            name: 'Sales',
            component: Sales,
            meta: {
            requireAuth: true
            }
        },
        {
            path: '/sns',
            name: 'Sns',
            component: Sns,
            meta: {
            requireAuth: true
            }
        },
        {
            path: '/kakao',
            name: 'Kakao',
            component: Kakao,
            meta: {
            requireAuth: true
            }
        },
        {
            path: '/call',
            name: 'Call',
            component: CallOrder,
            meta: {
            requireAuth: true
            }
        },
        {
            path: '/search',
            name: 'Search',
            component: Search,
            meta: {
            requireAuth: true
            }
        },
        {
          path: '/delivery',
          name: 'Delivery',
          component: DeliveryNum,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/product',
          name: 'Product',
          component: Product,
          meta: {
            requireAuth: true
          }
        }
      ]
})

router.beforeEach((to, from, next) => {
    // to and from are both route objects
    let requireAuth = to.matched.some(record => record.meta.requireAuth)
    if(requireAuth) {
        Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
        Axios.get('https://bagcw.com/api/auth').then( (data) => {
            console.log(data)
            next()
        }).catch(function (error) {
            console.log(error);
            next('login')
        });
    } else {
        next()
    }
  })

  export default router
