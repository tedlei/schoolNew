import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    // 全局状态
    state: {
        updateUserInfo: false,
        messageSync: false,  // 点击头部消息列表时，控制消息界面消息的状态的同步
        headMessageSync: false  // 点击消息列表更改状态时，控制头部消息的状态的同步
    },
    // state更改api
    mutations: {
        changeUpdateUserInfo(state, newValue){
            state.updateUserInfo = newValue;
        },
        changeMessageSync(state, newValue){
            state.messageSync = newValue;
        },
        changeHeadMessageSync(state, newValue){
            state.headMessageSync = newValue;
        }
    },
    // store的计算属性
    getter: {},
    // 用于异步触发mutations里面的方法
    actions: {
        asyncTestChange(content, newValue){
            content.commit('testChange', newValue)
        }
    }
});

export default store
