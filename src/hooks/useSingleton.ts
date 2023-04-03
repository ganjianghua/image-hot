/**
 * 单例模式
 */
import { useMemo, useRef } from 'react'

export function useSingleton<T> (creator: () => T): T {
  const ref = useRef<T | null>(null)

  return useMemo(() => {
    if (ref.current) {
      return ref.current
    }
    ref.current = creator()
    return ref.current
  }, [])
}
