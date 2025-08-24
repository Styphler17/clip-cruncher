import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FileUploadZone({
  onFilesAccepted,
  acceptedTypes = ['video/*'],
  maxSize = Infinity, // No size limit
  multiple = true,
  className,
  disabled = false
}: FileUploadZoneProps) {
  const [errors, setErrors] = React.useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = [];
    
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors: fileErrors }) => {
      fileErrors.forEach((error: any) => {
        switch (error.code) {
          case 'file-too-large':
            if (maxSize !== Infinity) {
              newErrors.push(`${file.name}: File size too large (max ${Math.round(maxSize / (1024 * 1024 * 1024))}GB)`);
            }
            break;
          case 'file-invalid-type':
            newErrors.push(`${file.name}: Invalid file type`);
            break;
          default:
            newErrors.push(`${file.name}: ${error.message}`);
        }
      });
    });

    setErrors(newErrors);

    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
  }, [onFilesAccepted, maxSize]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple,
    disabled
  });

  const clearErrors = () => setErrors([]);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isDragActive && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          disabled && "opacity-50 cursor-not-allowed",
          !isDragActive && !isDragReject && "border-muted-foreground/25"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={cn(
            "p-3 rounded-full",
            isDragActive && "bg-primary text-primary-foreground",
            isDragReject && "bg-destructive text-destructive-foreground",
            !isDragActive && !isDragReject && "bg-muted text-muted-foreground"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragActive 
                ? "Drop files here" 
                : isDragReject 
                ? "Invalid file type" 
                : "Drag & drop videos here"}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {isDragReject 
                ? `Only ${acceptedTypes.join(', ')} files are allowed`
                : `or click to select files (no size limit)`}
            </p>
          </div>
          
          {!disabled && (
            <Button variant="outline" type="button">
              Select Files
            </Button>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Upload Errors:</p>
              <ul className="text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearErrors}
              className="ml-4 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}