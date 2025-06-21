'use client'
import { useEffect, useState } from 'react'
import { getHistory, deleteAnalysis } from '@/lib/api'

export default function HistoryPage() {
  const [list, setList] = useState<any[]>([])

  const fetch = async () => {
    const res = await getHistory()
    setList(res.data)
  }

  useEffect(() => {
    fetch()
  }, [])

  const handleDelete = async (id: number) => {
    await deleteAnalysis(id)
    fetch()
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">History</h2>
      {list.map((entry) => (
        <div key={entry.id} className="p-4 border mb-3 rounded">
          <p>ID: {entry.id}</p>
          <p>BMI: {entry.bmi}</p>
          <button className="text-red-500" onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
