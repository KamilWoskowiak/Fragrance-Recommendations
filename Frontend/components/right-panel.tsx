"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Users, DollarSign, Sparkles } from "lucide-react"
import type { FragranceRecommendation } from "@/app/page"

interface RightPanelProps {
  results: FragranceRecommendation[] | null
  isLoading: boolean
}

export function RightPanel({ results, isLoading }: RightPanelProps) {
  if (isLoading) {
    return (
      <Card className="h-full shadow-xl border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-lg sm:text-xl">
            <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
            Finding Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">Analyzing your preferences...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card className="h-full shadow-xl border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-lg sm:text-xl">
            <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
            Your Recommendations
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">
            Personalized fragrance suggestions will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1"></CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full shadow-xl border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-lg sm:text-xl">
          <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
          Your Recommendations
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">
          {results.length} personalized fragrance{results.length !== 1 ? "s" : ""} found
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 sm:px-6 pb-6 space-y-4">
            {results.map((fragrance, index) => (
              <Card
                key={index}
                className="border border-slate-200/60 dark:border-slate-600/60 hover:shadow-md transition-shadow bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm w-full"
              >
                <CardContent className="p-3 sm:p-4 w-full">
                  <div className="space-y-3 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 w-full">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-blue-900 dark:text-blue-100 leading-tight">
                          {fragrance.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                          by {fragrance.brand}
                        </p>
                      </div>
                      {fragrance.match_score && (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-800 dark:text-blue-200 border-0 flex-shrink-0 text-xs sm:text-sm font-semibold self-start"
                        >
                          {(fragrance.match_score * 100).toFixed(0)}% Match
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm w-full">
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-500 flex-shrink-0" />
                        <span className="truncate">{fragrance.rating_value?.toFixed(1) ?? "N/A"}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">{fragrance.rating_count || 0}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">{fragrance.price_value_label}</span>
                      </div>
                      <div className="flex justify-end">
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300"
                        >
                          {fragrance.gender_label}
                        </Badge>
                      </div>
                    </div>

                    {fragrance.dominant_accords && fragrance.dominant_accords.length > 0 && (
                      <div className="w-full">
                        <div className="flex flex-wrap gap-1 sm:gap-2 w-full">
                          {fragrance.dominant_accords.slice(0, 3).map(([accord, value], i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-1"
                            >
                              {accord}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
