/**
 * 权限校验：
 *  Vue Router中的 前置钩子函数 beforeEach(to, from, next)
 * 当进行路由跳转之前，进行判断 是否已经登录 过，登录过则允许访问非登录页面，否则 回到登录页
 *
 * to:  即将要进入的目标路由对象
 * from: 即将要离开的路由对象
 * next: 是一个方法，可以指定路由地址，进行路由跳转
 */
// 配置cookie
import cookie from 'vue-cookie'
import router from './router'
import Vue from 'vue'
//import {getUserInfo} from './api/login'

let vm = new Vue();

router.beforeEach((to, from , next) => {
    // 1. 获取token
    const token = cookie.get("Huangniuniu_TOKEN");

    if(!token) {
        // 1.1 如果没有获取到，
        // 要访问非登录页面，则不让访问，加到登录页面 /login
        if(to.path !== '/login') {
            //alert('为你跳转至登录界面')
            next({path: '/login'})
        }else {
            // 请求登录页面 /login
            next()
        }
    }else {
        // 1.2 获取到token,
        // 1.2.1 请求路由 /login ，那就去目标路由
        if(to.path === '/login') {
            next()
        }
        else {
            //更新浏览器的cookie时效
            vm.$http.get("/auth/verify").then(({data})=>{
                //console.log(data);
                next();
            }).catch(()=>{
                //跳转登录页
                next({path: '/login'})
            })

        }
    }


})