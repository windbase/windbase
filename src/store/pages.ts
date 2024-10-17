import { create } from 'zustand';

type PagesActions = {};
type PagesState = {};

export type PagesStore = PagesState & PagesActions;

export const usePagesStore = create<PagesStore>(() => ({}));
