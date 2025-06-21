'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { name: 'Analyze', href: '/analyze' },
  { name: 'History', href: '/history' },
  { name: 'Recommendation', href: '/recommendation' },
  { name: 'Recalculate', href: '/recalculate' },
  { name: 'Summary', href: '/summary' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex gap-6">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-yellow-300 transition ${
              pathname === link.href ? 'underline font-semibold' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
