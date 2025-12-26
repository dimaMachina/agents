import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[tenantId]/projects/[projectId]/agents'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="Agents" href={`/${tenantId}/projects/${projectId}/agents`}>
      {children}
    </Breadcrumb>
  );
}
