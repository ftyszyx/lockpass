import { useState, useEffect } from 'react'
import { KEY_MAP } from '@common/keycode'
import { shortKeys } from '@renderer/libs/tools/shortKeys'

export function useKeyboardNavigation(itemsCount: number) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (key: string) => {
      switch (key) {
        case KEY_MAP.right:
        case KEY_MAP.down:
          setSelectedIndex((prev) => (prev + 1) % itemsCount)
          break
        case KEY_MAP.left:
        case KEY_MAP.up:
          setSelectedIndex((prev) => (prev - 1 + itemsCount) % itemsCount)
          break
      }
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
  }, [itemsCount])

  return { selectedIndex, setSelectedIndex }
}
