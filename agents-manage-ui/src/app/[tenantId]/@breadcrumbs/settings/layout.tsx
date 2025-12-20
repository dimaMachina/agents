import { Breadcrumb } from '@/components/breadcrumb';

export default async function Layout({ params, children }: LayoutProps<'/[tenantId]/settings'>) {
  const { tenantId } = await params;
  return (
    <>
      <Breadcrumb label="Settings" href={`/${tenantId}/settings`} />
      {children}
    </>
  );
}
