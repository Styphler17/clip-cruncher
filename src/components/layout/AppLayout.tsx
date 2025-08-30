import { ReactNode } from "react";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import "@/styles/layout.css";
import "@/styles/components.css";
import "@/styles/utilities.css";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed } = useSidebarToggle();

  return (
    <div 
      className="app-shell"
      data-sidebar={isCollapsed ? "collapsed" : "expanded"}
    >
      <aside className="app-sidebar" role="navigation">
        <VideoCompressorSidebar />
      </aside>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}