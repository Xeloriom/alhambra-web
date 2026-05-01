'use client';

import { createContext, useContext } from 'react';

export const HeroReadyContext = createContext<boolean>(false);

export const useHeroReady = () => useContext(HeroReadyContext);
