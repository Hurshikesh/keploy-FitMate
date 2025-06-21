'use client'
import { useState } from 'react'
import { recalculate } from '@/lib/api'

export default function RecalculatePage() {
  const [form, setForm] = useState({ analysisId: '', weight: '', bodyFat: '' })
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    setError(null)
    try {
      const res = await recalculate({
        analysisId: Number(form.analysisId),
        weight: Number(form.weight),
        bodyFat: Number(form.bodyFat)
      })
      setResult(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Recalculation failed')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">Recalculate</h2>
      {['analysisId', 'weight', 'bodyFat'].map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={form[key as keyof typeof form]}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={!form.analysisId || !form.weight || !form.bodyFat}
      >
        Recalculate
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="bg-gray-100 p-4 rounded space-y-2 text-sm">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b py-1">
              <span className="text-gray-600 font-medium capitalize">{key}</span>
              <span className="text-gray-900">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
