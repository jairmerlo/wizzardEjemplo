import { useState } from 'react'
import { useTimeoutFn } from 'react-use'

export const useSelectedRow = localStorageKey => {
  const [selectedRow, setSelectedRow] = useState(
    localStorage.getItem(localStorageKey)
      ? [localStorage.getItem(localStorageKey)]
      : [],
  )

  useTimeoutFn(() => {
    setSelectedRow([])
  }, 2000)

  const saveSelectedRow = value => {
    localStorage.setItem(localStorageKey, value)
  }

  return {
    selectedRow,
    saveSelectedRow,
  }
}
