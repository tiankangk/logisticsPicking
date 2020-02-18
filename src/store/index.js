import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    username:'',
    userId:'',
    pickOrderCount:0
}
const mutations = {
    setUsername: (state, userInfor) => {
        state.username = userInfor.username;
        state.userId = userInfor.id;
        console.log(userInfor);
        localStorage.setItem('username',userInfor.username);
        localStorage.setItem('userId',userInfor.id);
        localStorage.setItem('mc',userInfor.mc);
    },
    setPickOrderCount:(state,count)=>{
        state.pickOrderCount = count;
    }
}
const getters = {
    getUsername: ()=> localStorage.getItem('username'),
    getUserId:()=> localStorage.getItem('userId'),
    getPickOrderCount: (state) => state.pickOrderCount
}

export default new Vuex.Store({
    state,
    mutations,
    getters
})