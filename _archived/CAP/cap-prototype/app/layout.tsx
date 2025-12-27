import type { Metadata } from 'next'
import './globals.css'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { AuthProvider } from '@/lib/auth-context'
import { PrototypeBanner } from '@/components/PrototypeBanner'

export const metadata: Metadata = {
  title: 'CAP Prototype - Championship Athletic Prospects',
  description: 'Interactive prototype for CAP trading card platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <AuthProvider>
          {/* Prototype Banner */}
          <PrototypeBanner />

          {/* Main Content */}
          <div className="pt-8">
            {children}
          </div>

          {/* Role Switcher */}
          <RoleSwitcher />
        </AuthProvider>
      </body>
    </html>
  )
}