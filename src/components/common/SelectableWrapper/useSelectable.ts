import { useState } from 'react'

export type UseSelectableReturn<T> = {
  selectedItems: T[]
  selectItem: (item: T) => void
  deselectItem: (item: T) => void
  deselectAllItem: () => void
  toggleSelection: (item: T) => void
  isSelected: (item: T) => boolean
}

export const useSelectable = <T>(
  initialItems: T[] = []
): UseSelectableReturn<T> => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialItems)

  const selectItem = (item: T) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev : [...prev, item]))
  }

  const deselectItem = (item: T) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item))
  }

  const deselectAllItem = () => {
    setSelectedItems([])
  }

  const toggleSelection = (item: T) => {
    if (selectedItems.includes(item)) {
      deselectItem(item)
    } else {
      selectItem(item)
    }
  }

  const isSelected = (item: T) => selectedItems.includes(item)

  return {
    selectedItems,
    selectItem,
    deselectItem,
    deselectAllItem,
    toggleSelection,
    isSelected,
  }
}
