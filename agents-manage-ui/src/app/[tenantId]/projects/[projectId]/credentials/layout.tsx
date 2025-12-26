import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({
  params,
  children,
}: LayoutProps<'/[tenantId]/projects/[projectId]/credentials'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="Credentials" href={`/${tenantId}/projects/${projectId}/credentials`}>
      {children}
    </Breadcrumb>
  );
}
