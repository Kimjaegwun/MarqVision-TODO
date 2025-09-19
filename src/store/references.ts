import { create } from "zustand";

type ReferencesStore = {
  references: string[];
  setReferences: (reference: string) => void;
  initializeReferences: () => void;
};

export const useReferencesStore = create<ReferencesStore>((set, get) => ({
  references: [],
  setReferences: (reference) => {
    const references = get().references;
    if (references.includes(reference)) {
      set({ references: references.filter((r) => r !== reference) });
    } else {
      set({ references: [...references, reference] });
    }
  },
  initializeReferences: () => {
    set({ references: [] });
  },
}));
