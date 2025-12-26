import { AppSidebarProvider } from '@/components/sidebar-nav/app-sidebar-provider';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { HeaderMenus } from '@/components/layout/header-menus';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export default function Layout({ children, breadcrumbs }: LayoutProps<'/[tenantId]'>) {
  return (
    <AppSidebarProvider>
      <SidebarInset>
        <div className="h-[calc(100vh-16px)] flex flex-col overflow-hidden">
          <header className="h-(--header-height) shrink-0 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-muted/20 dark:bg-background rounded-t-[14px] flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-accent dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-accent/50" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumbs />
            {/*{breadcrumbs}*/}
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4 ml-auto"
            />
            <HeaderMenus />
          </header>
          <div
            className={cn(
              'flex flex-col flex-1 overflow-y-auto scrollbar-thin',
              'scrollbar-thumb-muted-foreground/30 dark:scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent h-full w-full min-h-0 bg-muted/20 dark:bg-background'
            )}
          >
            <div
              id="main-content"
              className={cn(
                '@container', // do not overflow the container
                'w-full p-6 grow'
                // className
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </AppSidebarProvider>
  );
}
