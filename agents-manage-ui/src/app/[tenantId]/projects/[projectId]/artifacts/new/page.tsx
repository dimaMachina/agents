import { ArtifactComponentForm } from '@/components/artifact-components/form/artifact-component-form';
import { Breadcrumb } from '@/components/layout/breadcrumb';

async function NewArtifactComponentPage({
  params,
}: PageProps<'/[tenantId]/projects/[projectId]/artifacts/new'>) {
  const { tenantId, projectId } = await params;
  return (
    <Breadcrumb label="New Artifact" href={`/${tenantId}/projects/${projectId}/artifacts/new`}>
      <ArtifactComponentForm tenantId={tenantId} projectId={projectId} />
    </Breadcrumb>
  );
}

export default NewArtifactComponentPage;
