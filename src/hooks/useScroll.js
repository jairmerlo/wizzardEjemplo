import { useCallback, useMemo } from 'react'
import { useEvent } from 'react-use'

export const useScroll = localStorageKey => {
  const onScroll = useCallback(() => {
    localStorage.setItem(localStorageKey, window.scrollY.toString())
  }, [localStorageKey])

  const initialScrollY = useMemo(
    () => parseInt(localStorage.getItem('scrollY') || 0),
    [],
  )

  useEvent('scroll', onScroll)
  return {
    initialScrollY,
  }
}
