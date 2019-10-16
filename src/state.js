
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={   //要设置的全局访问的state对象
    id: null, //要么电影id，要么电影院id
    cinemaName: '',//电影院名称
    movieName: '' //电影院名称
    //要设置的初始属性值
};
const mutations = {

    newid(state,id){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.id = id;
    },
    newcinemaName(state,cinemaName){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.cinemaName = cinemaName;
    },
    newmovieName(state,movieName){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.movieName = movieName;
    }
};
const actions = {

    getNewid(context,id){   //同上注释，num为要变化的形参
        context.commit('newid',id)
    },
    getNewcinemaName(context,cinemaName){   //同上注释，num为要变化的形参
        context.commit('newcinemaName',cinemaName)
    },
    getNewMovieName(context,MovieName){   //同上注释，num为要变化的形参
        context.commit('newmovieName',MovieName)
    }
};
const store = new Vuex.Store({
    state,
    mutations,
    actions
});
export default store;