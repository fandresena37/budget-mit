import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "budget mit app",
  description: "Application complète de gestion budgétaire avec système de vote et rapports",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex h-screen bg-gray-50">
          <Navigation />
          <main className="flex-1 lg:ml-64 overflow-auto">
            <div className="lg:hidden h-16" /> {/* Spacer for mobile */}
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
