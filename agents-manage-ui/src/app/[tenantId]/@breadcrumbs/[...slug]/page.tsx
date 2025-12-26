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

  let path = `/${tenantId}`;
  let projectId: string | undefined;
  const nameCache = new Map<string, string>();

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
      try {
        const providers = await fetchNangoProviders();
        const provider = providers?.find(
          (item) =>
            item.unique_key === id ||
            item.name === id ||
            (item as { slug?: string }).slug === id ||
            item.display_name === id
        );
        return provider?.display_name || provider?.name || provider?.unique_key || provider?.slug;
      } catch {
        return undefined;
      }
    },
  };

  const crumbs: BreadcrumbItem[] = [];

  const getCached = async (key: string, fetcher: () => Promise<string | undefined>) => {
    if (nameCache.has(key)) return nameCache.get(key);
    try {
      const value = await fetcher();
      if (value) nameCache.set(key, value);
      return value;
    } catch {
      return undefined;
    }
  };

  for (let index = 0; index < slug.length; index += 1) {
    const segment = slug[index];
    const prev = slug[index - 1];
    path = `${path}/${segment}`;

    let label: string | undefined;

    if (prev === 'projects') {
      projectId = segment;
      label = await getCached(`project:${segment}`, () => fetchers.project(segment));
    } else if (prev === 'agents') {
      label = await getCached(`agent:${segment}`, () => fetchers.agent(segment));
    } else if (prev === 'artifacts') {
      label = await getCached(`artifact:${segment}`, () => fetchers.artifact(segment));
    } else if (prev === 'components') {
      label = await getCached(`data:${segment}`, () => fetchers.dataComponent(segment));
    } else if (prev === 'credentials') {
      label = await getCached(`credential:${segment}`, () => fetchers.credential(segment));
    } else if (prev === 'external-agents') {
      label = await getCached(`external:${segment}`, () => fetchers.externalAgent(segment));
    } else if (prev === 'mcp-servers') {
      label = await getCached(`mcp:${segment}`, () => fetchers.mcpServer(segment));
    } else if (prev === 'providers') {
      label = await getCached(`provider:${segment}`, () => fetchers.provider(segment));
    } else if (prev === 'conversations') {
      label = `Conversation ${segment.slice(0, 8)}`;
    }

    if (!label) {
      label = STATIC_LABELS[segment];
    }

    crumbs.push({ label, href: path });
  }

  return (
    <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
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
