import { PageHeader } from '@/components/layout/page-header';

export default function Layout({ children }: LayoutProps<'/[tenantId]/settings'>) {
  return (
    <>
      <PageHeader title="Organization Settings" description="Manage your organization settings" />
      {children}
    </>
  );
}
