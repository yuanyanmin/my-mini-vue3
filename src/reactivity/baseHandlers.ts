import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    // 收集依赖
    track(target, "get", key)
    return res
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    // 触发依赖
    trigger(target, "set", key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}