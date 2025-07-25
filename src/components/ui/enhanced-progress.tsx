
import { CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressBar } from './progress-bar';
import { LoadingSpinner } from './loading-spinner';

interface EnhancedProgressProps {
  status: 'idle' | 'processing' | 'success' | 'error' | 'cancelled';
  progress: number;
  title: string;
  subtitle?: string;
  estimatedTime?: number;
  className?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function EnhancedProgress({
  status,
  progress,
  title,
  subtitle,
  estimatedTime,
  className,
  onCancel,
  onRetry
}: EnhancedProgressProps) {
  const statusConfig = {
    idle: {
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50'
    },
    processing: {
      icon: LoadingSpinner,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    error: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20'
    },
    cancelled: {
      icon: XCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    }
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-all duration-200",
      config.bgColor,
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("mt-1", config.color)}>
          {status === 'processing' ? (
            <LoadingSpinner size="sm" />
          ) : (
            <IconComponent className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm truncate">{title}</h4>
            {estimatedTime && status === 'processing' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                {formatTime(estimatedTime)}
              </div>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground mb-3 truncate">
              {subtitle}
            </p>
          )}
          
          <ProgressBar
            value={progress}
            status={status === 'cancelled' ? 'error' : status}
            showText={true}
            className="mb-3"
          />
          
          {(status === 'error' || status === 'cancelled') && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-primary hover:underline"
            >
              Try again
            </button>
          )}
          
          {status === 'processing' && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}