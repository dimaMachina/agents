import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[tenantId]/projects/[projectId]/artifacts'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="Artifacts" href={`/${tenantId}/projects/${projectId}/artifacts`}>
      {children}
    </Breadcrumb>
  );
}
