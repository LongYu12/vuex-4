import { isPromise } from "../util"
import getNestedState from "./getNestedState"
 


/**
 * 定义状态
 * @param {*} store 
 * @param {*} rootState 
 * @param {*} path 
 * @param {*} module 
 */
export default function installModule(store, rootState, path, module) {
  let isRoot = !path.length // 是否是根

  let nameSpace = store._modules.getNameSpace(path)

  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key]
    }, rootState)
    store.withCommithing(() => parentState[path[path.length - 1]] = module.state)
    
  }

  module.forEachGetter((getter, key) => {
    store._wrappedGetters[nameSpace + key] = () => getter(getNestedState(store.state, path))
  })

  module.forEachMutation((mutation, key) => {
    const entry = store._mutations[nameSpace + key] || (store._mutations[nameSpace + key] = [])
    entry.push((preload) => {
      mutation.call(store, getNestedState(store.state, path), preload)
    })
  })

  module.forEachAction((action, key) => {
    const entry = store._actions[nameSpace + key] || (store._actions[key] = [])
    entry.push((preload) => {
      let res = action.call(store, store, preload)

      if (!isPromise(res)) {
        return Promise.resolve(res)
      }
      return res
    })

  })

  module.forEachChilld((moduleChild, key) => {
    installModule(store, rootState, path.concat(key), moduleChild)
  })
  // console.log('module', module);
}

