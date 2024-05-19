import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const bookstore = (set) => ({
  dopen: true,
  updateOpen: (dopen) => set((state) => ({ dopen })),
});
const persistedBookStore = persist(bookstore, { name: 'my_bookstore' });
export const useBookStore = create(persistedBookStore);