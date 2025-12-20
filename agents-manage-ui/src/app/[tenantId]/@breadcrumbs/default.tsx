import { Children, type FC, type ReactElement, type ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbProps } from '@/components/breadcrumb';

const DefaultBreadcrumbs: FC<{ children: ReactNode }> = ({ children }) => {
  const crumbs = Children.toArray(children).filter(
    (child): child is ReactElement<BreadcrumbProps> => (child as any)?.type === Breadcrumb
  );
  console.log(1);
  console.log('default', { crumbs, children });
  // Fallback when the slot isn't provided by the active route
  return null;
};

export default DefaultBreadcrumbs;
