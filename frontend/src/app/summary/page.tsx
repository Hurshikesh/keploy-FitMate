'use client'
import { useState } from 'react'
import { getSummary } from '@/lib/api'

export default function SummaryPage() {
  const [id, setId] = useState('')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetch = async () => {
    setError(null)
    try {
      const res = await getSummary(Number(id))
      setData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch summary')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-purple-700">Summary</h2>
      <input
        type="number"
        placeholder="Analysis ID"
        className="w-full border px-2 py-1 rounded"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        onClick={fetch}
        disabled={!id}
      >
        Get Summary
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="bg-gray-100 p-4 rounded space-y-2 text-sm">
          {Object.entries(data).map(([key, value]) => (
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
