'use client'
import { useState } from 'react'
import { analyze } from '@/lib/api'

export default function AnalyzePage() {
  const [form, setForm] = useState({
    age: '',
    weight: '',
    height: '',
    bodyFat: '',
    gender: '',
    activityLevel: '',
    goal: ''
  })

  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      setError(null)

      const parsed = {
        ...form,
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
        bodyFat: Number(form.bodyFat)
      }

      const res = await analyze(parsed)
      setResult(res.data)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-blue-700 text-center">Health Analysis</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          placeholder="Weight (kg)"
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
          placeholder="Height (cm)"
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          name="bodyFat"
          value={form.bodyFat}
          onChange={handleChange}
          placeholder="Body Fat (%)"
          className="border px-2 py-1 rounded"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="col-span-2 border px-2 py-1 rounded"
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
          name="activityLevel"
          value={form.activityLevel}
          onChange={handleChange}
          className="col-span-2 border px-2 py-1 rounded"
        >
          <option value="" disabled>Select Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very-active">Very Active</option>
        </select>

        <select
          name="goal"
          value={form.goal}
          onChange={handleChange}
          className="col-span-2 border px-2 py-1 rounded"
        >
          <option value="" disabled>Select Goal</option>
          <option value="lose">Lose</option>
          <option value="maintain">Maintain</option>
          <option value="gain">Gain</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Submit
      </button>

      {error && (
        <p className="text-red-600 font-semibold">
          {typeof error === 'string' ? error : 'Validation Error'}
        </p>
      )}

      {result && (
        <div className="mt-4 border border-gray-300 rounded p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Analysis Result</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b py-1">
                <span className="text-gray-600 font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
              ))}

          </div>
        </div>
      )}
    </div>
  )
}
