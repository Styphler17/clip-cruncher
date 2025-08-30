import { Shield, Zap, Globe, Download, Code, Users, Star, Github, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarToggle } from "@/components/layout/SidebarToggle";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "100% Private & Secure",
    description: "All processing happens locally in your browser. No files are uploaded to any server, ensuring complete privacy."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by WebAssembly and FFmpeg for efficient video compression without quality compromise."
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "No installation required. Works on any modern browser across Windows, Mac, Linux, and mobile devices."
  },
  {
    icon: Download,
    title: "No Size Limits",
    description: "Process files of any size with support for all major video formats and codecs - no file size restrictions."
  }
];

const techStack = [
  { name: "React", description: "Modern UI framework" },
  { name: "TypeScript", description: "Type-safe development" },
  { name: "Tailwind CSS", description: "Responsive styling" },
  { name: "FFmpeg.wasm", description: "Video processing engine" },
  { name: "WebAssembly", description: "High-performance computing" },
  { name: "Vite", description: "Fast build tool" }
];

const supportedFormats = [
  "MP4", "AVI", "MOV", "MKV", "WMV", 
  "FLV", "WebM", "3GP", "OGV", "M4V", "QT"
];

const stats = [
  { label: "Supported Formats", value: "11+" },
  { label: "Max File Size", value: "Unlimited" },
  { label: "Compression Presets", value: "6" },
  { label: "Privacy Level", value: "100%" }
];

function About() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <header className="page-header">
        <div className="flex items-center gap-4">
          <SidebarToggle className="lg:hidden" />
          <h1 className="text-lg font-semibold">About</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="page-content space-y-8">
        {/* Hero Section */}
        <section className="section-spacing text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">About ClipSqueeze</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            A professional, privacy-focused video compression tool that runs entirely in your browser. 
            No uploads, no registration, no compromises.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              Privacy First
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Client-Side Only
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Code className="w-3 h-3 mr-1" />
              Open Source
            </Badge>
          </div>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-video-primary hover:bg-video-primary-dark"
          >
            <Play className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </section>

        {/* Key Features */}
        <section className="section-spacing">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Our Video Compressor?</h2>
          <div className="grid-responsive grid-2">
            {features.map((feature, index) => (
              <Card key={index} className="card-module">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-video-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-video-primary" />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Statistics */}
        <section className="section-spacing">
          <h2 className="text-2xl font-semibold mb-6 text-center">By the Numbers</h2>
          <div className="grid-responsive grid-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-video-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Technology Stack */}
        <section className="section-spacing">
          <h2 className="text-2xl font-semibold mb-6">Built With Modern Technology</h2>
          <div className="grid-responsive grid-3">
            {techStack.map((tech, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Supported Formats */}
        <section className="section-spacing">
          <h2 className="text-2xl font-semibold mb-6">Supported Video Formats</h2>
          <Card className="card-module">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our compressor supports all major video formats and codecs:
              </p>
              <div className="flex flex-wrap gap-2">
                {supportedFormats.map((format) => (
                  <Badge key={format} variant="outline" className="text-sm">
                    {format}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Privacy & Security */}
        <section className="section-spacing">
          <h2 className="text-2xl font-semibold mb-6">Privacy & Security</h2>
          <Card className="card-module">
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-video-success mt-0.5" />
                <div>
                  <h3 className="font-semibold">No Data Collection</h3>
                  <p className="text-muted-foreground text-sm">We don't track, store, or analyze your usage data.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-video-success mt-0.5" />
                <div>
                  <h3 className="font-semibold">Local Processing Only</h3>
                  <p className="text-muted-foreground text-sm">All video processing happens on your device using WebAssembly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-video-success mt-0.5" />
                <div>
                  <h3 className="font-semibold">No File Uploads</h3>
                  <p className="text-muted-foreground text-sm">Your videos never leave your computer, ensuring complete privacy.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Open Source */}
        <section className="section-spacing text-center">
          <h2 className="text-2xl font-semibold mb-4">Open Source & Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Video Compressor is built with transparency in mind. The source code is available for review, 
            contributions, and learning. Join our community of developers and users.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline">
              <Github className="w-4 h-4 mr-2" />
              View Source Code
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Join Community
            </Button>
            <Button variant="outline">
              <Star className="w-4 h-4 mr-2" />
              Give Feedback
            </Button>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            Built with ❤️ for privacy-conscious users who value quality and performance.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;