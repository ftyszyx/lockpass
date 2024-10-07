import { useState, useEffect } from 'react'
import { KEY_MAP } from '@common/keycode'
import { shortKeys } from '@renderer/libs/tools/shortKeys'

export function useKeyboardNavigation() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [total_count, setTotalCount] = useState(0)
  const [is_focus, setIsFocus] = useState(false)

  useEffect(() => {
    const handleKeyDown = (key: string) => {
      if (!is_focus) {
        return false
      }
      switch (key) {
        case KEY_MAP.right:
        case KEY_MAP.down:
          setSelectedIndex((prev) => (prev + 1) % total_count)
          break
        case KEY_MAP.left:
        case KEY_MAP.up:
          setSelectedIndex((prev) => (prev - 1 + total_count) % total_count)
          break
        default:
          return false
      }
      return true
    }

    shortKeys.bindShortKey(KEY_MAP.right, handleKeyDown)
    shortKeys.bindShortKey(KEY_MAP.left, handleKeyDown)
    shortKeys.bindShortKey(KEY_MAP.up, handleKeyDown)
    shortKeys.bindShortKey(KEY_MAP.down, handleKeyDown)

    return () => {
      shortKeys.unbindShortKey(KEY_MAP.right, handleKeyDown)
      shortKeys.unbindShortKey(KEY_MAP.left, handleKeyDown)
      shortKeys.unbindShortKey(KEY_MAP.up, handleKeyDown)
      shortKeys.unbindShortKey(KEY_MAP.down, handleKeyDown)
    }
  }, [total_count, is_focus])

  return { selectedIndex, setSelectedIndex, setTotalCount, setIsFocus }
}
