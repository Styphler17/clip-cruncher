import { ReactNode } from "react";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import "@/styles/layout.css";
import "@/styles/components.css";
import "@/styles/utilities.css";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { state } = useSidebar();

  return (
    <div 
      className="app-shell"
      data-sidebar={state === "collapsed" ? "collapsed" : "expanded"}
    >
      <VideoCompressorSidebar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}