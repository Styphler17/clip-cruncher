import { useCallback, useState } from "react";
import { Upload, FileVideo, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
}

const SUPPORTED_FORMATS = [
  'video/mp4',
  'video/avi', 
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/webm',
  'video/3gpp',
  'video/ogg',
  'video/x-matroska'
];

export function DropZone({ 
  onFilesSelected, 
  maxFiles = 10, 
  maxFileSize = Infinity, // No size limit
  disabled = false,
  className 
}: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: FileList): { valid: File[], errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!SUPPORTED_FORMATS.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|wmv|flv|webm|3gp|ogv|m4v|qt)$/i)) {
        newErrors.push(`${file.name}: Unsupported format`);
        return;
      }

      // Check file size only if maxFileSize is not Infinity
      if (maxFileSize !== Infinity && file.size > maxFileSize) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
        newErrors.push(`${file.name}: File too large (${sizeMB}MB > ${maxSizeMB}MB)`);
        return;
      }

      validFiles.push(file);
    });

    // Check total file count
    if (validFiles.length > maxFiles) {
      newErrors.push(`Too many files selected. Maximum ${maxFiles} files allowed.`);
      return { valid: [], errors: newErrors };
    }

    return { valid: validFiles, errors: newErrors };
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files?.length) {
      const { valid, errors } = validateFiles(files);
      setErrors(errors);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  }, [onFilesSelected, disabled, maxFiles, maxFileSize]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const { valid, errors } = validateFiles(files);
      setErrors(errors);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
    // Reset input value to allow selecting the same files again
    e.target.value = '';
  }, [onFilesSelected, maxFiles, maxFileSize]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-spring cursor-pointer group overflow-hidden",
          "hover:border-video-primary hover:shadow-glow-sm hover:bg-gradient-primary/5",
          {
            "border-video-primary bg-gradient-primary/10 shadow-glow-sm scale-[1.02]": dragActive,
            "border-drop-zone-border bg-gradient-surface": !dragActive,
            "opacity-50 cursor-not-allowed": disabled,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-smooth"></div>
        <div className={cn(
          "absolute inset-0 transition-smooth",
          dragActive && "bg-gradient-primary/10"
        )}></div>
        
        <input
          id="file-input"
          type="file"
          multiple
          accept="video/*,.mp4,.avi,.mov,.mkv,.wmv,.flv,.webm,.3gp,.ogv,.m4v,.qt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={disabled}
          aria-label="Select video files"
          title="Select video files to compress"
        />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Enhanced Icon */}
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-spring shadow-lg relative overflow-hidden",
            dragActive 
              ? "bg-gradient-primary text-white shadow-glow animate-pulse-glow" 
              : "bg-gradient-secondary text-muted-foreground group-hover:bg-gradient-primary group-hover:text-white group-hover:shadow-glow-sm"
          )}>
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth"></div>
            <div className="relative z-10">
              {dragActive ? (
                <Upload className="w-10 h-10" />
              ) : (
                <FileVideo className="w-10 h-10 transition-spring group-hover:scale-110" />
              )}
            </div>
          </div>

          {/* Enhanced Text Content */}
          <div className="space-y-3 max-w-md">
            <h3 className={cn(
              "text-xl font-bold transition-smooth",
              dragActive 
                ? "text-video-primary" 
                : "text-foreground group-hover:text-video-primary"
            )}>
              {dragActive ? "Drop your videos here" : "Select or drop video files"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Supports all major formats: MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP, OGV, M4V, QT
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-video-success"></div>
                <span>Max {maxFiles} files</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-video-info"></div>
                <span>{maxFileSize === Infinity ? 'No size limit' : `Up to ${Math.round(maxFileSize / (1024 * 1024 * 1024))}GB per file`}</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {!disabled && (
            <div className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl border transition-spring",
              "border-video-primary/20 bg-video-primary/5 text-video-primary",
              "group-hover:border-video-primary/40 group-hover:bg-video-primary/10 group-hover:shadow-glow-sm"
            )}>
              <Upload className="w-5 h-5" />
              <span className="font-medium">Click to browse or drag & drop</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-video-danger/10 border border-video-danger/20 rounded-md">
              <AlertCircle className="w-4 h-4 text-video-danger mt-0.5 flex-shrink-0" />
              <span className="text-sm text-video-danger">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Supported Formats Info */}
      <div className="mt-4 p-3 bg-video-info/10 border border-video-info/20 rounded-md">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-video-info mt-0.5 flex-shrink-0" />
          <div className="text-sm text-video-info">
            <div className="font-medium mb-1">Supported Formats:</div>
            <div className="text-xs opacity-80">
              MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP, OGV, M4V, QT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}