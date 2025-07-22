import { useState } from "react";
import { Play, History, HelpCircle, Info, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Compressor", 
    url: "/", 
    icon: Play,
    description: "Compress your videos"
  },
  { 
    title: "History", 
    url: "/history", 
    icon: History,
    description: "View compression history"
  },
  { 
    title: "How To Use", 
    url: "/guide", 
    icon: HelpCircle,
    description: "Learn how to compress"
  },
  { 
    title: "About", 
    url: "/about", 
    icon: Info,
    description: "About Video Compressor"
  },
];

export function VideoCompressorSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-video-primary rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  Video Compressor
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Professional Tool
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                          isActive
                            ? "bg-video-primary text-white font-medium shadow-md"
                            : ""
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs opacity-70 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stats Section */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/70 space-y-1">
              <div className="flex justify-between">
                <span>Client-side only</span>
                <span className="text-video-success">✓</span>
              </div>
              <div className="flex justify-between">
                <span>No uploads</span>
                <span className="text-video-success">✓</span>
              </div>
              <div className="flex justify-between">
                <span>100% Private</span>
                <span className="text-video-success">✓</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}