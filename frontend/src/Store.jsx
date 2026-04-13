import { create } from "zustand";

const useStore = create((set) => ({
  showmodal: true,
  setShowmodal: (value) => set({ showmodal: value }),
  openModal: () => set({ showmodal: true }),
  closeModal: () => set({ showmodal: false }),
}));

export default useStore;
