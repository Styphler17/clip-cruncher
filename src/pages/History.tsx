import { useState, useEffect } from "react";
import { Search, Download, Trash2, Calendar, FileVideo, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarToggle } from "@/components/layout/SidebarToggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  getCompressionHistory, 
  clearHistory, 
  exportHistory, 
  getHistoryStats,
  type CompressionHistoryItem 
} from "@/lib/storage";

function History() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<CompressionHistoryItem[]>([]);
  const [stats, setStats] = useState({ totalCompressions: 0, totalSpaceSaved: 0, avgCompression: 0 });

  useEffect(() => {
    const loadHistory = () => {
      const historyData = getCompressionHistory();
      setHistory(historyData);
      setStats(getHistoryStats());
    };
    
    loadHistory();
    
    // Listen for storage changes
    const handleStorageChange = () => loadHistory();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredHistory = history.filter(item =>
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setStats({ totalCompressions: 0, totalSpaceSaved: 0, avgCompression: 0 });
    toast({
      title: "History Cleared",
      description: "All compression history has been cleared.",
    });
  };

  const handleExportHistory = () => {
    if (history.length === 0) {
      toast({
        title: "No History to Export",
        description: "There's no compression history to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportHistory();
    toast({
      title: "History Exported",
      description: "Compression history has been exported as CSV.",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="page-header">
        <div className="flex items-center gap-4">
          <SidebarToggle className="lg:hidden" />
          <h1 className="text-lg font-semibold">History</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="page-content space-y-8">
        {/* Title Section */}
        <section className="section-spacing">
          <div className="flex-between">
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
        </section>

        {/* Stats Cards */}
        <section className="section-spacing">
          <div className="grid-responsive grid-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Compressions</CardTitle>
                <FileVideo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-video-primary">{stats.totalCompressions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Space Saved</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-video-success">
                  {(stats.totalSpaceSaved / (1024 * 1024 * 1024)).toFixed(1)} GB
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Compression</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-video-warning">{stats.avgCompression.toFixed(0)}%</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Search */}
        <section>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </section>

        {/* History Table */}
        <section className="section-spacing">
          {filteredHistory.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="scrollable">
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
                          <TableCell className="font-medium text-ellipsis">{item.fileName}</TableCell>
                          <TableCell>{(item.originalSize / (1024 * 1024)).toFixed(1)} MB</TableCell>
                          <TableCell>{(item.compressedSize / (1024 * 1024)).toFixed(1)} MB</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-video-success/10 text-video-success">
                              {item.compressionRatio.toFixed(1)}%
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
                </div>
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
        </section>
      </div>
    </>
  );
}

export default History;