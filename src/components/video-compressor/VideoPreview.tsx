import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlay, 
  faPause, 
  faExpand, 
  faDownload,
  faFileVideo,
  faCompressArrowsAlt,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

interface VideoPreviewProps {
  originalFile: File;
  compressedBlob?: Blob;
  originalSize: number;
  compressedSize?: number;
  onDownload: () => void;
}

export function VideoPreview({ 
  originalFile, 
  compressedBlob, 
  originalSize, 
  compressedSize,
  onDownload 
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<'original' | 'compressed'>('compressed');
  const videoRef = useRef<HTMLVideoElement>(null);

  const originalUrl = URL.createObjectURL(originalFile);
  const compressedUrl = compressedBlob ? URL.createObjectURL(compressedBlob) : null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = compressedSize ? ((originalSize - compressedSize) / originalSize * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFileVideo} className="text-video-primary" />
            <span className="truncate">{originalFile.name}</span>
          </div>
          {compressedBlob && (
            <Button
              onClick={onDownload}
              size="sm"
              className="bg-video-success hover:bg-video-success/90"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            src={currentVideo === 'original' ? originalUrl : compressedUrl || originalUrl}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls={false}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlay}
                variant="secondary"
                size="lg"
                className="bg-white/90 hover:bg-white text-black"
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white/90 hover:bg-white text-black"
                  >
                    <FontAwesomeIcon icon={faExpand} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full p-2">
                  <DialogHeader>
                    <DialogTitle className="truncate">{originalFile.name}</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={currentVideo === 'original' ? originalUrl : compressedUrl || originalUrl}
                      className="w-full h-full object-contain"
                      controls
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Video Toggle */}
        {compressedBlob && (
          <div className="flex gap-2">
            <Button
              variant={currentVideo === 'original' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentVideo('original')}
              className="flex-1"
            >
              Original
            </Button>
            <Button
              variant={currentVideo === 'compressed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentVideo('compressed')}
              className="flex-1"
            >
              Compressed
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faFileVideo} className="text-muted-foreground" />
              Original
            </div>
            <div className="text-2xl font-bold">{formatBytes(originalSize)}</div>
          </div>
          
          {compressedSize && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faCompressArrowsAlt} className="text-video-primary" />
                Compressed
              </div>
              <div className="text-2xl font-bold text-video-success">
                {formatBytes(compressedSize)}
              </div>
            </div>
          )}
        </div>

        {/* Compression Stats */}
        {compressedSize && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-video-primary" />
                <span className="font-medium">Compression Stats</span>
              </div>
              <Badge variant="secondary" className="bg-video-success/10 text-video-success">
                {compressionRatio.toFixed(1)}% saved
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Size Reduction</div>
                <div className="font-medium">
                  {formatBytes(originalSize - compressedSize)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">New Size Ratio</div>
                <div className="font-medium">
                  {((compressedSize / originalSize) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}