import { inject } from "vue"
export const storeKey = 'store'

export function useStore(injectKey = storeKey) {
  // 在 Vue 中，已经将如 inject 等这些 Api 导出了
  return inject(injectKey)
}