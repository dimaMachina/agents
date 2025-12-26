import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[tenantId]/projects/[projectId]/components'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="Components" href={`/${tenantId}/projects/${projectId}/components`}>
      {children}
    </Breadcrumb>
  );
}
