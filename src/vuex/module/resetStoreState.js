import { reactive } from 'vue'
import { forEachObjValue } from '../util'
import { watch } from 'vue'
/**
 * 将状态变为响应式且把getters挂在在 store 实例上
 * @param {*} store 
 * @param {*} state 
 */
export default function resetStoreState(store, state) {
  store._state = reactive({ data: state })
  const wrappedGetters = store._wrappedGetters
  store.getters = {}
  forEachObjValue(wrappedGetters, (getter, key) => {
    console.log(store._state.data);
    Object.defineProperty(store.getters, key, {
      enumerable: true,
      get: () => getter(store.state)
    })
  })

  if (store.strict) {
    enableStrictMode(store)
  }

  console.log('sss', store.getters);
}

function enableStrictMode(store) {
  //  deep: true, flush: 'sync' 分别是深度监控，和将异步为同步
  watch(() => store._state.data, () => {
    console.assert(store._commitimg, '严格模式下不能通过非正规轴端修改 Vuex 的状态');
  }, { deep: true, flush: 'sync' })
}
