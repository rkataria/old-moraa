
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
