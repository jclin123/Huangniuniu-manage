
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={   //要设置的全局访问的state对象
    id: null,
    cinemaName: ''
    //要设置的初始属性值
};
const mutations = {

    newid(state,id){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.id = id;
    },
    newcinemaName(state,cinemaName){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.cinemaName = cinemaName;
    }
};
const actions = {

    getNewid(context,id){   //同上注释，num为要变化的形参
        context.commit('newid',id)
    },
    getNewcinemaName(context,cinemaName){   //同上注释，num为要变化的形参
        context.commit('newcinemaName',cinemaName)
    }
};
const store = new Vuex.Store({
    state,
    mutations,
    actions
});
export default store;