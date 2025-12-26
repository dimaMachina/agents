import { PageHeader } from '@/components/layout/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export default async function Layout({ children, params }: LayoutProps<'/[tenantId]/settings'>) {
  const { tenantId } = await params;
  return (
    <Breadcrumb label="Settings" href={`/${tenantId}/settings`}>
      <PageHeader title="Organization Settings" description="Manage your organization settings" />
      {children}
    </Breadcrumb>
  );
}
