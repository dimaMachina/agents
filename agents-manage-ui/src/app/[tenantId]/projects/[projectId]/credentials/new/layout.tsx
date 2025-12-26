import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[tenantId]/projects/[projectId]/credentials'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="New Credential" href={`/${tenantId}/projects/${projectId}/credentials/new`}>
      {children}
    </Breadcrumb>
  );
}
