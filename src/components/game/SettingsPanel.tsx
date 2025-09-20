'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Volume2, VolumeX, Palette, Zap, Eye, EyeOff } from 'lucide-react';
import { Settings } from '@/data/types';

interface SettingsPanelProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings
}) => {
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5" />
          <span>Settings</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sound Settings */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Audio</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-green-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
              <span>Sound Effects</span>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
            />
          </div>
        </div>

        {/* Animation Settings */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Visual</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.animationsEnabled ? (
                <Zap className="w-4 h-4 text-blue-600" />
              ) : (
                <Zap className="w-4 h-4 text-gray-400" />
              )}
              <span>Animations</span>
            </div>
            <Switch
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
            />
          </div>
        </div>

        {/* Difficulty Settings */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Difficulty</Label>
          <Select
            value={settings.difficulty}
            onValueChange={(value: 'easy' | 'medium' | 'hard') => updateSetting('difficulty', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hints Settings */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Learning</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {settings.showHints ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
              <span>Show Hints</span>
            </div>
            <Switch
              checked={settings.showHints}
              onCheckedChange={(checked) => updateSetting('showHints', checked)}
            />
          </div>
        </div>

        {/* Auto Advance Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Auto Advance</span>
            </div>
            <Switch
              checked={settings.autoAdvance}
              onCheckedChange={(checked) => updateSetting('autoAdvance', checked)}
            />
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              onUpdateSettings({
                soundEnabled: true,
                animationsEnabled: true,
                difficulty: 'medium',
                showHints: true,
                autoAdvance: false,
                theme: 'light'
              });
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
