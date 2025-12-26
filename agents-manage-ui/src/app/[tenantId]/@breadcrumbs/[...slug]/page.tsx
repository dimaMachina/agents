import type { FC } from 'react';
import { fetchProject } from '@/lib/api/projects';
import { fetchArtifactComponent } from '@/lib/api/artifact-components';
import { fetchDataComponent } from '@/lib/api/data-components';
import { fetchCredential } from '@/lib/api/credentials';
import { fetchExternalAgent } from '@/lib/api/external-agents';
import { fetchMCPTool } from '@/lib/api/tools';
import { getFullAgentAction } from '@/lib/actions/agent-full';
import { fetchNangoProviders } from '@/lib/mcp-tools/nango';
import Link from 'next/link';
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

type BreadcrumbParams = {
  tenantId: string;
  slug?: string[] | string;
};

const formatLabel = (segment: string) => {
  const mapped = STATIC_LABELS[segment];
  if (mapped) return mapped;

  return segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface BreadcrumbItem {
  href: string;
  label: string;
}

async function buildCrumbs(params: BreadcrumbParams): Promise<BreadcrumbItem[]> {
  const slugArray = Array.isArray(params.slug) ? params.slug : params.slug ? [params.slug] : [];
  if (!slugArray.length) return [];

  let path = `/${params.tenantId}`;
  let projectId: string | undefined;
  const nameCache = new Map<string, string>();

  const fetchers: Record<string, (id: string) => Promise<string | undefined>> = {
    project: async (id) => {
      const project = await fetchProject(params.tenantId, id);
      return project.data?.name;
    },
    agent: async (id) => {
      if (!projectId) return undefined;
      const result = await getFullAgentAction(params.tenantId, projectId, id);
      return result.success ? result.data.name : undefined;
    },
    artifact: async (id) => {
      if (!projectId) return undefined;
      const artifact = await fetchArtifactComponent(params.tenantId, projectId, id);
      return artifact.name;
    },
    dataComponent: async (id) => {
      if (!projectId) return undefined;
      const component = await fetchDataComponent(params.tenantId, projectId, id);
      return component.name;
    },
    credential: async (id) => {
      if (!projectId) return undefined;
      const credential = await fetchCredential(params.tenantId, projectId, id);
      return credential.name;
    },
    externalAgent: async (id) => {
      if (!projectId) return undefined;
      const externalAgent = await fetchExternalAgent(params.tenantId, projectId, id);
      return externalAgent.name;
    },
    mcpServer: async (id) => {
      if (!projectId) return undefined;
      const tool = await fetchMCPTool(params.tenantId, projectId, id);
      return tool.name;
    },
    provider: async (id) => {
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

  for (let index = 0; index < slugArray.length; index += 1) {
    const segment = slugArray[index];
    const prev = slugArray[index - 1];
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
      label = formatLabel(segment);
    }

    crumbs.push({ label, href: path });
  }

  return crumbs;
}

const BreadcrumbSlot: FC<PageProps<'/[tenantId]/[...slug]'>> = async ({ params }) => {
  const { tenantId, slug } = await params;
  const items = await buildCrumbs({ tenantId, slug });
  return (
    <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, idx, arr) => {
          const isLast = idx === arr.length - 1;

          return (
            <li
              key={`${item.label}-${idx}`}
              className={cn(
                'flex items-center gap-2',
                !isLast && 'after:content-["›"] after:text-muted-foreground/60'
              )}
            >
              {isLast ? (
                <span className="font-medium text-foreground">{item.label}</span>
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
