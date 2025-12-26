'use client';

import { type FC, use, useEffect } from 'react';
import { BreadcrumbsContext } from './breadcrumbs-context';
import Link from 'next/link';

export const Breadcrumbs: FC = () => {
  const crumbs = use(BreadcrumbsContext);
  useEffect(() => {
    console.log('useEffect', crumbs);
  }, []);

  console.log('comp', { crumbs });
  return (
    <nav aria-label="Breadcrumbs">
      {crumbs.map((c, i) => (
        <span key={i}>
          <Link href={c.href}>{c.label}</Link>
          {i < crumbs.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
};
