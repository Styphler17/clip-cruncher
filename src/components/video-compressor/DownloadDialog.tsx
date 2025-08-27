import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

const OUTPUT_FORMATS = [
  { value: 'mp4', label: 'MP4 (Recommended)', description: 'Best compatibility' },
  { value: 'webm', label: 'WebM', description: 'Web optimized' },
  { value: 'avi', label: 'AVI', description: 'Legacy format' },
  { value: 'mov', label: 'MOV', description: 'QuickTime format' },
  { value: 'mkv', label: 'MKV', description: 'Matroska format' }
];

interface DownloadDialogProps {
  originalFileName: string;
  onDownload: (filename: string, format: string) => void;
  children: React.ReactNode;
}

export function DownloadDialog({ 
  originalFileName, 
  onDownload, 
  children 
}: DownloadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  
  // Get filename without extension
  const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  const [customFilename, setCustomFilename] = useState(`${nameWithoutExt}_compressed`);

  const handleDownload = () => {
    const finalFilename = `${customFilename}.${selectedFormat}`;
    onDownload(finalFilename, selectedFormat);
    setOpen(false);
  };

  const selectedFormatData = OUTPUT_FORMATS.find(f => f.value === selectedFormat);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-video-primary" />
            Download Video
          </DialogTitle>
          <DialogDescription>
            Choose your preferred filename and output format for the download.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Filename Input */}
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder="Enter filename (without extension)" 
            />
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Output Format</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{format.label}</span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Preview:</div>
            <div className="font-medium">
              {customFilename}.{selectedFormat}
            </div>
            {selectedFormatData && (
              <div className="text-xs text-muted-foreground mt-1">
                {selectedFormatData.description}
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload} className="bg-video-primary hover:bg-video-primary-dark">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}