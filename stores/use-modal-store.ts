import { create } from 'zustand'

export type ModalType = 'createEvent'

interface ModalStore<T> {
  type: ModalType | null
  data: T
  isOpen: boolean
  onOpen: (type: ModalType, { data }: TModalData<T>, isEdit?: boolean) => void
  onClose: () => void
}

type TModalData<T> = {
  data: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useModal = create<ModalStore<any>>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen: (type, { data }) => set({ isOpen: true, type, data: data as any }),
  onClose: () => set({ isOpen: false }),
}))
