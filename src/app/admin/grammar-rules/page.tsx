'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface GrammarRule {
  id: string
  level_id: number
  rule_type: string
  rule_name: string
  conditions: any
  validation_logic: any
  error_messages: any
  examples: string[]
  priority: number
  is_active: boolean
  created_at: string
}

export default function GrammarRulesAdmin() {
  const [rules, setRules] = useState<GrammarRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/admin/grammar-rules')
      const data = await response.json()
      if (data.success) {
        setRules(data.data ? Object.values(data.data).flatMap((level: any) => level.rules) : [])
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Grammar Rules Admin</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Grammar Rules Admin</h1>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showCreateForm ? 'Cancel' : 'Add New Rule'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-6 mb-8 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Create New Grammar Rule</h2>
            <CreateRuleForm onSuccess={() => {
              setShowCreateForm(false)
              fetchRules()
            }} />
          </Card>
        )}

        <div className="grid gap-4">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} onUpdate={fetchRules} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RuleCard({ rule, onUpdate }: { rule: GrammarRule; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{rule.rule_name}</h3>
            <Badge variant={rule.is_active ? "default" : "secondary"}>
              {rule.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">{rule.rule_type}</Badge>
            <span className="text-sm text-gray-400">Priority: {rule.priority}</span>
          </div>
          <p className="text-sm text-gray-400 mb-2">Level {rule.level_id}</p>
          <div className="text-sm">
            <strong>Conditions:</strong> {JSON.stringify(rule.conditions, null, 2)}
          </div>
          <div className="text-sm mt-2">
            <strong>Error Messages:</strong> {JSON.stringify(rule.error_messages, null, 2)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
        </div>
      </div>
    </Card>
  )
}

function CreateRuleForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    level_id: 1,
    rule_type: 'word-order',
    rule_name: '',
    conditions: {},
    validation_logic: {},
    error_messages: {},
    examples: [],
    priority: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/grammar-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating rule:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="level_id">Level ID</Label>
          <Input
            id="level_id"
            type="number"
            value={formData.level_id}
            onChange={(e) => setFormData({...formData, level_id: parseInt(e.target.value)})}
            className="bg-gray-700 border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="rule_type">Rule Type</Label>
          <Select
            value={formData.rule_type}
            onValueChange={(value) => setFormData({...formData, rule_type: value})}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="word-order">Word Order</SelectItem>
              <SelectItem value="subject-verb-agreement">Subject-Verb Agreement</SelectItem>
              <SelectItem value="article-usage">Article Usage</SelectItem>
              <SelectItem value="negation">Negation</SelectItem>
              <SelectItem value="question-formation">Question Formation</SelectItem>
              <SelectItem value="tense-consistency">Tense Consistency</SelectItem>
              <SelectItem value="verb-form">Verb Form</SelectItem>
              <SelectItem value="modal-verbs">Modal Verbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="rule_name">Rule Name</Label>
        <Input
          id="rule_name"
          value={formData.rule_name}
          onChange={(e) => setFormData({...formData, rule_name: e.target.value})}
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Input
          id="priority"
          type="number"
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
          className="bg-gray-700 border-gray-600"
        />
      </div>

      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Create Rule
      </Button>
    </form>
  )
}
