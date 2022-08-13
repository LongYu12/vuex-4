import { forEachObjValue } from '../util'

export default class Module {
  constructor(rawModule, name) {
    this._raw = rawModule
    this.state = rawModule.state
    this._children = {}
    this.name = name
    this.namespaced = rawModule.namespaced ? true : false
  }

  addChild(key, module) {
    this._children[key] = module
  }

  getChild(key) {
    return this._children[key]
  }

  // 循环子
  forEachChilld(callback) {
    forEachObjValue(this._children, callback)
  }

  // 循环 Getter
  forEachGetter(callback) {
    if (this._raw.getters) {
      forEachObjValue(this._raw.getters, callback)
    }
  }

  // 循环 Mutation
  forEachMutation(callback) {
    if (this._raw.mutations) {
      forEachObjValue(this._raw.mutations, callback)
    }
  }

  // 循环 Action
  forEachAction(callback) {
    if (this._raw.actions) {
      forEachObjValue(this._raw.actions, callback)
    }
  }
}