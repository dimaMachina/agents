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
      if (!projectId) return undefined;
      const result = await getFullAgentAction(tenantId, projectId, id);
      return result.success ? result.data.name : undefined;
    },
    async artifact(id) {
      if (!projectId) return undefined;
      const artifact = await fetchArtifactComponent(tenantId, projectId, id);
      return artifact.name;
    },
    async dataComponent(id) {
      if (!projectId) return undefined;
      const component = await fetchDataComponent(tenantId, projectId, id);
      return component.name;
    },
    async credential(id) {
      if (!projectId) return undefined;
      const credential = await fetchCredential(tenantId, projectId, id);
      return credential.name;
    },
    async externalAgent(id) {
      if (!projectId) return undefined;
      const externalAgent = await fetchExternalAgent(tenantId, projectId, id);
      return externalAgent.name;
    },
    async mcpServer(id) {
      if (!projectId) return undefined;
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
  let path = `/${tenantId}`;
  let projectId: string | undefined;

  for (const [index, segment] of slug.entries()) {
    const prev = slug[index - 1];
    let label: string | undefined;

    if (prev === 'projects') {
      projectId = segment;
      label = await fetchers.project(segment);
    } else if (prev === 'agents') {
      label = await fetchers.agent(segment);
    } else if (prev === 'artifacts') {
      label = await fetchers.artifact(segment);
    } else if (prev === 'components') {
      label = await fetchers.dataComponent(segment);
    } else if (prev === 'credentials') {
      label = await fetchers.credential(segment);
    } else if (prev === 'external-agents') {
      label = await fetchers.externalAgent(segment);
    } else if (prev === 'mcp-servers') {
      label = await fetchers.mcpServer(segment);
    } else if (prev === 'providers') {
      label = await fetchers.provider(segment);
    } else if (prev === 'conversations') {
      label = `Conversation ${segment.slice(0, 8)}`;
    }

    if (!label) {
      label = STATIC_LABELS[segment];
    }

    path = `${path}/${segment}`;
    crumbs.push({ label, href: path });
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-sm text-muted-foreground flex items-center gap-2">
        {crumbs.map((item, idx, arr) => {
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
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbSlot;
