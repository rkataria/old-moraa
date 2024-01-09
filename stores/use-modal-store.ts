import { create } from "zustand";

export type ModalType = "createEvent";

interface ModalStore<T> {
  type: ModalType | null;
  data: T;
  isOpen: boolean;
  onOpen: (type: ModalType, { data }: TModalData<T>, isEdit?: boolean) => void;
  onClose: () => void;
}

type TModalData<T> = {
  data: T;
};

export type T = any;
export const useModal = create<ModalStore<T>>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, { data }) => {
    return set({ isOpen: true, type, data: data as T });
  },
  onClose: () => set({ isOpen: false }),
}));
