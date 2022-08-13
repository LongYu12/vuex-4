
import { forEachObjValue } from '../util'
import Module from './module'
// 格式化



export default class ModuleCollection {
  constructor(rootModule) {
    this.root = null
    this.rigister(rootModule, [])
  }

  /**
   * 描述： 通过递归构建父子关系
   * @param {*} rawModule 
   * @param {*} path 
   * @param {*} keyname 
   */
  rigister(rawModule, path, keyname) {
    let newModule = new Module(rawModule)
    
    if (path.length == 0) {// 说明是一个跟模块
      this.root = newModule
    } else {
      // reduce() 是一个累计函数，只返回最后的结果，只有一个结果
      // reduce()中 this.root 是默认值，当数组长度为0的时候返回 this.root ,
      // reduce()中 这里的 module 参数是上一个返回的值，第一个则是默认值 this.root
      const parent = path.slice(0, -1).reduce((module, current) => {
        return module.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }

    if (rawModule.modules) {
      forEachObjValue(rawModule.modules, (rawChildModule, key) => {
        // 巧妙之处：path.concat(key) 这样传参，数组最后一个都是和父级的 key 紧挨着的
        this.rigister(rawChildModule, path.concat(key), key)
      })
    }
    console.log(this.root);
    return newModule
  }

  /**
   * 描述：获取命名空间
   * @param {*} path 
   */
  getNameSpace(path) {
    let module = this.root
    return path.reduce((namespaced, key) => {
      module = module.getChild(key)
      return namespaced + (module.namespaced ? key + '/' : '')
    }, '')
  }
}
