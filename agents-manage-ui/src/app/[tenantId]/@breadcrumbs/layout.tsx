import { Children, type FC, type ReactElement, type ReactNode } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Breadcrumb, type BreadcrumbProps } from '@/components/breadcrumb';

const BreadcrumbSlot: FC<{ children: ReactNode }> = ({ children }) => {
  const crumbs = Children.toArray(children).filter(
    (child): child is ReactElement<BreadcrumbProps> => (child as any)?.type === Breadcrumb
  );
  console.log(2);
  console.log('page', { crumbs, children: 22 });

  return <Breadcrumbs items={crumbs} />;
};

export default BreadcrumbSlot;
