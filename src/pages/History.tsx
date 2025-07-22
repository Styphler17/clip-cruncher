import { useState } from "react";
import { Search, Download, Trash2, Calendar, FileVideo, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { VideoCompressorSidebar } from "@/components/video-compressor/VideoCompressorSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const compressionHistory = [
  {
    id: 1,
    fileName: "vacation_video.mp4",
    originalSize: "156.7 MB",
    compressedSize: "47.2 MB",
    compressionRatio: "70%",
    preset: "Balanced",
    date: "2024-01-20",
    time: "14:32",
    duration: "2m 15s",
    status: "completed"
  },
  {
    id: 2,
    fileName: "presentation_recording.mov",
    originalSize: "324.1 MB",
    compressedSize: "89.5 MB",
    compressionRatio: "72%",
    preset: "High Quality",
    date: "2024-01-19",
    time: "09:45",
    duration: "4m 33s",
    status: "completed"
  },
  {
    id: 3,
    fileName: "family_gathering.avi",
    originalSize: "892.3 MB",
    compressedSize: "198.7 MB",
    compressionRatio: "78%",
    preset: "Aggressive",
    date: "2024-01-18",
    time: "16:20",
    duration: "12m 48s",
    status: "completed"
  }
];

function HistoryContent() {
  const { toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [history] = useState(compressionHistory);

  const filteredHistory = history.filter(item =>
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearHistory = () => {
    // In a real app, this would clear localStorage
    console.log("Clearing history...");
  };

  const handleExportHistory = () => {
    // In a real app, this would export to CSV/JSON
    console.log("Exporting history...");
  };

  return (
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
        <h1 className="text-lg font-semibold">History</h1>
      </header>

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compression History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your video compression history
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportHistory}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleClearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compressions</CardTitle>
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-primary">{history.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Space Saved</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-success">1.2 GB</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Compression</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-video-warning">73%</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* History Table */}
      {filteredHistory.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Original Size</TableHead>
                  <TableHead>Compressed Size</TableHead>
                  <TableHead>Saved</TableHead>
                  <TableHead>Preset</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.fileName}</TableCell>
                    <TableCell>{item.originalSize}</TableCell>
                    <TableCell>{item.compressedSize}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-video-success/10 text-video-success">
                        {item.compressionRatio}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.preset}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {item.date} {item.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-video-success text-white">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No compression history found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No results match your search." : "Start compressing videos to see your history here."}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}

export default function History() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <VideoCompressorSidebar />
        <HistoryContent />
      </div>
    </SidebarProvider>
  );
}