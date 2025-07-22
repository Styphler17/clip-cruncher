import { useState, useCallback } from "react";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import { DropZone } from "@/components/video-compressor/DropZone";
import { CompressionSettings, COMPRESSION_PRESETS } from "@/components/video-compressor/CompressionSettings";
import { ProgressTracker, CompressionJob } from "@/components/video-compressor/ProgressTracker";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Zap, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function VideoCompressorContent() {
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressionJobs, setCompressionJobs] = useState<CompressionJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [customSettings, setCustomSettings] = useState({
    crf: 25,
    preset: 'medium',
    scale: 100,
    preserveQuality: false
  });

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files Added",
      description: `${files.length} file${files.length > 1 ? 's' : ''} added to compression queue.`,
    });
  }, [toast]);

  const handleStartCompression = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select video files to compress.",
        variant: "destructive",
      });
      return;
    }

    const presetData = COMPRESSION_PRESETS.find(p => p.id === selectedPreset);
    const settings = selectedPreset === 'custom' ? customSettings : {
      crf: presetData?.crf || 25,
      preset: presetData?.preset || 'medium',
      scale: presetData?.scale || 100,
      preserveQuality: customSettings.preserveQuality
    };

    const newJobs: CompressionJob[] = selectedFiles.map((file, index) => ({
      id: `job-${Date.now()}-${index}`,
      file,
      status: 'waiting' as const,
      progress: 0,
      originalSize: file.size,
      settings: {
        preset: selectedPreset,
        crf: settings.crf,
        scale: settings.scale
      }
    }));

    setCompressionJobs(prev => [...prev, ...newJobs]);
    setSelectedFiles([]);
    setIsProcessing(true);

    // Simulate compression process
    simulateCompression(newJobs);

    toast({
      title: "Compression Started",
      description: `Started compressing ${newJobs.length} file${newJobs.length > 1 ? 's' : ''}.`,
    });
  }, [selectedFiles, selectedPreset, customSettings, toast]);

  const simulateCompression = (jobs: CompressionJob[]) => {
    jobs.forEach((job, index) => {
      setTimeout(() => {
        startJobProcessing(job.id);
      }, index * 1000);
    });
  };

  const startJobProcessing = (jobId: string) => {
    setCompressionJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'processing' as const, startTime: Date.now() }
        : job
    ));

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setCompressionJobs(prev => {
        const updated = prev.map(job => {
          if (job.id === jobId && job.status === 'processing') {
            const newProgress = Math.min(job.progress + Math.random() * 10, 100);
            
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              
              // Simulate compression result
              const compressionRatio = Math.random() * 0.4 + 0.2; // 20-60% reduction
              const compressedSize = Math.floor(job.originalSize * (1 - compressionRatio));
              
              return {
                ...job,
                status: 'completed' as const,
                progress: 100,
                endTime: Date.now(),
                compressedSize,
                outputBlob: new Blob(['simulated compressed video'], { type: 'video/mp4' })
              };
            }
            
            return { ...job, progress: newProgress };
          }
          return job;
        });
        return updated;
      });
    }, 200);
  };

  const handleCancelJob = useCallback((jobId: string) => {
    setCompressionJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
    
    toast({
      title: "Job Cancelled",
      description: "Compression job has been cancelled.",
    });
  }, [toast]);

  const handleDownload = useCallback((jobId: string) => {
    const job = compressionJobs.find(j => j.id === jobId);
    if (job?.outputBlob) {
      const url = URL.createObjectURL(job.outputBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${job.file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: `Downloading compressed ${job.file.name}`,
      });
    }
  }, [compressionJobs, toast]);

  const handleRetry = useCallback((jobId: string) => {
    setCompressionJobs(prev => prev.map(job =>
      job.id === jobId 
        ? { ...job, status: 'waiting' as const, progress: 0, error: undefined }
        : job
    ));
    
    setTimeout(() => startJobProcessing(jobId), 1000);
    
    toast({
      title: "Retrying Compression",
      description: "Restarting the compression process.",
    });
  }, [toast]);

  const handleClearCompleted = useCallback(() => {
    setCompressionJobs(prev => prev.filter(job => 
      job.status !== 'completed' && job.status !== 'cancelled'
    ));
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <VideoCompressorSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="h-14 border-b bg-background flex items-center px-4 lg:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Clip Cruncher</h1>
          </header>

          {/* Desktop header */}
          <header className="hidden lg:block border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Clip Cruncher</h1>
                <p className="text-sm text-muted-foreground">
                  Compress videos instantly in your browser
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {compressionJobs.filter(j => j.status === 'completed').length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCompleted}
                  >
                    Clear Completed
                  </Button>
                )}
                
                <Button
                  onClick={handleStartCompression}
                  disabled={selectedFiles.length === 0 || isProcessing}
                  size="lg"
                  className="bg-video-primary hover:bg-video-primary-dark"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {selectedFiles.length > 0 
                    ? `Compress ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`
                    : 'Start Compression'
                  }
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* File Upload Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-video-primary" />
                      Select Videos to Compress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DropZone
                      onFilesSelected={handleFilesSelected}
                      disabled={isProcessing}
                    />
                    
                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h3 className="font-medium text-foreground">
                          Selected Files ({selectedFiles.length})
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-video-secondary/30 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="text-video-danger hover:text-video-danger hover:bg-video-danger/10"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Progress Section */}
                {compressionJobs.length > 0 && (
                  <ProgressTracker
                    jobs={compressionJobs}
                    onCancelJob={handleCancelJob}
                    onDownload={handleDownload}
                    onRetry={handleRetry}
                  />
                )}
              </div>

              {/* Settings Section */}
              <div className="space-y-6">
                <CompressionSettings
                  selectedPreset={selectedPreset}
                  onPresetChange={setSelectedPreset}
                  customSettings={customSettings}
                  onCustomSettingsChange={setCustomSettings}
                />

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Session Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Files Processed:</span>
                      <span className="font-medium">
                        {compressionJobs.filter(j => j.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Saved:</span>
                      <span className="font-medium text-video-success">
                        {compressionJobs
                          .filter(j => j.compressedSize)
                          .reduce((sum, j) => sum + (j.originalSize - (j.compressedSize || 0)), 0) > 0
                          ? `${((compressionJobs
                              .filter(j => j.compressedSize)
                              .reduce((sum, j) => sum + (j.originalSize - (j.compressedSize || 0)), 0)
                            ) / (1024 * 1024)).toFixed(1)} MB`
                          : '0 MB'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Queue Length:</span>
                      <span className="font-medium">
                        {compressionJobs.filter(j => j.status === 'waiting' || j.status === 'processing').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function VideoCompressor() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <VideoCompressorSidebar />
        <VideoCompressorContent />
      </div>
    </SidebarProvider>
  );
}