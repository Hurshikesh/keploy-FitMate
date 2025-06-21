'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-6">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-700">Welcome to FitMate 💪</h1>
        <p className="text-gray-700 text-lg">
          FitMate is your personalized fitness companion. It offers tools to analyze your health,
          get tailored recommendations, track progress, and optimize your goals.
        </p>

        <div className="text-left space-y-3">
          <h2 className="text-xl font-semibold text-blue-600">🚀 Services Offered:</h2>
          <ul className="list-disc pl-6 text-gray-800 space-y-1">
            <li><strong>Analyze:</strong> Input your details to calculate your BMR, TDEE, and calorie needs.</li>
            <li><strong>Recommendations:</strong> Get AI-generated nutrition and workout guidance based on your profile.</li>
            <li><strong>Recalculate:</strong> Update your weight/body fat to adjust your plan.</li>
            <li><strong>Summary:</strong> See a compact overview of your health data and goals.</li>
            <li><strong>History:</strong> Track all past analyses and your fitness journey.</li>
          </ul>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-4">
          <Link href="/analyze" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold">
            Start Analysis
          </Link>
          <Link href="/history" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-semibold">
            View History
          </Link>
        </div>

        <p className="text-sm text-gray-500 pt-6">
          Built with ❤️ using Next.js, Hono, PostgreSQL, Prisma & Tailwind CSS
        </p>
      </div>
    </main>
  )
}
