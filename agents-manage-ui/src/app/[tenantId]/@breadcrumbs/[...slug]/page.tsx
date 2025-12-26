import type { FC } from 'react';
import { fetchProject } from '@/lib/api/projects';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
  'ai-calls': 'AI Calls',
  'tool-calls': 'Tool Calls',
  'external-agents': 'External Agents',
  'mcp-servers': 'MCP servers',
  new: 'New',
  providers: 'Providers',
  bearer: 'Bearer',
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

  const items = slug.map((segment, index) => {
    path = `${path}/${segment}`;

    let label = LABELS[segment];
    if (index === 1 && slug[0] === 'projects' && projectName) {
      label = projectName;
    }

    return { label, href: path };
  });

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
