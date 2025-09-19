import { create } from "zustand";

type ReferencesStore = {
  references: string[];
  addReference: (reference: string) => void;
  deleteReference: (reference: string) => void;
};

export const useReferencesStore = create<ReferencesStore>((set) => ({
  references: [],
  addReference: (reference) => set((state) => ({ references: [...state.references, reference] })),
  deleteReference: (reference) =>
    set((state) => ({ references: state.references.filter((r) => r !== reference) })),
}));
