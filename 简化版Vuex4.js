import Vue, { inject, reactive } from "vue"

const storeKey = 'store'

// Store 对象
class Store {

  constructor(options) {
    let store = this
    /**
     * {data: options.state} 这样写，加个 {} 的原理，是为了后面 调用 replaceState 替换 state
     * 的时候不用再通过 reactive(xxx) 进行深层次监听了，直接 this._state.data = xxx 就ok了
     */
    store._state = reactive({ data: options.state })

    /**
     * =======================
     * ==== 处理 getters =====
     * =======================
     */
    const _getters = options.getters

    store.getters = {}

    forEachObjValue(_getters, (fn, key) => {
      console.log(key, fn);
      Object.defineProperty(store.getters, key, {
        get: () => fn(store.state)
      })
    })

    /**
     * ======================================
     * ==== 处理 mutetions 和 actions =======
     * ======================================
     */
    store._mutations = Object.create(null) // Object.create(null)：创建一个没有原型链的对象
    store._actions = Object.create(null)

    const _mutations = options.mutations
    const _actions = options.actions

    forEachObjValue(_mutations, (mutation, key) => {
      store._mutations[key] = (preload) => {
        mutation.call(store, store.state, preload)
      }
    })

    forEachObjValue(_actions, (action, key) => {
      store._actions[key] = (preload) => {
        action.call(store, store, preload)
      }
    })
  }


  // 修改 state 中的数据
  commit = (key, payload) => {
    this._mutations[key](payload)
  }
 
  // 通过 dispatch 调用 action
  dispatch = (key, payload) => {
    this._actions[key](payload)
  }

  /**
   * 关于 get 和 set 的作用：
   *    get propertyName(){} 用来得到当前属性值得回调函数
   *    set propertyName(){} 用来监视当前属性值变化的回调函数
   */
  get state() {
    return this._state.data
  }

  /**
   * 描述：该方法会在Vue实例化使用 use 将 store 全局化时候，会调用实例 store 中的方法 install
   * @param {*} app Vue实例
   * @param {string} injeKey 实例名字，默认为 store
    */
  install(app, injectKey) {
    console.log('啦', app);
    // Provide / Inject https://v3.cn.vuejs.org/guide/component-provide-inject.html#%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%E6%80%A7
    app.provide(injectKey || storeKey, this) // 把实例 store 提供给 app，即将实例 store 全部暴露给 app
    // 将 store 挂在在实例配置上，这样就可以在 template 内通过 $store 来调用了
    // 类似 Vue2 的 Vue.prototype.$store = this
    app.config.globalProperties.$store = this
  }

}



export function createStore(options) {
  return new Store(options)
}


export function useStore(injectKey = storeKey) {
  // 在 Vue 中，已经将如 inject 等这些 Api 导出了
  return inject(injectKey)
}

/**
 * 描述：循环对象属性
 * @param {*} obj  循环的对象
 * @param {*} callback  回调函数
 */
export function forEachObjValue(obj, callback) {
  if (typeof obj != 'object') return

  Object.keys(obj).forEach(key => callback(obj[key], key))
}


