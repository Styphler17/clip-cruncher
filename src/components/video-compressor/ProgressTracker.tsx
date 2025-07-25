
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { VideoPreview } from "./VideoPreview";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlay, 
  faDownload, 
  faRedo, 
  faTimes, 
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faSpinner,
  faHdd,
  faBolt
} from "@fortawesome/free-solid-svg-icons";

export interface CompressionJob {
  id: string;
  file: File;
  status: 'waiting' | 'processing' | 'completed' | 'error' | 'cancelled';
  progress: number;
  startTime?: number;
  endTime?: number;
  originalSize: number;
  compressedSize?: number;
  outputBlob?: Blob;
  error?: string;
  settings: {
    preset: string;
    crf: number;
    scale: number;
  };
}

interface ProgressTrackerProps {
  jobs: CompressionJob[];
  onCancelJob: (jobId: string) => void;
  onDownload: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0 || !isFinite(bytes)) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function calculateTimeRemaining(job: CompressionJob): string {
  if (!job.startTime || job.progress === 0) return 'Calculating...';
  
  const elapsed = (Date.now() - job.startTime) / 1000;
  const rate = job.progress / elapsed;
  const remaining = (100 - job.progress) / rate;
  
  if (!isFinite(remaining) || remaining <= 0) return 'Almost done...';
  
  return formatTime(Math.round(remaining));
}

export function ProgressTracker({ 
  jobs, 
  onCancelJob, 
  onDownload, 
  onRetry,
  className 
}: ProgressTrackerProps) {


  const activeJobs = jobs.filter(job => job.status === 'processing' || job.status === 'waiting');
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const errorJobs = jobs.filter(job => job.status === 'error');

  const totalProgress = jobs.length > 0 
    ? jobs.reduce((sum, job) => sum + job.progress, 0) / jobs.length 
    : 0;

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPlay} className="text-video-primary" />
              Compression Progress
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">
                {completedJobs.length}/{jobs.length} Complete
              </Badge>
              {errorJobs.length > 0 && (
                <Badge variant="destructive">
                  {errorJobs.length} Error{errorJobs.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            
              {activeJobs.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} />
                    {activeJobs.length} processing
                  </div>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faHdd} />
                    {formatBytes(jobs.reduce((sum, job) => sum + job.originalSize, 0))} total
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Job Progress */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const isActive = job.status === 'processing';
          const isCompleted = job.status === 'completed';
          const isError = job.status === 'error';
          const isWaiting = job.status === 'waiting';




          return (
            <div key={job.id} className="space-y-3">
              <Card className={cn(
                "transition-smooth",
                isActive && "border-video-primary shadow-md",
                isCompleted && "border-video-success",
                isError && "border-video-danger"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      isCompleted ? "bg-video-success text-white" :
                      isError ? "bg-video-danger text-white" :
                      isActive ? "bg-video-primary text-white animate-pulse-glow" :
                      "bg-video-secondary text-muted-foreground"
                    )}>
                      {isActive && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                      {isCompleted && <FontAwesomeIcon icon={faCheckCircle} />}
                      {isWaiting && <FontAwesomeIcon icon={faClock} />}
                      {isError && <FontAwesomeIcon icon={faExclamationTriangle} />}
                      {job.status === 'cancelled' && <FontAwesomeIcon icon={faTimes} />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      {/* File Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-medium truncate">{job.file.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Original: {formatBytes(job.originalSize)}</span>
                            <span>•</span>
                            <span>{job.settings.preset} preset</span>
                            {job.compressedSize && (
                              <>
                                <span>•</span>
                                <span className="text-video-success">
                                  Compressed: {formatBytes(job.compressedSize)} ({Math.round(job.originalSize > 0 ? ((job.originalSize - job.compressedSize) / job.originalSize) * 100 : 0)}% saved)
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {isCompleted && (
                            <Button
                              size="sm"
                              onClick={() => onDownload(job.id)}
                              className="h-8 px-3 bg-video-success hover:bg-video-success/90"
                            >
                              <FontAwesomeIcon icon={faDownload} className="mr-1" />
                              Download
                            </Button>
                          )}
                          
                          {isError && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onRetry(job.id)}
                              className="h-8 px-3"
                            >
                              <FontAwesomeIcon icon={faRedo} className="mr-1" />
                              Retry
                            </Button>
                          )}

                          {(isActive || isWaiting) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onCancelJob(job.id)}
                              className="h-8 px-3 text-video-danger hover:text-video-danger hover:bg-video-danger/10"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {!isError && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {isWaiting ? 'Waiting...' :
                               isCompleted ? 'Completed' :
                               `${Math.round(job.progress)}%`}
                            </span>
                            {isActive && (
                              <span className="text-muted-foreground">
                                ETA: {calculateTimeRemaining(job)}
                              </span>
                            )}
                            {isCompleted && job.startTime && job.endTime && (
                              <span className="text-muted-foreground">
                                {formatTime(Math.floor((job.endTime - job.startTime) / 1000))}
                              </span>
                            )}
                          </div>
                          <Progress
                            value={job.progress}
                            className={cn(
                              "h-1.5",
                              isCompleted && "[&>div]:bg-video-success"
                            )}
                          />
                        </div>
                      )}

                      {/* Error Message */}
                      {isError && job.error && (
                        <div className="p-2 bg-video-danger/10 border border-video-danger/20 rounded text-xs text-video-danger flex items-center gap-2">
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                          {job.error}
                        </div>
                      )}

                      {/* Completion Stats */}
                      {isCompleted && job.compressedSize && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faHdd} />
                            {formatBytes(job.originalSize)} → {formatBytes(job.compressedSize)}
                          </div>
                          <div className="flex items-center gap-1 text-video-success">
                            <FontAwesomeIcon icon={faBolt} />
                            {Math.round(job.originalSize > 0 ? ((job.originalSize - job.compressedSize) / job.originalSize) * 100 : 0)}% smaller
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Preview for Completed Jobs */}
              {isCompleted && job.outputBlob && (
                <VideoPreview
                  originalFile={job.file}
                  compressedBlob={job.outputBlob}
                  originalSize={job.originalSize}
                  compressedSize={job.compressedSize}
                  onDownload={() => onDownload(job.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}