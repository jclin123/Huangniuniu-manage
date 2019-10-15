import Vue from "vue";
import Router from "vue-router";
import Login from './views/login'
import Layout from '@/components/Layout.vue'
import Home from './views/home'
import Member from './views/member'
import Supplier from './views/supplier'
import Goods from './views/goods'
import Staff from './views/staff'
import Usermanager from './views/usermanager'
import Actor from './views/actor'
import City from './views/city'
import Cinema from './views/cinema'
import Movie from './views/movie'
import Comment from './views/comment'
import Order from './views/order'
import Cnmvideos from './views/cnmvideos'
import Skedule from './views/skedule'
import Mvactors from './views/mvactors'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login', 
      component: Login 
    },
    {
      path: '/',
      name: 'layout', 
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: Home,
          meta: { title: '首页' }
        },
      ]
    },
    {
      path: '/layout',
      component: Layout,
      children: [
        {
          path: '/usermanager', 
          component: Usermanager,
          meta: { title: '用户管理' }
        },
        {
          path: '/actor', 
          component: Actor,
          meta: { title: '演员管理' }
        },
        {
          path: '/city',
          component: City,
          meta: { title: '城市管理' }
        },
        {
          path: '/cinema', 
          component: Cinema,
          meta: { title: '电影院管理' }
        },
        {
          path: '/cnmvideos',
          component: Cnmvideos,
          meta: { title: '电影院影库管理' }
        },
        {
          path: '/skedule',
          component: Skedule,
          meta: { title: '排场管理' }
        },
        {
          path: '/movie', 
          component: Movie,
          meta: { title: '电影管理' }
        },
        {
          path: '/mvactors', 
          component: Mvactors,
          meta: { title: '影片演员' }
        },
        {
          path: '/order',
          component: Order,
          meta: { title: '订单管理' }
        },
        {
          path: '/comment', 
          component: Comment,
          meta: { title: '评论管理' }
        },
        {
          path: '/member', 
          component: Member,
          meta: { title: '会员管理' }
        },
        {
          path: '/supplier',
          component: Supplier,
          meta: { title: '供应商管理' }
        },
        {
          path: '/goods',
          component: Goods,
          meta: { title: '商品管理' }
        },
        {
          path: '/staff',
          component: Staff,
          meta: { title: '员工管理' }
        }
      ]
    }
  ]
})
