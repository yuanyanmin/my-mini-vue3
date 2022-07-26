class ReactiveEffect {
  private _fn:any;
  deps = []
  active = true;
  onStop?: () => void;
  constructor (fn, scheuler) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn()
  }

  stop() {
    if (this.active) {
      clearupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
    
  }
}

function clearupEffect(effect:any) {
  effect.deps.forEach((dep:any) => {
    dep.delete(effect)
  });
}

// 收集依赖
const targetMap = new Map()
export function track(target, type, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  if (!activeEffect) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)


}

// 触发依赖
export function trigger(target, type, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for(const effect of dep) {
    if (effect.scheuler) {
      effect.scheuler()
    } else {
      effect.run()
    }
  }
}

let activeEffect
export function effect(fn, options:any = {}) {
  const scheuler = options.scheuler
  const _effect = new ReactiveEffect(fn, scheuler)
  // _effect.onStop = options.onStop
  Object.assign(_effect, options)

  _effect.run()
  const runner:any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}