// Performance monitoring utilities

export interface PerformanceMetrics {
  compressionTime: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics[] = [];
  private static readonly MAX_METRICS = 100;

  static startTimer(): () => number {
    const start = performance.now();
    return () => performance.now() - start;
  }

  static recordCompression(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only the latest metrics to prevent memory bloat
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('clipSqueeze_performance', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  static getMetrics(): PerformanceMetrics[] {
    // Load from localStorage if not in memory
    if (this.metrics.length === 0) {
      try {
        const stored = localStorage.getItem('clipSqueeze_performance');
        if (stored) {
          this.metrics = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load performance metrics:', error);
      }
    }
    
    return [...this.metrics];
  }

  static getAverageCompressionTime(): number {
    const metrics = this.getMetrics();
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, metric) => sum + metric.compressionTime, 0);
    return total / metrics.length;
  }

  static getAverageCompressionRatio(): number {
    const metrics = this.getMetrics();
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, metric) => sum + metric.compressionRatio, 0);
    return total / metrics.length;
  }

  static getTotalSpaceSaved(): number {
    const metrics = this.getMetrics();
    return metrics.reduce((total, metric) => {
      return total + (metric.originalSize - metric.compressedSize);
    }, 0);
  }

  static clearMetrics() {
    this.metrics = [];
    try {
      localStorage.removeItem('clipSqueeze_performance');
    } catch (error) {
      console.warn('Failed to clear performance metrics:', error);
    }
  }

  static exportMetrics(): string {
    const metrics = this.getMetrics();
    const csv = [
      'Timestamp,Original Size (MB),Compressed Size (MB),Compression Ratio,Compression Time (s)',
      ...metrics.map(m => 
        `${new Date(m.timestamp).toISOString()},${(m.originalSize / (1024*1024)).toFixed(2)},${(m.compressedSize / (1024*1024)).toFixed(2)},${m.compressionRatio.toFixed(2)},${(m.compressionTime / 1000).toFixed(2)}`
      )
    ].join('\n');
    
    return csv;
  }
}
