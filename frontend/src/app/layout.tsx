import '../app/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'FitMate',
  description: 'Health Analyzer App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <nav className="bg-blue-600 text-white p-4">
          <div className="flex space-x-4">
            <a href="/analyze" className="hover:underline">Analyze</a>
            <a href="/history" className="hover:underline">History</a>
            <a href="/recommendation" className="hover:underline">Recommendation</a>
            <a href="/recalculate" className="hover:underline">Recalculate</a>
            <a href="/summary" className="hover:underline">Summary</a>
          </div>
        </nav>
        <main className="p-8">{children}</main>
      </body>
    </html>
  )
}

