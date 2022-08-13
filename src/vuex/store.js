// Store 对象
import { storeKey } from './useStore'
import ModuleCollection from "./module/moduleCollection"
import installModule from "./module/installModuke"
import resetStoreState from './module/resetStoreState'


export default class Store {
  withCommithing(fn) {// 严格模式下使用
    const commitimg = this._commitimg
    this._commitimg = true
    fn()
    this._commitimg = commitimg
  }

  constructor(options) {
    this._modules = new ModuleCollection(options)
    this._wrappedGetters = Object.create(null)
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this.strict = options.strict || false // 是否严格模式
    this._commitimg = false // 调用的时候，知道是 mutation，mutation里面得写同步代码
    this._subsribes = [] // 订阅者

    // 定义状态
    const state = this._modules.root.state
    installModule(this, state, [], this._modules.root)
    resetStoreState(this, state)

    options.plugins.forEach(plugin => plugin(this))
  }

  // 订阅
  subscribe(fn) {
    this._subsribes.push(fn)
  }

  // 
  replaceState(newsState) {
    // this.withCommithing ：防止严格模式下报错
    this.withCommithing(() => this._state.data = newsState)
  }

  // 将 state 暴露出去
  get state() {
    return this._state.data
  }

  commit = (type, preload) => {
    const entry = this._mutations[type] || []
    this.withCommithing(() => entry.forEach(fn => fn(preload)))
    this._subsribes.forEach(sub => sub({ type, preload }, this.state))
  }

  dispatch = (type, preload) => {
    const entry = this._mutations[type] || []
    return Promise.all(entry.map(fn => fn(preload)))
  }

  // 注册新的模块
  registerModule(path, rawModule) {
    if (typeof path == 'string') path = path.split('/')

    // 要在原有的模块基础上新增加一个
    let newModule = this._modules.rigister(rawModule, path)

    // 把模块安装上到store实例上相应的各个字段
    installModule(this, this.state, path, newModule)

    // 重置容器
    resetStoreState(this, this.state)
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
