import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Palette, 
  BookOpen, 
  Lightbulb, 
  BarChart3, 
  Minimize2, 
  Focus,
  Zap,
  Hash
} from 'lucide-react'

export function SettingsPanel({ settings, onSettingsChange, isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState('interface')

  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const tabs = [
    { id: 'interface', name: 'Interface', icon: Eye },
    { id: 'learning', name: 'Learning', icon: BookOpen },
    { id: 'advanced', name: 'Advanced', icon: Settings }
  ]

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 shadow-lg"
      >
        <Settings className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto">
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-1 mt-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {tab.name}
                </Button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Interface Tab */}
          {activeTab === 'interface' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visibility Controls
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Show Progress</span>
                    </div>
                    <Switch
                      checked={settings.showGamification}
                      onCheckedChange={(checked) => updateSetting('showGamification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Color Legend</span>
                    </div>
                    <Switch
                      checked={settings.showColorLegend}
                      onCheckedChange={(checked) => updateSetting('showColorLegend', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Grammar Rules</span>
                    </div>
                    <Switch
                      checked={settings.showGrammarExplanation}
                      onCheckedChange={(checked) => updateSetting('showGrammarExplanation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Word Hints</span>
                    </div>
                    <Switch
                      checked={settings.showWordHints}
                      onCheckedChange={(checked) => updateSetting('showWordHints', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Minimize2 className="w-4 h-4" />
                  Layout Options
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Minimize2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Compact Mode</span>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Focus className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Focus Mode</span>
                    </div>
                    <Switch
                      checked={settings.focusMode}
                      onCheckedChange={(checked) => updateSetting('focusMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Hide Unused Categories</span>
                    </div>
                    <Switch
                      checked={settings.hideUnusedCategories}
                      onCheckedChange={(checked) => updateSetting('hideUnusedCategories', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === 'learning' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Learning Preferences
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Auto-Advance Levels</span>
                    </div>
                    <Switch
                      checked={settings.autoAdvance}
                      onCheckedChange={(checked) => updateSetting('autoAdvance', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Words per Category</span>
                      </div>
                      <Badge variant="secondary">{settings.maxWordsPerCategory}</Badge>
                    </div>
                    <Slider
                      value={[settings.maxWordsPerCategory]}
                      onValueChange={([value]) => updateSetting('maxWordsPerCategory', value)}
                      max={30}
                      min={6}
                      step={2}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>6 words</span>
                      <span>30 words</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSettingsChange({
                      ...settings,
                      focusMode: true,
                      compactMode: true,
                      showGamification: false,
                      hideUnusedCategories: true,
                      maxWordsPerCategory: 8
                    })}
                    className="text-xs"
                  >
                    🎯 Focus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSettingsChange({
                      ...settings,
                      focusMode: false,
                      compactMode: false,
                      showGamification: true,
                      hideUnusedCategories: false,
                      maxWordsPerCategory: 20
                    })}
                    className="text-xs"
                  >
                    🎮 Full
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSettingsChange({
                      ...settings,
                      showGrammarExplanation: false,
                      showWordHints: false,
                      showColorLegend: false,
                      compactMode: true
                    })}
                    className="text-xs"
                  >
                    ✨ Minimal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSettingsChange({
                      ...settings,
                      showGrammarExplanation: true,
                      showWordHints: true,
                      showColorLegend: true,
                      showGamification: true
                    })}
                    className="text-xs"
                  >
                    📚 Teacher
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Advanced Options
                </h4>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800 mb-1">Level Progression</div>
                    <div className="text-xs text-blue-700">
                      Students unlock new levels by earning points. Higher levels require more points to access.
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-1">Color System</div>
                    <div className="text-xs text-green-700">
                      Each word type has a unique color to help students identify parts of speech visually.
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-purple-800 mb-1">Adaptive Learning</div>
                    <div className="text-xs text-purple-700">
                      The game adapts to show only relevant word categories for each level, reducing cognitive load.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Reset Options</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Reset all settings to default?')) {
                      onSettingsChange({
                        showGamification: false,
                        showColorLegend: true,
                        showGrammarExplanation: true,
                        showWordHints: true,
                        showProgressBar: false,
                        compactMode: true,
                        focusMode: false,
                        autoAdvance: false,
                        maxWordsPerCategory: 12,
                        hideUnusedCategories: true
                      })
                    }
                  }}
                  className="w-full text-xs"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing settings
export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sentenceBuilderSettings')
    return saved ? JSON.parse(saved) : {
      showGamification: false,
      showColorLegend: true,
      showGrammarExplanation: true,
      showWordHints: true,
      showProgressBar: false,
      compactMode: true,
      focusMode: false,
      autoAdvance: false,
      maxWordsPerCategory: 12,
      hideUnusedCategories: true
    }
  })

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('sentenceBuilderSettings', JSON.stringify(newSettings))
  }

  return [settings, updateSettings]
}

