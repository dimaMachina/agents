import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({ params, children }: LayoutProps<'/[tenantId]/settings'>) {
  const { tenantId } = await params;
  return (
    <Breadcrumb label="Projects" href={`/${tenantId}/projects`}>
      {children}
    </Breadcrumb>
  );
}
