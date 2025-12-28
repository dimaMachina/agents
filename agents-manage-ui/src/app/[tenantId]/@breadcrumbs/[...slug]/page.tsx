import Link from 'next/link';
import type { FC } from 'react';
import { getFullAgentAction } from '@/lib/actions/agent-full';
import { fetchArtifactComponent } from '@/lib/api/artifact-components';
import { fetchCredential } from '@/lib/api/credentials';
import { fetchDataComponent } from '@/lib/api/data-components';
import { fetchExternalAgent } from '@/lib/api/external-agents';
import { fetchProject } from '@/lib/api/projects';
import { fetchMCPTool } from '@/lib/api/tools';
import { fetchNangoProviders } from '@/lib/mcp-tools/nango';
import { cn } from '@/lib/utils';

const STATIC_LABELS: Record<string, string> = {
  projects: 'Projects',
  settings: 'Settings',
  agents: 'Agents',
  'api-keys': 'API keys',
  credentials: 'Credentials',
  components: 'Components',
  artifacts: 'Artifacts',
  traces: 'Traces',
  conversations: 'Conversations',
  'ai-calls': 'AI Calls',
  'tool-calls': 'Tool Calls',
  'external-agents': 'External Agents',
  'mcp-servers': 'MCP servers',
  new: 'New',
  providers: 'Providers',
  bearer: 'Bearer',
};

interface BreadcrumbItem {
  href: string;
  label: string;
}

const BreadcrumbSlot: FC<PageProps<'/[tenantId]/[...slug]'>> = async ({ params }) => {
  const { tenantId, slug } = await params;

  const fetchers: Record<string, (id: string) => Promise<string | undefined>> = {
    async project(id) {
      const project = await fetchProject(tenantId, id);
      return project.data?.name;
    },
    async agent(id) {
      const result = await getFullAgentAction(tenantId, projectId, id);
      return result.success ? result.data.name : undefined;
    },
    async artifact(id) {
      const artifact = await fetchArtifactComponent(tenantId, projectId, id);
      return artifact.name;
    },
    async dataComponent(id) {
      const component = await fetchDataComponent(tenantId, projectId, id);
      return component.name;
    },
    async credential(id) {
      const credential = await fetchCredential(tenantId, projectId, id);
      return credential.name;
    },
    async externalAgent(id) {
      const externalAgent = await fetchExternalAgent(tenantId, projectId, id);
      return externalAgent.name;
    },
    async mcpServer(id) {
      const tool = await fetchMCPTool(tenantId, projectId, id);
      return tool.name;
    },
    async provider(id) {
      const providers = await fetchNangoProviders();
      const provider = providers?.find((p) => encodeURIComponent(p.name) === id);
      return provider?.display_name;
    },
  };

  const crumbs: BreadcrumbItem[] = [];
  let href = `/${tenantId}`;
  let projectId = '';

  for (const [index, segment] of slug.entries()) {
    const prev = slug[index - 1];
    let label: string | undefined;

    switch (prev) {
      case 'projects':
        projectId = segment;
        label = await fetchers.project(segment);
        break;
      case 'agents':
        label = await fetchers.agent(segment);
        break;
      case 'artifacts':
        label = await fetchers.artifact(segment);
        break;
      case 'components':
        label = await fetchers.dataComponent(segment);
        break;
      case 'credentials':
        label = await fetchers.credential(segment);
        break;
      case 'external-agents':
        label = await fetchers.externalAgent(segment);
        break;
      case 'mcp-servers':
        label = await fetchers.mcpServer(segment);
        break;
      case 'providers':
        label = await fetchers.provider(segment);
        break;
      case 'conversations':
        label = `Conversation ${segment.slice(0, 8)}`;
        break;
    }

    label ??= STATIC_LABELS[segment];
    href = `${href}/${segment}`;
    crumbs.push({ label, href });
  }

  return crumbs.map((item, idx, arr) => {
    const isLast = idx === arr.length - 1;

    return (
      <li
        key={`${item.label}-${idx}`}
        className={cn(
          'flex items-center gap-2',
          isLast
            ? 'font-medium text-foreground'
            : 'after:content-["/"] after:text-muted-foreground/60'
        )}
        aria-current={isLast ? 'page' : undefined}
      >
        {isLast ? (
          item.label
        ) : (
          <Link href={item.href} className="hover:text-foreground">
            {item.label}
          </Link>
        )}
      </li>
    );
  });
};

export default BreadcrumbSlot;
