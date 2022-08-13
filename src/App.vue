<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!-- <h1>Vuex</h1>
  <h1>{{ count }}</h1> -->
  <h1>{{ $store.state.count }}</h1>
  <h1>{{ $store.getters.double }}</h1>
  <button @click="$store.state.count++">按钮</button>
  <hr>
  Vuex模块
  <h1>A:模块：{{aCount}}</h1>
  <h1>A1:模块：{{$store.state.A.A1.count}}</h1>
  <button @click="$store.state.A.count++">按钮A:模块1</button>
  <br/>
  <button @click="$store.commit('A/add', 5)">按钮A:模块2</button>
  模块注册
  <h2>cc:{{$store.state.A.cc.count}}</h2>
  <button @click="$store.commit('A/cc/add', 5)">按钮Acc</button>

</template>

<script>
import { computed } from "vue";
import { useStore } from "@/vuex";
// import { useStore } from "vuex";
export default {
  name: "App",
  setup() {
    // Vue3 有个 composition api 的入口
    const store = useStore(); // 获取容器
    console.log('App',store );
    // 获取 Vuex 中的 count 的值
    // console.log("store.state.count", store.commit('add', 3));
    // setInterval(()=>{
    //   store.commit('add', 3)
    // }, 2000)
    // store.dispatch('asyncAdd', 13)
    // return {
    //   count: computed(() => store.state.count),
    // };
    return {
      aCount: computed(() => store.state.A.count)
    }

  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
