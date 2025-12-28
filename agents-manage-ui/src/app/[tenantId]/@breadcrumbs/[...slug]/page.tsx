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
  agents: 'Agents',
  'api-keys': 'API keys',
  artifacts: 'Artifacts',
  new: 'New',
  settings: 'Settings',
  // credentials: 'Credentials',
  // components: 'Components',
  // traces: 'Traces',
  // conversations: 'Conversations',
  // 'ai-calls': 'AI Calls',
  // 'tool-calls': 'Tool Calls',
  // 'external-agents': 'External Agents',
  // 'mcp-servers': 'MCP servers',
  // providers: 'Providers',
  // bearer: 'Bearer',
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

  for (const [index, id] of slug.entries()) {
    let label: string | undefined;

    try {
      const prev = slug[index - 1];
      // this check is needed until we remove all `new` routes
      if (id !== 'new') {
        switch (prev) {
          case 'projects': {
            projectId = id;
            const project = await fetchProject(tenantId, id);
            label = project.data.name;
            break;
          }
          case 'agents': {
            const result = await getFullAgentAction(tenantId, projectId, id);
            if (result.success) {
              label = result.data.name;
            }
            break;
          }
          case 'artifacts': {
            const artifact = await fetchArtifactComponent(tenantId, projectId, id);
            label = artifact.name;
            break;
          }
          case 'components': {
            const component = await fetchDataComponent(tenantId, projectId, id);
            label = component.name;
            break;
          }
          case 'credentials': {
            const credential = await fetchCredential(tenantId, projectId, id);
            label = credential.name;
            break;
          }
          case 'external-agents': {
            const externalAgent = await fetchExternalAgent(tenantId, projectId, id);
            label = externalAgent.name;
            break;
          }
          case 'mcp-servers': {
            const tool = await fetchMCPTool(tenantId, projectId, id);
            label = tool.name;
            break;
          }
          case 'providers': {
            const providers = await fetchNangoProviders();
            const provider = providers.find((p) => encodeURIComponent(p.name) === id);
            if (provider) {
              label = provider.display_name;
            }
            break;
          }
          case 'conversations': {
            label = `Conversation ${id.slice(0, 8)}`;
            break;
          }
        }
      }

      label ??= STATIC_LABELS[id];
      if (!label) {
        throw new Error(`Unknown breadcrumb segment "${id}"`);
      }
    } catch {
      label = 'Error';
    }

    href += `/${id}`;
    crumbs.push({ label, href });
  }

  return crumbs.map((item, idx, arr) => {
    const isLast = idx === arr.length - 1;

    return (
      <li
        key={item.href}
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
