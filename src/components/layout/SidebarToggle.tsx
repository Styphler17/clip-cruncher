import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarToggleProps {
  className?: string;
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className={className}
      aria-expanded={!isCollapsed}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}