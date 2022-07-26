import {
  mutableHandlers
} from './baseHandlers'

export const reactiveMap = new WeakMap()

export function reactive(target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  const proxy = new Proxy(target, baseHandlers)
  return proxy
}