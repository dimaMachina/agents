'use client';

import { use } from 'react';
import { BreadcrumbsContext } from './breadcrumbs-context';
import Link from 'next/link';

export function Breadcrumbs() {
  const crumbs = use(BreadcrumbsContext);

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
}
