'use client';

import { use, type ReactNode, type FC } from 'react';
import { BreadcrumbsContext, type Crumb } from './breadcrumbs-context';

export const Breadcrumb: FC<Crumb & { children: ReactNode }> = ({ label, href, children }) => {
  const parentCrumbs = use(BreadcrumbsContext);
  const value = [...parentCrumbs, { label, href }];

  console.log('breadcrumb', value);

  return <BreadcrumbsContext value={value}>{children}</BreadcrumbsContext>;
};
