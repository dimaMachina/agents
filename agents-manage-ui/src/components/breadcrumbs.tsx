'use client';

import Link from 'next/link';
import type { FC, ReactElement } from 'react';
import type { BreadcrumbProps } from './breadcrumb';

export const Breadcrumbs: FC<{ items: ReactElement<BreadcrumbProps>[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            {item.props.href ? (
              <Link href={item.props.href}>{item.props.label}</Link>
            ) : (
              item.props.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
