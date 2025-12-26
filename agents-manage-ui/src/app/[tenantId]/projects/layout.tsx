import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({ children, params }: LayoutProps<'/[tenantId]/projects'>) {
  const { tenantId } = await params;
  return (
    <Breadcrumb label="Projects" href={`/${tenantId}/projects`}>
      {children}
    </Breadcrumb>
  );
}
