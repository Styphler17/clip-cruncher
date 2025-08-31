import { FaPlay, FaHistory, FaQuestionCircle, FaInfoCircle, FaCog, FaWrench } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { SidebarToggle } from "@/components/layout/SidebarToggle";
import { useSidebar } from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Compressor", 
    url: "/", 
    icon: FaPlay,
    description: "Compress your videos"
  },
  { 
    title: "Video Repair", 
    url: "/repair", 
    icon: FaWrench,
    description: "Fix corrupted videos"
  },
  { 
    title: "History", 
    url: "/history", 
    icon: FaHistory,
    description: "View compression history"
  },
  { 
    title: "How To Use", 
    url: "/guide", 
    icon: FaQuestionCircle,
    description: "Learn how to compress"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: FaCog,
    description: "Configure preferences"
  },
  { 
    title: "About", 
    url: "/about", 
    icon: FaInfoCircle,
    description: "About ClipSqueeze"
  },
];

export function VideoCompressorSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <aside 
      role="navigation"
      className={`app-sidebar glass border-r border-sidebar-border bg-gradient-surface backdrop-blur-xl transition-spring shadow-colored h-full flex flex-col relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-primary"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-video-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-video-info/20 rounded-full blur-2xl"></div>
      </div>
      
      {/* Logo Section */}
      <div className="relative p-6 border-b border-sidebar-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="ClipSqueeze" 
              className="w-10 h-10 rounded-xl shadow-lg transition-spring group-hover:scale-110" 
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-20 transition-smooth"></div>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="text-2xl font-bold gradient-text">ClipSqueeze</span>
              <div className="text-xs text-muted-foreground">Professional Video Compression</div>
            </div>
          )}
        </div>
        <SidebarToggle />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="text-muted-foreground text-xs uppercase tracking-wider px-3 py-2 font-semibold">
          Navigation
        </div>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-3 rounded-xl transition-spring font-medium relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-primary text-white shadow-glow-sm"
                    : "text-foreground hover:bg-sidebar-accent/50 hover:text-video-primary hover:shadow-sm"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-primary opacity-100 rounded-xl"></div>
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-lg transition-spring ${
                    isActive 
                      ? "bg-white/20 text-white shadow-sm" 
                      : "bg-video-secondary/50 group-hover:bg-video-primary/10 group-hover:text-video-primary"
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className={`font-semibold text-sm transition-smooth ${
                        isActive ? "text-white" : "group-hover:text-video-primary"
                      }`}>
                        {item.title}
                      </div>
                      <div className={`text-xs truncate leading-tight transition-smooth ${
                        isActive 
                          ? "text-white/80" 
                          : "text-muted-foreground group-hover:text-video-primary/70"
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-smooth rounded-xl"></div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Enhanced Stats Section */}
      {!isCollapsed && (
        <div className="relative mt-auto p-4 border-t border-sidebar-border/50 bg-gradient-secondary/30 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground mb-2">Security Features</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Client-side only</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-video-success animate-pulse-slow"></div>
                  <span className="text-video-success font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">No uploads</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-video-success animate-pulse-slow"></div>
                  <span className="text-video-success font-medium">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}