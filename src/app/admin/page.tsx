'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, Download, Upload } from 'lucide-react'

interface TableStatus {
  [key: string]: boolean;
}

interface SchemaInfo {
  currentSchema: Record<string, unknown>[];
  tableCount: number;
  expectedTables: TableStatus;
  missingTables: string[];
  recommendations: Array<{
    type: string;
    priority: string;
    message: string;
    action: string;
  }>;
}

export default function AdminDashboard() {
  const [schemaInfo, setSchemaInfo] = useState<SchemaInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrationResults, setMigrationResults] = useState<Record<string, unknown> | null>(null)

  const inspectSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/schema?action=inspect')
      const data = await response.json()

      if (response.ok) {
        setSchemaInfo(data)
      } else {
        console.error('Schema inspection failed:', data)
      }
    } catch (error) {
      console.error('Error inspecting schema:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async (tables?: string[]) => {
    setMigrating(true)
    try {
      const response = await fetch('/api/admin/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-missing',
          tables
        })
      })

      const data = await response.json()
      setMigrationResults(data)

      // Refresh schema info after migration
      await inspectSchema()
    } catch (error) {
      console.error('Migration failed:', error)
    } finally {
      setMigrating(false)
    }
  }

  useEffect(() => {
    inspectSchema()
  }, [])

  const getStatusIcon = (exists: boolean) => {
    return exists
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <XCircle className="w-4 h-4 text-red-600" />
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Database className="w-10 h-10 inline-block mr-3" />
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Sentence Builder Database Management</p>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={inspectSchema}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Inspecting...' : 'Inspect Schema'}
            </Button>

            <Button
              onClick={() => runMigration()}
              disabled={migrating || !schemaInfo?.missingTables.length}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Upload className={`w-4 h-4 ${migrating ? 'animate-pulse' : ''}`} />
              {migrating ? 'Migrating...' : 'Create Missing Tables'}
            </Button>

            <Button
              onClick={() => window.open('/database/schema.sql', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Full Schema
            </Button>
          </div>
        </Card>

        {/* Schema Overview */}
        {schemaInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Current Schema Status */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Database Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Tables:</span>
                  <Badge variant="secondary">{schemaInfo.tableCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Missing Tables:</span>
                  <Badge variant={schemaInfo.missingTables.length > 0 ? "destructive" : "secondary"}>
                    {schemaInfo.missingTables.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Schema Completeness:</span>
                  <Badge variant="secondary">
                    {Math.round(((Object.keys(schemaInfo.expectedTables).length - schemaInfo.missingTables.length) / Object.keys(schemaInfo.expectedTables).length) * 100)}%
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Table Status */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Table Status</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(schemaInfo.expectedTables).map(([table, exists]) => (
                  <div key={table} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">{table}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(exists)}
                      <span className="text-xs">
                        {exists ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

        {/* Recommendations */}
        {schemaInfo?.recommendations && schemaInfo.recommendations.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Recommendations</h3>
            <div className="space-y-4">
              {schemaInfo.recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityBadge(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">{rec.type}</span>
                      </div>
                      <p className="font-medium mb-1">{rec.message}</p>
                      <p className="text-sm text-gray-600">{rec.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Migration Results */}
        {migrationResults && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Migration Results</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{migrationResults.summary?.total || 0}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{migrationResults.summary?.successful || 0}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{migrationResults.summary?.failed || 0}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>

              {migrationResults.results && (
                <div className="space-y-2">
                  <h4 className="font-medium">Detailed Results:</h4>
                  {migrationResults.results.map((result: { table: string; success: boolean; error?: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-mono text-sm">{result.table}</span>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs">
                          {result.success ? 'Created' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Current Schema Details */}
        {schemaInfo?.currentSchema && schemaInfo.currentSchema.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Current Schema Details</h3>
            <div className="space-y-4">
              {schemaInfo.currentSchema.map((table, index) => (
                <details key={index} className="border border-gray-200 rounded-lg">
                  <summary className="p-3 cursor-pointer hover:bg-gray-50 font-medium">
                    {table.tableName} ({table.columns?.length || 0} columns)
                  </summary>
                  <div className="p-3 border-t bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                      {table.columns?.map((col: { column_name: string; data_type: string }, colIndex: number) => (
                        <div key={colIndex} className="flex justify-between p-2 bg-white rounded">
                          <span className="font-mono">{col.column_name}</span>
                          <span className="text-gray-600">{col.data_type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </Card>
        )}

        {/* No Schema Found */}
        {schemaInfo && schemaInfo.tableCount === 0 && (
          <Card className="p-6 text-center">
            <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Tables Found</h3>
            <p className="text-gray-600 mb-4">
              Your database appears to be empty. Would you like to create the comprehensive schema for the sentence builder game?
            </p>
            <Button
              onClick={() => runMigration()}
              disabled={migrating}
              className="flex items-center gap-2 mx-auto"
            >
              <Upload className="w-4 h-4" />
              Initialize Database
            </Button>
          </Card>
        )}

      </div>
    </div>
  )
}