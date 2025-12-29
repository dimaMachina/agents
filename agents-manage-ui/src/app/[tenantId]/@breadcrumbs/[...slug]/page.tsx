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
import { getErrorCode, getStatusCodeFromErrorCode } from '@/lib/utils/error-serialization';

const STATIC_LABELS: Record<string, string> = {
  projects: 'Projects',
  agents: 'Agents',
  'api-keys': 'API keys',
  artifacts: 'Artifacts',
  new: 'New',
  settings: 'Settings',
  traces: 'Traces',
  credentials: 'Credentials',
  components: 'Components',
  'external-agents': 'External Agents',
  'mcp-servers': 'MCP Servers',
  bearer: 'Bearer',
  edit: 'Edit',
  providers: 'Providers',
  // conversations: 'Conversations',
  // 'ai-calls': 'AI Calls',
  // 'tool-calls': 'Tool Calls',
};

interface BreadcrumbItem {
  href: string;
  label: string;
}

const BreadcrumbSlot: FC<PageProps<'/[tenantId]/[...slug]'>> = async ({ params }) => {
  const { tenantId, slug } = await params;
  const crumbs: BreadcrumbItem[] = [];
  let href = `/${tenantId}`;
  let projectId = '';

  const fetchers: Record<string, (id: string) => Promise<string | undefined>> = {
    async projects(id) {
      projectId = id;
      const project = await fetchProject(tenantId, id);
      return project.data.name;
    },
    async agents(id) {
      const result = await getFullAgentAction(tenantId, projectId, id);
      if (result.success) {
        return result.data.name;
      }
    },
    async artifacts(id) {
      const artifact = await fetchArtifactComponent(tenantId, projectId, id);
      return artifact.name;
    },
    async components(id) {
      const component = await fetchDataComponent(tenantId, projectId, id);
      return component.name;
    },
    async credentials(id) {
      const credential = await fetchCredential(tenantId, projectId, id);
      return credential.name;
    },
    async 'external-agents'(id) {
      const externalAgent = await fetchExternalAgent(tenantId, projectId, id);
      return externalAgent.name;
    },
    async 'mcp-servers'(id) {
      const tool = await fetchMCPTool(tenantId, projectId, id);
      return tool.name;
    },
    async providers(id) {
      const providers = await fetchNangoProviders();
      for (const provider of providers) {
        if (encodeURIComponent(provider.name) === id) {
          return provider.display_name;
        }
      }
    },
    async conversations(id) {
      return `Conversation ${id.slice(0, 8)}`;
    },
  };

  for (const [index, id] of slug.entries()) {
    let label: string | undefined;

    try {
      // this check is needed until we remove all `/[segment]/new` routes
      if (id !== 'new') {
        const prev = slug[index - 1];
        if (Object.hasOwn(fetchers, prev)) {
          label = await fetchers[prev](id);
        }
      }

      label ??= STATIC_LABELS[id];
      if (!label) {
        throw new Error(`Unknown breadcrumb segment "${id}"`);
      }
    } catch (error) {
      const errorCode = getErrorCode(error);
      const resolvedStatusCode = getStatusCodeFromErrorCode(errorCode);
      label = resolvedStatusCode ? `${resolvedStatusCode} Error` : 'Error';
    }

    href += `/${id}`;
    crumbs.push({ label, href });
  }

  return crumbs.map((item, idx, arr) => {
    const isLast = idx === arr.length - 1;

    return (
      <li
        key={item.href}
        className={
          isLast
            ? 'font-medium text-foreground'
            : 'after:ml-2 after:content-["/"] after:text-muted-foreground/60'
        }
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
