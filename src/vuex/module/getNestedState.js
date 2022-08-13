// 处理出状态，根据路径获取 store 上最新状态, 保留状态的响应式
export default function getNestedState(state, path) {
  return path.reduce((preState, key) => preState[key], state)
}