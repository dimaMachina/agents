import { DataComponentForm } from '@/components/data-components/form/data-component-form';
import { Breadcrumb } from '@/components/layout/breadcrumb';

async function NewDataComponentPage({
  params,
}: PageProps<'/[tenantId]/projects/[projectId]/components/new'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="New Component" href={`/${tenantId}/projects/${projectId}/components/new`}>
      <div className="max-w-2xl mx-auto">
        <DataComponentForm tenantId={tenantId} projectId={projectId} />
      </div>
    </Breadcrumb>
  );
}

export default NewDataComponentPage;
