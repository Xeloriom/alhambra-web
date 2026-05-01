'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  heroReady: boolean;
  setHeroReady: (v: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType>({
  heroReady: false,
  setHeroReady: () => {},
});

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [heroReady, setHeroReady] = useState(false);
  return (
    <LoaderContext.Provider value={{ heroReady, setHeroReady }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const useLoaderContext = () => useContext(LoaderContext);
