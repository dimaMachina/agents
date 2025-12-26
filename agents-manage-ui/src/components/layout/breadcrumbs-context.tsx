'use client';

import { createContext, type FC, type ReactNode } from 'react';

export interface Crumb {
  label: string;
  href: string;
}

export const BreadcrumbsContext = createContext<Crumb[]>([]);

export const BreadcrumbsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <BreadcrumbsContext value={[]}>{children}</BreadcrumbsContext>;
};
