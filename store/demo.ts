
import { create } from "zustand";

export interface TMenuStore {
  selectedMenu: string | null;
  setSelectedMenu: (menuItem: string) => void;
}

export const useMenuStore = create<TMenuStore>()(
  (set) => ({
    selectedMenu: null,
    setSelectedMenu: (menuItem) => {
      set(() => ({ selectedMenu: menuItem }))
    },
  }),
);
