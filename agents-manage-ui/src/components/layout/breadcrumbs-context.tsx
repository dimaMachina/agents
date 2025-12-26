'use client';

import { createContext } from 'react';

export interface Crumb {
  label: string;
  href: string;
}

export const BreadcrumbsContext = createContext<Crumb[]>([]);
