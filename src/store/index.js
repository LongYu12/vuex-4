import { createStore } from '../vuex/index'
// import { createStore } from 'vuex'

// ===========插件
function persistence(store) {
  let local = localStorage.getItem('VUEX$STATE')
  if (local) {
    store.replaceState(JSON.parse(local))
  }
  // 发布订阅模式 subscribe： 每当状态发生变化，则会执行此回调
  // mutation --- {type, preload}
  store.subscribe((mutation, state) => {
    localStorage.setItem('VUEX$STATE', JSON.stringify(state))
  })
}
// ==============

// actions 和 mutations 的区别， actions 的函数之执行后回返回一个 promise
const store = createStore({
  plugins: [ // 插件:安装插件注册的顺序依次执行插件，执行的时候会把 store 作为参数传递
    persistence
  ],
  strict: true, // 开启严格模式（默认不开启，开启后不允许用户非法操作状态，只能在 mutation 中修改状态，否则发生异常）
  state: { // 组件中的data
    count: 1
  },
  getters: { // 计算属性，但本次版本 Vuex4 并没有实现计算数学的功能
    double: function (state) {
      return state.count * 2
    }
  },
  mutations: {// 可以更改状态，必须是同步更改的
    add(state, payload) {
      state.count += payload
    }
  },
  actions: { // 可以嗲用其他 action， 或者调用 mutations
    asyncAdd({ commit }, payload) {
      console.log(commit);
      setTimeout(() => {
        commit('add', payload)
      }, 1000)
    }
  },
  modules: { // 子模块， 实现逻辑拆分
    A: {
      namespaced: true, // 表示这是一个全新的store
      state: { // 组件中的data
        count: 100
      },
      mutations: {// 可以更改状态，必须是同步更改的
        add(state, payload) {
          state.count += payload
        }
      },
      modules: {
        A1: {
          state: { // 组件中的data
            count: 100
          },
          mutations: {// 可以更改状态，必须是同步更改的
            add(state, payload) {
              state.count += payload
            }
          },
          modules: {
            A11: {
              namespaced: true, // 表示这是一个全新的store
              state: { // 组件中的data
                count: 100
              },
              mutations: {// 可以更改状态，必须是同步更改的
                add(state, payload) {
                  state.count += payload
                }
              },
            },
            A12: {
              namespaced: true, // 表示这是一个全新的store
              state: { // 组件中的data
                count: 100
              },
              mutations: {// 可以更改状态，必须是同步更改的
                add(state, payload) {
                  state.count += payload
                }
              },
            }
          }
        }
      }
    },
    B: {
      namespaced: true, // 表示这是一个全新的store
      state: { // 组件中的data
        count: 100
      },
      mutations: {// 可以更改状态，必须是同步更改的
        add(state, payload) {
          state.count += payload
        }
      },
    }
  }
})

// 严格模式
// dispatch(action) => commit(mutation) => 修改状态


// 有一个功能在a页面需要调用一个接口,影响的可能是 a 数据,b 页面也需要调用一个接口,改的是 b 数据
// ['A', 'cc'] 给 A 注册一个 cc
store.registerModule(['A', 'cc'], {
  namespaced: true, // 表示这是一个全新的store
  state: { // 组件中的data
    count: 222
  },
  mutations: {// 可以更改状态，必须是同步更改的
    add(state, payload) {
      state.count += payload
    }
  },
})

export default store