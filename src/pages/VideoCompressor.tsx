import { useState, useCallback } from "react";
import { DropZone } from "@/components/video-compressor/DropZone";
import { CompressionSettings, COMPRESSION_PRESETS } from "@/components/video-compressor/CompressionSettings";
import { ProgressTracker, CompressionJob } from "@/components/video-compressor/ProgressTracker";
import { VideoPreview } from "@/components/video-compressor/VideoPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Zap, Eye, FileVideo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToHistory } from "@/lib/storage";
import { realVideoProcessor } from "@/lib/realVideoProcessor";

export default function VideoCompressor() {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [customSettings, setCustomSettings] = useState({
    crf: 25,
    preset: 'medium',
    scale: 100,
    preserveQuality: false,
    outputFormat: 'mp4'
  });
  const [compressionJobs, setCompressionJobs] = useState<CompressionJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files Added",
      description: `${files.length} file${files.length > 1 ? 's' : ''} added to compression queue.`,
    });
  }, [toast]);

  const startJobProcessing = useCallback(async (jobId: string) => {
    const currentJob = compressionJobs.find(j => j.id === jobId);
    if (!currentJob?.file) return;

    setCompressionJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'processing' as const, startTime: Date.now() }
        : job
    ));

    try {
      // Validate the file first
      const validation = realVideoProcessor.validateVideoFile(currentJob.file);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid video file');
      }

      // Prepare compression options
      const compressionOptions = {
        crf: currentJob.settings.crf || 25,
        preset: currentJob.settings.preset || 'medium',
        scale: currentJob.settings.scale || 100,
        outputFormat: currentJob.settings.outputFormat || 'mp4'
      };

      // Start real compression
      const compressedBlob = await realVideoProcessor.compressVideo(
        currentJob.file,
        compressionOptions,
        (progress: number) => {
          setCompressionJobs(prev => prev.map(job => 
            job.id === jobId && job.status === 'processing'
              ? { ...job, progress }
              : job
          ));
        }
      );

      // Calculate compression ratio
      const originalSize = currentJob.file.size;
      const compressedSize = compressedBlob.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

      // Complete the job
      const completedJob = {
        ...currentJob,
        status: 'completed' as const,
        progress: 100,
        endTime: Date.now(),
        compressedSize,
        outputBlob: compressedBlob
      };
      
      setCompressionJobs(prev => prev.map(j => 
        j.id === jobId ? completedJob : j
      ));
      
      // Get video metadata for history
      let duration = "Unknown";
      try {
        const metadata = await realVideoProcessor.getVideoMetadata(currentJob.file);
        duration = realVideoProcessor.formatDuration(metadata.duration);
      } catch (error) {
        console.warn('Could not get video metadata:', error);
      }
      
      addToHistory({
        fileName: currentJob.file.name,
        originalSize,
        compressedSize,
        compressionRatio,
        preset: currentJob.settings.preset,
        duration,
        status: 'completed',
        fileType: currentJob.file.type,
        settings: currentJob.settings
      });

      toast({
        title: "Compression Complete",
        description: `${currentJob.file.name} compressed successfully. Size reduced by ${compressionRatio.toFixed(1)}%`,
      });

    } catch (error) {
      console.error('Compression failed:', error);
      toast({
        title: "Compression Failed",
        description: error instanceof Error ? error.message : "An error occurred during compression.",
        variant: "destructive",
      });
      setCompressionJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status: 'error' as const, error: error instanceof Error ? error.message : 'Compression failed' } : j
      ));
    }
  }, [compressionJobs, toast]);

  const simulateCompression = useCallback((jobs: CompressionJob[]) => {
    jobs.forEach((job, index) => {
      setTimeout(() => {
        startJobProcessing(job.id);
      }, index * 1000);
    });
  }, [startJobProcessing]);

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
        scale: settings.scale,
        outputFormat: customSettings.outputFormat
      }
    }));
    
    setCompressionJobs(prev => [...prev, ...newJobs]);
    setSelectedFiles([]);
    setIsProcessing(true);
    simulateCompression(newJobs);
    
    toast({
      title: "Compression Started",
      description: `Started compressing ${newJobs.length} file${newJobs.length > 1 ? 's' : ''}.`,
    });
  }, [selectedFiles, selectedPreset, customSettings, toast, simulateCompression]);

  const handleCancelJob = useCallback((jobId: string) => {
    setCompressionJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
    toast({
      title: "Job Cancelled",
      description: "Compression job has been cancelled.",
    });
  }, [toast]);

  const handleDownload = useCallback((jobId: string, customFilename?: string, format?: string) => {
    const job = compressionJobs.find(j => j.id === jobId);
    if (job?.outputBlob) {
      try {
        const originalName = job.file.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        
        // Use custom filename and format if provided, otherwise use defaults
        const finalFilename = customFilename || `${nameWithoutExt}_compressed`;
        const finalFormat = format || 'mp4';
        const fullFilename = `${finalFilename}.${finalFormat}`;
        
        // Create a new blob with the correct MIME type for the selected format
        const mimeType = `video/${finalFormat === 'mov' ? 'quicktime' : finalFormat}`;
        const formattedBlob = new Blob([job.outputBlob], { type: mimeType });
        
        const url = URL.createObjectURL(formattedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fullFilename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        toast({
          title: "Download Started",
          description: `Downloading compressed ${fullFilename}`,
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Unable to download the compressed file. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Download Failed",
        description: "No compressed file available for download.",
        variant: "destructive",
      });
    }
  }, [compressionJobs, toast]);

  const handleRetry = useCallback((jobId: string) => {
    setCompressionJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'waiting' as const, progress: 0, error: undefined } : job
    ));
    setTimeout(() => {
      startJobProcessing(jobId);
    }, 1000);
    toast({
      title: "Retrying",
      description: "Retrying compression job...",
    });
  }, [startJobProcessing, toast]);

  return (
    <div className="flex-1 p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">Video Compressor</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Professional video compression with zero uploads. Process files locally with advanced settings.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-video-success">
                <div className="w-2 h-2 rounded-full bg-video-success animate-pulse-slow"></div>
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-video-info">
                <div className="w-2 h-2 rounded-full bg-video-info animate-pulse-slow"></div>
                <span>No Size Limits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-video-warning">
                <div className="w-2 h-2 rounded-full bg-video-warning animate-pulse-slow"></div>
                <span>All Formats</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Bar */}
      <div className="flex items-center gap-4 p-4 bg-gradient-surface rounded-2xl border shadow-sm">
        <Button
          onClick={handleStartCompression}
          disabled={selectedFiles.length === 0 || isProcessing}
          size="lg"
          className="bg-gradient-primary hover:shadow-glow transition-spring px-8"
        >
          <Zap className="w-5 h-5 mr-2" />
          Start Compression
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedFiles([]);
            setCompressionJobs([]);
          }}
          disabled={selectedFiles.length === 0 && compressionJobs.length === 0}
          className="border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-spring"
        >
          Clear Files
        </Button>
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedFiles.length}</span> file{selectedFiles.length === 1 ? '' : 's'} selected
          </div>
          {selectedFiles.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Total: <span className="font-medium text-foreground">
                {(selectedFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column - File Upload, Progress Tracking, and Previews */}
        <div className="lg:col-span-3 space-y-6">
          {/* Enhanced File Upload */}
          <Card className="glass border shadow-colored">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                Upload Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DropZone
                onFilesSelected={handleFilesSelected}
              />
            </CardContent>
          </Card>

          {/* Enhanced Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <Card className="glass border shadow-sm animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Selected Files Preview
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-video-primary/10 text-video-primary rounded-full text-sm font-medium">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="glass rounded-xl p-4 transition-spring hover:shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-secondary flex items-center justify-center">
                            <FileVideo className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground block">{file.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {file.type || 'Video file'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Original size
                          </div>
                        </div>
                      </div>
                      <VideoPreview
                        originalFile={file}
                        originalSize={file.size}
                        onDownload={() => {}}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Tracking */}
          <ProgressTracker
            jobs={compressionJobs}
            onCancelJob={handleCancelJob}
            onDownload={handleDownload}
            onRetry={handleRetry}
          />
        </div>
        {/* Enhanced Right Column - Compression Settings */}
        <div className="space-y-6">
          <Card className="glass border shadow-colored sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                Compression Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompressionSettings
                selectedPreset={selectedPreset}
                onPresetChange={setSelectedPreset}
                customSettings={customSettings}
                onCustomSettingsChange={setCustomSettings}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}