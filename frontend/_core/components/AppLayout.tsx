import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, LogOut, Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "_core/components/ui/tooltip";
import { useAuthStore } from "_core/store/authStore";
import { useThemeStore } from "_core/store/themeStore";

export interface NavItemDef {
  path: string;
  icon: React.ElementType;
  label: string;
}

const BRAND_HEIGHT = "h-[65px]";

function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function ProfileButton() {
  const authUser = useAuthStore((state) => state.user);
  const profile = authUser?.user;
  const initials = getInitials(profile?.name);
  const displayName = profile?.name ?? "Profile";
  const subtext = profile?.email ?? "View account";

  return (
    <Link
      to="/profile"
      aria-label="Open profile"
      className="flex items-center gap-2.5 pl-3 border-l border-gray-100 dark:border-gray-800 hover:opacity-80 transition-opacity"
    >
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight truncate max-w-[140px]">
          {displayName}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[140px]">{subtext}</p>
      </div>
      <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center ring-2 ring-indigo-100 dark:ring-indigo-900/40 shrink-0">
        <span className="text-white text-sm font-semibold">{initials}</span>
      </div>
    </Link>
  );
}

function NavItem({
  path,
  icon: Icon,
  label,
  active,
  collapsed,
}: NavItemDef & { active: boolean; collapsed: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={path}
          className={`group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150 ${
            collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
          } ${
            active
              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          }`}
        >
          {active && !collapsed && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
          )}
          <Icon
            className={`w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
              active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
            }`}
          />
          {!collapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  );
}

function Sidebar({
  items,
  activeCheck,
  onLogout,
  collapsed,
  onToggle,
}: {
  items: readonly NavItemDef[];
  activeCheck: (path: string) => boolean;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`${
        collapsed ? "w-[65px]" : "w-60"
      } bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col shrink-0 transition-[width] duration-200 overflow-hidden`}
    >
      <div
        className={`${BRAND_HEIGHT} flex items-center border-b border-gray-100 dark:border-gray-800 shrink-0 ${
          collapsed ? "justify-center px-3" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/logo.svg"
              alt="Smart Campus"
              className="h-8 w-auto max-w-[140px] object-contain dark:brightness-0 dark:invert"
            />
          </div>
        )}
        {collapsed && (
          <img
            src="/icon.svg"
            alt="Smart Campus"
            className="w-8 h-8 object-contain dark:brightness-0 dark:invert"
          />
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-2 w-6 h-6 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            active={activeCheck(item.path)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 px-2 py-3 shrink-0">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-150 group"
              >
                <LogOut className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-150 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}

function Header({
  title,
  subtitle,
  collapsed,
  onExpand,
}: {
  title: string;
  subtitle: string;
  collapsed: boolean;
  onExpand: () => void;
}) {
  return (
    <header
      className={`${BRAND_HEIGHT} bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between shrink-0`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {collapsed && (
          <button
            onClick={onExpand}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ProfileButton />
      </div>
    </header>
  );
}

interface AppLayoutProps {
  navItems: readonly NavItemDef[];
  headerTitle: string;
  headerSubtitle: string;
}

export default function AppLayout({
  navItems,
  headerTitle,
  headerSubtitle,
}: AppLayoutProps) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        items={navItems}
        activeCheck={isActive}
        onLogout={logout}
        collapsed={collapsed}
        onToggle={() => setCollapsed(true)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          collapsed={collapsed}
          onExpand={() => setCollapsed(false)}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
