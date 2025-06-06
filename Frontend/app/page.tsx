"use client"

import { useState } from "react"
import { LeftPanel } from "@/components/left-panel"
import { RightPanel } from "@/components/right-panel"
import { ThemeToggle } from "@/components/theme-toggle"

export interface FragranceRecommendation {
  name: string
  brand: string
  rating_value: number
  rating_count: number
  gender_label: string
  price_value_label: string
  match_score: number
  dominant_accords: [string, number][]
  notes_breakdown: {
    topnotes?: string[]
    midnotes?: string[]
    bottomnotes?: string[]
  } | null
}

export default function Home() {
  const [results, setResults] = useState<FragranceRecommendation[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <header className="border-b border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Fragrance Recommender
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 max-w-7xl mx-auto items-start">
          <div className="lg:col-span-3">
            <LeftPanel setResults={setResults} isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
          <div className="lg:col-span-2 h-full min-h-[400px] lg:min-h-[600px]">
            <RightPanel results={results} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md mt-8 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <a
              href="https://github.com/kamilwoskowiak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 font-medium transition-colors text-sm sm:text-base"
            >
              Created by Kamil Woskowiak
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
