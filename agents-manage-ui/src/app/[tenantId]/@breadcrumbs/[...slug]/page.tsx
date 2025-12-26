import type { FC } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { fetchProject } from '@/lib/api/projects';

const LABELS: Record<string, string> = {
  projects: 'Projects',
  settings: 'Settings',
  agents: 'Agents',
  'api-keys': 'API keys',
  credentials: 'Credentials',
  components: 'Components',
  artifacts: 'Artifacts',
  traces: 'Traces',
  conversations: 'Conversations',
  'ai-calls': 'AI calls',
  'tool-calls': 'Tool calls',
  'external-agents': 'External agents',
  'mcp-servers': 'MCP servers',
  new: 'New',
  providers: 'Providers',
  bearer: 'Bearer',
};

const formatLabel = (segment: string) => {
  const mapped = LABELS[segment];
  if (mapped) {
    return mapped;
  }

  return segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BreadcrumbSlot: FC<PageProps<'/[tenantId]/[...slug]'>> = async ({ params }) => {
  const { tenantId, slug } = await params;
  console.log({ slug });

  let path = `/${tenantId}`;

  let projectName = '';
  if (slug[0] === 'projects' && slug[1]) {
    try {
      const project = await fetchProject(tenantId, slug[1]);
      projectName = project.data?.name;
    } catch (error) {
      console.error('Failed to fetch project for breadcrumbs', error);
    }
  }

  const crumbs = slug.map((segment, index) => {
    path = `${path}/${segment}`;

    let label = formatLabel(segment);
    if (index === 1 && slug[0] === 'projects' && projectName) {
      label = projectName;
    }

    return { label, href: path };
  });

  return <Breadcrumbs items={crumbs} />;
};

export default BreadcrumbSlot;
