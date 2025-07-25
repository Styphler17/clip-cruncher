import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading-spinner";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showText?: boolean;
  status?: 'processing' | 'success' | 'error' | 'idle';
  label?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showText = true,
  status = 'idle',
  label 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const statusColors = {
    processing: 'bg-blue-500',
    success: 'bg-green-500', 
    error: 'bg-red-500',
    idle: 'bg-primary'
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(showText || label) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {label || (status === 'processing' ? 'Processing...' : 'Progress')}
          </span>
          <div className="flex items-center gap-2">
            {status === 'processing' && <LoadingSpinner size="sm" />}
            <span className="font-medium">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      )}
      
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full",
            statusColors[status]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}