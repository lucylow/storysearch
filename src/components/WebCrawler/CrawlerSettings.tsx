import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Bot,
  Shield,
  Clock,
  Database,
  Network,
  Zap,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CrawlerSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Global Settings
    global: {
      maxConcurrentCrawls: 3,
      defaultDelayBetweenRequests: 1000,
      defaultUserAgent: 'StorySearch AI Crawler 1.0',
      respectRobotsTxt: true,
      followRedirects: true,
      maxRedirects: 5,
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 5000
    },
    
    // Content Processing
    content: {
      extractImages: true,
      extractLinks: true,
      extractMetadata: true,
      maxContentLength: 1000000,
      minContentLength: 100,
      removeScripts: true,
      removeStyles: true,
      normalizeWhitespace: true,
      extractTextFromImages: false
    },
    
    // Performance Settings
    performance: {
      enableCaching: true,
      cacheExpiration: 86400, // 24 hours
      enableCompression: true,
      maxMemoryUsage: 512, // MB
      enableParallelProcessing: true,
      maxWorkers: 4
    },
    
    // Security Settings
    security: {
      enableRateLimiting: true,
      maxRequestsPerMinute: 60,
      enableIPRotation: false,
      enableProxySupport: false,
      enableSSLVerification: true,
      blockSuspiciousDomains: true,
      enableContentFiltering: true
    },
    
    // Storage Settings
    storage: {
      enableLocalStorage: true,
      enableCloudStorage: false,
      compressionLevel: 6,
      enableDeduplication: true,
      maxStorageSize: 1073741824, // 1GB
      cleanupInterval: 604800 // 7 days
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSettingChange = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setHasChanges(false);
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setHasChanges(true);
    }
  };

  const SettingInput: React.FC<{
    label: string;
    description?: string;
    value: any;
    onChange: (value: any) => void;
    type?: 'text' | 'number' | 'boolean' | 'select';
    options?: Array<{ value: any; label: string }>;
    min?: number;
    max?: number;
    unit?: string;
  }> = ({ label, description, value, onChange, type = 'text', options, min, max, unit }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {type === 'boolean' ? (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">{value ? 'Enabled' : 'Disabled'}</span>
        </div>
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-border rounded-lg bg-background"
        >
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
            min={min}
            max={max}
            className="flex-1"
          />
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Crawler Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure global crawler behavior and performance settings
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saveStatus === 'saving'}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
            className="flex items-center gap-2"
          >
            {saveStatus === 'saving' ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'saved' ? 'Saved!' : 
             saveStatus === 'error' ? 'Error' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="global" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Storage
          </TabsTrigger>
        </TabsList>

        {/* Global Settings */}
        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Global Crawler Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingInput
                  label="Max Concurrent Crawls"
                  description="Maximum number of crawls that can run simultaneously"
                  value={settings.global.maxConcurrentCrawls}
                  onChange={(value) => handleSettingChange('global', 'maxConcurrentCrawls', value)}
                  type="number"
                  min={1}
                  max={10}
                />
                
                <SettingInput
                  label="Default Delay Between Requests"
                  description="Time to wait between requests to avoid overwhelming servers"
                  value={settings.global.defaultDelayBetweenRequests}
                  onChange={(value) => handleSettingChange('global', 'defaultDelayBetweenRequests', value)}
                  type="number"
                  min={100}
                  max={10000}
                  unit="ms"
                />
                
                <SettingInput
                  label="Default User Agent"
                  description="User agent string to identify the crawler"
                  value={settings.global.defaultUserAgent}
                  onChange={(value) => handleSettingChange('global', 'defaultUserAgent', value)}
                  type="text"
                />
                
                <SettingInput
                  label="Request Timeout"
                  description="Maximum time to wait for a response"
                  value={settings.global.timeout}
                  onChange={(value) => handleSettingChange('global', 'timeout', value)}
                  type="number"
                  min={1000}
                  max={120000}
                  unit="ms"
                />
              </div>
              
              <div className="space-y-4">
                <SettingInput
                  label="Respect robots.txt"
                  description="Follow robots.txt rules when crawling websites"
                  value={settings.global.respectRobotsTxt}
                  onChange={(value) => handleSettingChange('global', 'respectRobotsTxt', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Follow Redirects"
                  description="Automatically follow HTTP redirects"
                  value={settings.global.followRedirects}
                  onChange={(value) => handleSettingChange('global', 'followRedirects', value)}
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Content Processing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingInput
                  label="Max Content Length"
                  description="Maximum length of content to extract and store"
                  value={settings.content.maxContentLength}
                  onChange={(value) => handleSettingChange('content', 'maxContentLength', value)}
                  type="number"
                  min={1000}
                  max={10000000}
                  unit="characters"
                />
                
                <SettingInput
                  label="Min Content Length"
                  description="Minimum length of content to be considered valid"
                  value={settings.content.minContentLength}
                  onChange={(value) => handleSettingChange('content', 'minContentLength', value)}
                  type="number"
                  min={10}
                  max={10000}
                  unit="characters"
                />
              </div>
              
              <div className="space-y-4">
                <SettingInput
                  label="Extract Images"
                  description="Extract and store image URLs from crawled content"
                  value={settings.content.extractImages}
                  onChange={(value) => handleSettingChange('content', 'extractImages', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Extract Links"
                  description="Extract and store links found in crawled content"
                  value={settings.content.extractLinks}
                  onChange={(value) => handleSettingChange('content', 'extractLinks', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Extract Metadata"
                  description="Extract meta tags and structured data"
                  value={settings.content.extractMetadata}
                  onChange={(value) => handleSettingChange('content', 'extractMetadata', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Remove Scripts"
                  description="Remove JavaScript code from extracted content"
                  value={settings.content.removeScripts}
                  onChange={(value) => handleSettingChange('content', 'removeScripts', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Remove Styles"
                  description="Remove CSS styles from extracted content"
                  value={settings.content.removeStyles}
                  onChange={(value) => handleSettingChange('content', 'removeStyles', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Normalize Whitespace"
                  description="Clean up and normalize whitespace in extracted content"
                  value={settings.content.normalizeWhitespace}
                  onChange={(value) => handleSettingChange('content', 'normalizeWhitespace', value)}
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingInput
                  label="Max Memory Usage"
                  description="Maximum memory usage for the crawler process"
                  value={settings.performance.maxMemoryUsage}
                  onChange={(value) => handleSettingChange('performance', 'maxMemoryUsage', value)}
                  type="number"
                  min={128}
                  max={2048}
                  unit="MB"
                />
                
                <SettingInput
                  label="Max Workers"
                  description="Maximum number of worker threads for parallel processing"
                  value={settings.performance.maxWorkers}
                  onChange={(value) => handleSettingChange('performance', 'maxWorkers', value)}
                  type="number"
                  min={1}
                  max={16}
                />
                
                <SettingInput
                  label="Cache Expiration"
                  description="How long to cache crawled content"
                  value={settings.performance.cacheExpiration}
                  onChange={(value) => handleSettingChange('performance', 'cacheExpiration', value)}
                  type="number"
                  min={3600}
                  max={604800}
                  unit="seconds"
                />
                
                <SettingInput
                  label="Compression Level"
                  description="Level of compression for stored content"
                  value={settings.performance.compressionLevel}
                  onChange={(value) => handleSettingChange('performance', 'compressionLevel', value)}
                  type="select"
                  options={[
                    { value: 1, label: 'Fast (1)' },
                    { value: 3, label: 'Balanced (3)' },
                    { value: 6, label: 'Default (6)' },
                    { value: 9, label: 'Best (9)' }
                  ]}
                />
              </div>
              
              <div className="space-y-4">
                <SettingInput
                  label="Enable Caching"
                  description="Cache crawled content to improve performance"
                  value={settings.performance.enableCaching}
                  onChange={(value) => handleSettingChange('performance', 'enableCaching', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Enable Compression"
                  description="Compress stored content to save space"
                  value={settings.performance.enableCompression}
                  onChange={(value) => handleSettingChange('performance', 'enableCompression', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Enable Parallel Processing"
                  description="Use multiple threads for faster crawling"
                  value={settings.performance.enableParallelProcessing}
                  onChange={(value) => handleSettingChange('performance', 'enableParallelProcessing', value)}
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingInput
                  label="Max Requests Per Minute"
                  description="Rate limiting to prevent overwhelming target servers"
                  value={settings.security.maxRequestsPerMinute}
                  onChange={(value) => handleSettingChange('security', 'maxRequestsPerMinute', value)}
                  type="number"
                  min={10}
                  max={300}
                />
                
                <SettingInput
                  label="Max Storage Size"
                  description="Maximum storage size for crawled content"
                  value={settings.storage.maxStorageSize}
                  onChange={(value) => handleSettingChange('storage', 'maxStorageSize', value)}
                  type="number"
                  min={104857600}
                  max={10737418240}
                  unit="bytes"
                />
              </div>
              
              <div className="space-y-4">
                <SettingInput
                  label="Enable Rate Limiting"
                  description="Limit the number of requests per minute"
                  value={settings.security.enableRateLimiting}
                  onChange={(value) => handleSettingChange('security', 'enableRateLimiting', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Enable SSL Verification"
                  description="Verify SSL certificates for secure connections"
                  value={settings.security.enableSSLVerification}
                  onChange={(value) => handleSettingChange('security', 'enableSSLVerification', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Block Suspicious Domains"
                  description="Automatically block domains known for malicious content"
                  value={settings.security.blockSuspiciousDomains}
                  onChange={(value) => handleSettingChange('security', 'blockSuspiciousDomains', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Enable Content Filtering"
                  description="Filter out inappropriate or malicious content"
                  value={settings.security.enableContentFiltering}
                  onChange={(value) => handleSettingChange('security', 'enableContentFiltering', value)}
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Settings */}
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Storage Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingInput
                  label="Cleanup Interval"
                  description="How often to clean up old cached content"
                  value={settings.storage.cleanupInterval}
                  onChange={(value) => handleSettingChange('storage', 'cleanupInterval', value)}
                  type="number"
                  min={86400}
                  max={2592000}
                  unit="seconds"
                />
              </div>
              
              <div className="space-y-4">
                <SettingInput
                  label="Enable Local Storage"
                  description="Store crawled content locally"
                  value={settings.storage.enableLocalStorage}
                  onChange={(value) => handleSettingChange('storage', 'enableLocalStorage', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Enable Cloud Storage"
                  description="Store crawled content in cloud storage"
                  value={settings.storage.enableCloudStorage}
                  onChange={(value) => handleSettingChange('storage', 'enableCloudStorage', value)}
                  type="boolean"
                />
                
                <SettingInput
                  label="Enable Deduplication"
                  description="Remove duplicate content to save space"
                  value={settings.storage.enableDeduplication}
                  onChange={(value) => handleSettingChange('storage', 'enableDeduplication', value)}
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Status */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CrawlerSettings;
