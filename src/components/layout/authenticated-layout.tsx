import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { SkipToMain } from '@/components/skip-to-main';
import { ThemeSwitch } from '@/components/theme-switch';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';
import { SearchProvider } from '@/context/search-provider';
import { getCookie } from '@/lib/cookies';
import { cn } from '@/lib/utils';
import { Header } from './header';

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false';
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-[[data-layout=fixed]]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]',
            )}
          >
            <Header fixed>
              <div className="ms-auto flex items-center space-x-4">
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </Header>
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  );
}
