import { BreadcrumbsContext, type Crumb } from './breadcrumbs-context';
import { use } from 'react';

export function BreadcrumbProvider({
  crumb,
  children,
}: {
  crumb: Crumb;
  children: React.ReactNode;
}) {
  const parentCrumbs = use(BreadcrumbsContext);

  return (
    <BreadcrumbsContext.Provider value={[...parentCrumbs, crumb]}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}
