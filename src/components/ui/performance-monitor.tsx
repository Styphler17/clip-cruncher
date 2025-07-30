import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PerformanceMonitor } from '@/lib/performance';
import { Activity, HardDrive, Zap, Download, Trash2 } from 'lucide-react';

interface PerformanceMonitorProps {
  className?: string;
}

export function PerformanceMonitorComponent({ className }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState(PerformanceMonitor.getMetrics());
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    // Update metrics every few seconds
    const interval = setInterval(() => {
      setMetrics(PerformanceMonitor.getMetrics());
      
      // Get memory info if available (Chrome only)
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const averageTime = PerformanceMonitor.getAverageCompressionTime();
  const averageRatio = PerformanceMonitor.getAverageCompressionRatio();
  const totalSaved = PerformanceMonitor.getTotalSpaceSaved();

  const exportData = () => {
    const csv = PerformanceMonitor.exportMetrics();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipsqueeze-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    PerformanceMonitor.clearMetrics();
    setMetrics([]);
  };

  const memoryUsagePercent = memoryInfo 
    ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100)
    : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap className="w-4 h-4 text-primary" />
              Avg. Compression Time
            </div>
            <div className="text-lg font-bold">
              {averageTime > 0 ? formatTime(averageTime) : 'N/A'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HardDrive className="w-4 h-4 text-primary" />
              Avg. Compression Ratio
            </div>
            <div className="text-lg font-bold">
              {averageRatio > 0 ? `${(averageRatio * 100).toFixed(1)}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Total Space Saved */}
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" />
              <span className="font-medium">Total Space Saved</span>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {formatBytes(totalSaved)}
            </Badge>
          </div>
        </div>

        {/* Memory Usage (Chrome only) */}
        {memoryInfo && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Memory Usage</span>
              <span>{memoryUsagePercent}%</span>
            </div>
            <Progress value={memoryUsagePercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Used: {formatBytes(memoryInfo.usedJSHeapSize)}</span>
              <span>Limit: {formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recent Activity</h4>
          {metrics.length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {metrics.slice(-5).reverse().map((metric, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                  <div>
                    <div className="font-medium">
                      {formatBytes(metric.originalSize)} → {formatBytes(metric.compressedSize)}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-primary">
                      {(metric.compressionRatio * 100).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">
                      {formatTime(metric.compressionTime)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              No compression activity yet
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={exportData}
            variant="outline"
            size="sm"
            disabled={metrics.length === 0}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={clearData}
            variant="outline"
            size="sm"
            disabled={metrics.length === 0}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Tracks compression performance and memory usage
        </div>
      </CardContent>
    </Card>
  );
}