import { useCallback, useMemo } from 'react'
import { useEvent } from 'react-use'

export const useScroll = localStorageKey => {
  const onScroll = useCallback(() => {
    localStorage.setItem(localStorageKey, window.scrollY.toString())
  }, [localStorageKey])

  const initialScrollY = useMemo(
    () => parseInt(localStorage.getItem(localStorageKey) || 0),
    [localStorageKey],
  )

  useEvent('scroll', onScroll)
  return {
    initialScrollY,
  }
}
