import { useState } from "react";
import { Settings, Zap, Clock, Award, Gem, Eye, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CompressionPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  crf: number;
  preset: string;
  scale: number;
  estimatedReduction: string;
  color: string;
}

export const COMPRESSION_PRESETS: CompressionPreset[] = [
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Maximum compression, smaller files',
    icon: Zap,
    crf: 32,
    preset: 'fast',
    scale: 75,
    estimatedReduction: '60-80%',
    color: 'bg-video-danger'
  },
  {
    id: 'fast',
    name: 'Fast',
    description: 'Quick compression with good results',
    icon: Clock,
    crf: 28,
    preset: 'faster',
    scale: 100,
    estimatedReduction: '40-60%',
    color: 'bg-video-warning'
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Good balance of size and quality',
    icon: Award,
    crf: 25,
    preset: 'medium',
    scale: 100,
    estimatedReduction: '30-50%',
    color: 'bg-video-info'
  },
  {
    id: 'quality',
    name: 'High Quality',
    description: 'Better quality, larger files',
    icon: Gem,
    crf: 20,
    preset: 'slow',
    scale: 100,
    estimatedReduction: '15-30%',
    color: 'bg-video-success'
  },
  {
    id: 'lossless',
    name: 'Lossless',
    description: 'No quality loss, format optimization',
    icon: Eye,
    crf: 0,
    preset: 'veryslow',
    scale: 100,
    estimatedReduction: '5-15%',
    color: 'bg-video-primary'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Customize all settings manually',
    icon: Wrench,
    crf: 23,
    preset: 'medium',
    scale: 100,
    estimatedReduction: 'Variable',
    color: 'bg-video-accent'
  }
];

const ENCODING_PRESETS = [
  { value: 'ultrafast', label: 'Ultra Fast', speed: 'Fastest', quality: 'Lowest' },
  { value: 'superfast', label: 'Super Fast', speed: 'Very Fast', quality: 'Low' },
  { value: 'veryfast', label: 'Very Fast', speed: 'Fast', quality: 'Below Average' },
  { value: 'faster', label: 'Faster', speed: 'Above Average', quality: 'Average' },
  { value: 'fast', label: 'Fast', speed: 'Average', quality: 'Above Average' },
  { value: 'medium', label: 'Medium', speed: 'Below Average', quality: 'Good' },
  { value: 'slow', label: 'Slow', speed: 'Slow', quality: 'Very Good' },
  { value: 'slower', label: 'Slower', speed: 'Very Slow', quality: 'Excellent' },
  { value: 'veryslow', label: 'Very Slow', speed: 'Slowest', quality: 'Best' },
];

const RESOLUTION_OPTIONS = [
  { value: 25, label: '25% (Quarter size)' },
  { value: 50, label: '50% (Half size)' },
  { value: 75, label: '75% (Three quarters)' },
  { value: 100, label: '100% (Original size)' },
];

const OUTPUT_FORMATS = [
  { value: 'mp4', label: 'MP4 (Recommended)', description: 'Best compatibility, auto-converts non-MP4 files' },
  { value: 'webm', label: 'WebM', description: 'Web optimized format' },
  { value: 'avi', label: 'AVI', description: 'Legacy format' },
  { value: 'mov', label: 'MOV', description: 'QuickTime format' },
  { value: 'mkv', label: 'MKV', description: 'Matroska format' }
];

interface CompressionSettingsProps {
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
  customSettings: {
    crf: number;
    preset: string;
    scale: number;
    preserveQuality: boolean;
    outputFormat: string;
  };
  onCustomSettingsChange: (settings: {
    crf: number;
    preset: string;
    scale: number;
    preserveQuality: boolean;
    outputFormat: string;
  }) => void;
}

export function CompressionSettings({
  selectedPreset,
  onPresetChange,
  customSettings,
  onCustomSettingsChange
}: CompressionSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetSelect = (presetId: string) => {
    onPresetChange(presetId);
    
    if (presetId !== 'custom') {
      const preset = COMPRESSION_PRESETS.find(p => p.id === presetId);
      if (preset) {
        onCustomSettingsChange({
          crf: preset.crf,
          preset: preset.preset,
          scale: preset.scale,
          preserveQuality: customSettings.preserveQuality,
          outputFormat: customSettings.outputFormat
        });
      }
    }
  };

  const selectedPresetData = COMPRESSION_PRESETS.find(p => p.id === selectedPreset);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-4 h-4 text-video-primary" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Preset Selection */}
        <div>
          <h3 className="text-sm font-medium mb-2">Choose a preset:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMPRESSION_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPreset === preset.id;
              
              return (
                <Button
                  key={preset.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={cn(
                    "h-auto p-3 flex flex-col items-center gap-2 transition-smooth",
                    isSelected && "bg-video-primary hover:bg-video-primary-dark text-white"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isSelected ? "bg-white/20" : preset.color
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      isSelected ? "text-white" : "text-white"
                    )} />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs">{preset.name}</div>
                    <div className="text-xs opacity-70">{preset.estimatedReduction}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Selected Preset Info */}
        {selectedPresetData && (
          <div className="p-2 bg-video-secondary/30 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", selectedPresetData.color)}>
                <selectedPresetData.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-medium text-sm">{selectedPresetData.name}</h4>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {selectedPresetData.estimatedReduction}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedPresetData.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Settings */}
        {selectedPreset === 'custom' && (
          <div className="space-y-4 p-4 bg-video-secondary/30 rounded-lg border">
            <h4 className="font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4 text-video-accent" />
              Custom Settings
            </h4>

            {/* CRF Setting */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Quality (CRF): {customSettings.crf}</label>
                <span className="text-xs text-muted-foreground">
                  {customSettings.crf <= 15 ? 'Excellent' :
                   customSettings.crf <= 23 ? 'Good' :
                   customSettings.crf <= 30 ? 'Average' : 'Low'}
                </span>
              </div>
              <Slider
                value={[customSettings.crf]}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  crf: value[0]
                })}
                min={0}
                max={51}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Best Quality (0)</span>
                <span>Smallest Size (51)</span>
              </div>
            </div>

            {/* Encoding Preset */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Encoding Speed:</label>
              <Select
                value={customSettings.preset}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  preset: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENCODING_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{preset.label}</span>
                        <div className="text-xs text-muted-foreground ml-4">
                          Speed: {preset.speed} • Quality: {preset.quality}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resolution Scaling */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Scaling:</label>
              <Select
                value={customSettings.scale.toString()}
                onValueChange={(value) => onCustomSettingsChange({
                  ...customSettings,
                  scale: parseInt(value)
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Output Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Output Format:</label>
          <Select
            value={customSettings.outputFormat}
            onValueChange={(value) => onCustomSettingsChange({
              ...customSettings,
              outputFormat: value
            })}
          >
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

        {/* Advanced Options */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {showAdvanced && (
            <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Preserve Quality</label>
                  <p className="text-xs text-muted-foreground">
                    Skip compression for already compressed videos
                  </p>
                </div>
                <Switch
                  checked={customSettings.preserveQuality}
                  onCheckedChange={(checked) => onCustomSettingsChange({
                    ...customSettings,
                    preserveQuality: checked
                  })}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}