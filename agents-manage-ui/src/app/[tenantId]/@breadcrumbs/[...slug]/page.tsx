import Link from 'next/link';
import type { FC } from 'react';
import { STATIC_LABELS } from '@/constants/theme';
import { getFullAgentAction } from '@/lib/actions/agent-full';
import { fetchArtifactComponent } from '@/lib/api/artifact-components';
import { fetchCredential } from '@/lib/api/credentials';
import { fetchDataComponent } from '@/lib/api/data-components';
import { fetchExternalAgent } from '@/lib/api/external-agents';
import { fetchProject } from '@/lib/api/projects';
import { fetchMCPTool } from '@/lib/api/tools';
import { fetchNangoProviders } from '@/lib/mcp-tools/nango';
import { getErrorCode, getStatusCodeFromErrorCode } from '@/lib/utils/error-serialization';

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
    async conversations() {
      return 'Conversation';
    },
  };

  for (const [index, id] of slug.entries()) {
    let label: string | undefined;
    try {
      const prev = slug[index - 1];
      // this check is needed until we remove all `/[segment]/new` routes
      if (id === 'new') {
        const parentLabel = STATIC_LABELS[prev];
        label = parentLabel ? `New ${parentLabel.slice(0, -1)}` : 'New';
      } else {
        label = Object.hasOwn(fetchers, prev) ? await fetchers[prev](id) : STATIC_LABELS[id];
        if (!label) {
          throw new Error(`Unknown breadcrumb segment "${id}"`);
        }
      }
    } catch (error) {
      const errorCode = getErrorCode(error);
      const resolvedStatusCode = getStatusCodeFromErrorCode(errorCode);
      label = resolvedStatusCode ? `${resolvedStatusCode} Error` : 'Error';
    }

    href += `/${id}`;
    crumbs.push({ label, href });
  }

  return crumbs.map(({ label, href }, idx, arr) => {
    const isLast = idx === arr.length - 1;
    return (
      <li
        key={href}
        aria-current={isLast ? 'page' : undefined}
        className={
          isLast
            ? 'font-medium text-foreground'
            : 'after:ml-2 after:content-["/"] after:text-muted-foreground/60'
        }
      >
        {isLast ? (
          label
        ) : (
          <Link href={href} className="hover:text-foreground">
            {label}
          </Link>
        )}
      </li>
    );
  });
};

export default BreadcrumbSlot;
