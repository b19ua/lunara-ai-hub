import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  Command as CmdIcon,
  Contact2,
  Headphones,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquare,
  MonitorCog,
  Moon,
  PhoneCall,
  Plug,
  Search,
  Settings,
  Sun,
  Users,
  Menu,
  X,
  FileText,
  Download,
  Mic,
  Globe,
  PhoneOutgoing,
  Bot,
  LogOut,
  UserCog,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusDot } from "./primitives";
import { GlobalSearch } from "./global-search";
import { useAppState } from "@/state/app-state";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  children?: { label: string; to: string; icon: ReactNode }[];
}

const nav: { section: string; items: NavItem[] }[] = [
  {
    section: "Operations",
    items: [
      { label: "Overview", to: "/", icon: <LayoutDashboard className="size-4" /> },
      { label: "Lunara Assistant", to: "/assistant", icon: <Sparkles className="size-4" /> },
      { label: "AI Employees", to: "/employees", icon: <Bot className="size-4" /> },
      {
        label: "Calls",
        to: "/calls",
        icon: <PhoneCall className="size-4" />,
        children: [
          { label: "All Calls", to: "/calls", icon: <PhoneCall className="size-3.5" /> },
          {
            label: "Outbound",
            to: "/calls/outbound",
            icon: <PhoneOutgoing className="size-3.5" />,
          },
          { label: "Campaigns", to: "/campaigns", icon: <Megaphone className="size-3.5" /> },
          { label: "Recordings", to: "/recordings", icon: <Mic className="size-3.5" /> },
        ],
      },
      {
        label: "Conversations",
        to: "/conversations",
        icon: <MessageSquare className="size-4" />,
        children: [
          {
            label: "All Conversations",
            to: "/conversations",
            icon: <MessageSquare className="size-3.5" />,
          },
          { label: "WhatsApp", to: "/whatsapp", icon: <Headphones className="size-3.5" /> },
          { label: "Email", to: "/email", icon: <Mail className="size-3.5" /> },
          { label: "Web Chat", to: "/webchat", icon: <Globe className="size-3.5" /> },
        ],
      },
    ],
  },
  {
    section: "Customers",
    items: [
      { label: "Contacts", to: "/contacts", icon: <Contact2 className="size-4" /> },
      { label: "CRM", to: "/crm", icon: <Building2 className="size-4" /> },
      { label: "Calendar", to: "/calendar", icon: <CalendarDays className="size-4" /> },
      { label: "Knowledge", to: "/knowledge", icon: <BookOpen className="size-4" /> },
    ],
  },
  {
    section: "Insight",
    items: [
      { label: "Analytics", to: "/analytics", icon: <BarChart3 className="size-4" /> },
      { label: "Transcripts", to: "/transcripts", icon: <FileText className="size-4" /> },
      { label: "Export Center", to: "/exports", icon: <Download className="size-4" /> },
    ],
  },
  {
    section: "Platform",
    items: [
      { label: "Phone System", to: "/phone", icon: <PhoneCall className="size-4" /> },
      { label: "Integrations", to: "/integrations", icon: <Plug className="size-4" /> },
      { label: "Test AI", to: "/test-ai", icon: <Sparkles className="size-4" /> },
      { label: "System", to: "/system", icon: <MonitorCog className="size-4" /> },
      { label: "Settings", to: "/settings", icon: <Settings className="size-4" /> },
    ],
  },
];

const notifications = [
  {
    id: "n1",
    title: "Human handoff requested",
    body: "Call with Olga Petrov needs an operator",
    tone: "warn" as const,
  },
  {
    id: "n2",
    title: "Campaign 50% complete",
    body: "September Sales Outreach · 628 of 1,248",
    tone: "ok" as const,
  },
  { id: "n3", title: "Storage almost full", body: "78% of 200 GB used", tone: "warn" as const },
  { id: "n4", title: "Lead qualified", body: "David Johnson · Acme Retail", tone: "ok" as const },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary/20 ring-1 ring-sidebar-primary/40">
          <span className="block size-3.5 rounded-full bg-sidebar-primary" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-[0.14em] text-sidebar-accent-foreground">
            LUNARA BOX
          </p>
          <p className="text-[10px] font-medium tracking-[0.3em] text-sidebar-foreground/60">
            AI CALLS
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-sidebar-foreground/45 uppercase">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.to)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </Link>
                  {item.children && isActive(item.to) ? (
                    <ul className="mt-0.5 mb-1 ml-6 space-y-0.5 border-l border-sidebar-border pl-3">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.to}
                            onClick={onNavigate}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                              pathname === child.to
                                ? "text-sidebar-primary-foreground bg-sidebar-primary/80"
                                : "text-sidebar-foreground/70 hover:text-sidebar-accent-foreground",
                            )}
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/system"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-2.5 text-xs font-medium hover:bg-sidebar-accent"
        >
          <StatusDot state="ok" />
          All systems operational
        </Link>
      </div>
    </div>
  );
}

function ProfileMenu() {
  const { resetSetup } = useAppState();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            AO
          </span>
          <span className="hidden text-sm font-medium sm:block">Alex Owner</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">Alex Owner</p>
          <p className="text-xs text-muted-foreground">Administrator · localhost:8080</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <UserCog className="size-4" /> Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/system">
            <MonitorCog className="size-4" /> System status
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => resetSetup()}>
          <Sparkles className="size-4" /> Re-run first-time setup
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, aiStatus, unreadNotifications, markNotificationsRead } =
    useAppState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 w-64">
          <SidebarContent />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-none p-0 [&>button]:hidden">
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 z-10 text-sidebar-foreground/70"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </Button>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-md"
          >
            <Search className="size-4" />
            <span className="truncate">Search contacts, calls, transcripts…</span>
            <span className="ml-auto hidden items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-[10px] md:flex">
              <CmdIcon className="size-3" />K
            </span>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <div className="mr-1 hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium sm:flex">
              <StatusDot
                state={aiStatus === "ready" ? "ok" : aiStatus === "busy" ? "warn" : "error"}
              />
              {aiStatus === "ready" ? "AI Ready" : aiStatus === "busy" ? "AI Busy" : "AI Offline"}
            </div>

            <Popover onOpenChange={(o) => o && markNotificationsRead()}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell />
                  {unreadNotifications > 0 ? (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b border-border px-4 py-3 text-sm font-semibold">
                  Notifications
                </div>
                <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className="flex gap-3 px-4 py-3">
                      <StatusDot state={n.tone} className="mt-1.5" />
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border p-2">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link to="/settings">Notification settings</Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

export { Users };
