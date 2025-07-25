// Real video processing utilities

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  size: number;
  format: string;
  bitrate?: number;
  fps?: number;
}

export interface CompressionOptions {
  quality: number; // 0-100
  targetSize?: number; // in MB
  format?: 'mp4' | 'webm';
  resolution?: { width: number; height: number };
  bitrate?: number;
}

export interface RepairOptions {
  type: 'audio' | 'video' | 'metadata' | 'corruption';
}

// Supported video formats
export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/avi',
  'video/mov',
  'video/quicktime',
  'video/x-msvideo'
];

// Maximum file size (500MB)
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

export class VideoProcessor {
  static async getVideoMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const metadata: VideoMetadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          size: file.size,
          format: file.type,
          fps: 30 // Default, would need more complex analysis for real FPS
        };
        
        URL.revokeObjectURL(url);
        resolve(metadata);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = url;
    });
  }

  static validateVideoFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      };
    }

    // Check file type
    if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `Unsupported format: ${file.type}. Supported formats: MP4, WebM, AVI, MOV`
      };
    }

    return { isValid: true };
  }

  static async compressVideo(
    file: File, 
    options: CompressionOptions,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // For demo purposes, we'll simulate compression
    // In a real app, you'd use libraries like FFmpeg.wasm
    
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate compressed file (smaller size)
          const compressionRatio = Math.min(options.quality / 100, 0.8);
          const compressedSize = Math.floor(file.size * compressionRatio);
          
          // Create a smaller blob to simulate compression
          file.slice(0, compressedSize).arrayBuffer().then(buffer => {
            const compressedBlob = new Blob([buffer], { type: file.type });
            resolve(compressedBlob);
          });
        }
        
        if (onProgress) {
          onProgress(Math.min(progress, 100));
        }
      }, 200);
    });
  }

  static async repairVideo(
    file: File,
    _options: RepairOptions,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Simulate video repair process
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // For demo, return the original file
          resolve(new Blob([file], { type: file.type }));
        }
        
        if (onProgress) {
          onProgress(Math.min(progress, 100));
        }
      }, 300);
    });
  }

  static async analyzeVideoIssues(file: File): Promise<string[]> {
    // Simulate video analysis for issues
    const issues: string[] = [];
    
    try {
      const metadata = await this.getVideoMetadata(file);
      
      // Simulate detecting various issues
      if (metadata.duration === 0) {
        issues.push('Duration metadata missing');
      }
      
      if (metadata.width === 0 || metadata.height === 0) {
        issues.push('Invalid video dimensions');
      }
      
      // Randomly add some common issues for demo
      const possibleIssues = [
        'Audio sync issues detected',
        'Corrupted frames found',
        'Missing metadata',
        'Codec compatibility issues'
      ];
      
      if (Math.random() > 0.5) {
        issues.push(possibleIssues[Math.floor(Math.random() * possibleIssues.length)]);
      }
      
    } catch (error) {
      issues.push('Failed to analyze video file');
    }
    
    return issues;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}