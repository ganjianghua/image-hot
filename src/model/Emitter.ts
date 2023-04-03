type ListenerFunction<
  T extends Record<string, unknown[]>,
  K extends keyof T
> = (...params: T[K]) => void

type ListenerCache<T extends Record<string, unknown[]>> = {
  [K in keyof T]?: Array<ListenerFunction<T, K>>;
}

const EVENT_CACHE_KEY = Symbol('event_cache_key')

export class Emitter<T extends Record<string, any>> {
  private [EVENT_CACHE_KEY]: ListenerCache<T>

  constructor() {
    this[EVENT_CACHE_KEY] = {}
  }

  /**
   * 监听事件
   * @param type 事件类型
   * @param listener 处理方法
   */
  public addListener<K extends keyof T>(
    type: K,
    listener: ListenerFunction<T, K>
  ) {
    const map: ListenerCache<T> = this[EVENT_CACHE_KEY]
    let listenerList = map[type]
    if (!listenerList) {
      listenerList = []
    }
    listenerList.push(listener)
    map[type] = listenerList
  }

  /**
   * 触发事件
   * @param type 事件类型
   * @param params 函数参数
   * @returns
   */
  public emit<K extends keyof T>(type: K, ...params: T[K]): void {
    const map: ListenerCache<T> = this[EVENT_CACHE_KEY]
    const listenerList = map[type]
    if (!listenerList) {
      return
    }
    for (const listener of listenerList) {
      listener.apply(this, params)
    }
  }

  /**
   * 删除绑定的事件类型
   * @param type 事件类型
   * @param listener 函数方法
   * @returns
   */
  public removeListener<K extends keyof T>(
    type?: K,
    listener?: ListenerFunction<T, K>
  ) {
    const map = this[EVENT_CACHE_KEY]
    if (!type) {
      this[EVENT_CACHE_KEY] = {}
      return
    }
    const listenerList = map[type]
    if (!listenerList) {
      return
    }
    if (!listener) {
      delete map[type]
      return
    }
    const index = listenerList.findIndex((item) => item === listener)
    if (index >= 0) {
      listenerList.splice(index, 1)
    }
  }

  /**
   * 删除事件所有绑定的函数
   * @param type 事件类型
   */
  public removeAllListener<K extends keyof T>(type?: K): void {
    this.removeListener(type)
  }
}
