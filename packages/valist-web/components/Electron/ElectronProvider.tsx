import React from 'react';
import { getApps, install, launch, onInstallProgress, uninstall } from './operations';

export const defaultElectronClient = {
  install,
  uninstall,
  launch,
  getApps,
  onInstallProgress,
};

export type ElectronClient = typeof defaultElectronClient;

export const ElectronContext = React.createContext<ElectronClient>(defaultElectronClient);

export interface ValistProviderProps {
  children?: React.ReactNode;
}

export function ElectronProvider(props: ValistProviderProps) {
  return (
    <ElectronContext.Provider value={defaultElectronClient}>
      {props.children}
    </ElectronContext.Provider>
  );
}
