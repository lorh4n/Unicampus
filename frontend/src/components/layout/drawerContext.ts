import { createContext, useContext } from 'react';

interface DrawerValue {
  openDrawer: () => void;
}

export const DrawerContext = createContext<DrawerValue>({ openDrawer: () => {} });

/** Permite às telas mobile abrirem o menu lateral do AppLayout. */
export function useDrawer(): DrawerValue {
  return useContext(DrawerContext);
}
