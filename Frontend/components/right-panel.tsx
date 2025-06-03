"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Users, DollarSign, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import type { FragranceRecommendation } from "@/app/page"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RightPanelProps {
  results: FragranceRecommendation[] | null
  isLoading: boolean
}

export function RightPanel({ results, isLoading }: RightPanelProps) {
  const [expandedFragrance, setExpandedFragrance] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedFragrance(expandedFragrance === index ? null : index)
  }

  if (isLoading) {
    return (
      <Card className="h-full shadow-xl border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
            <Sparkles className="mr-2 h-5 w-5 text-blue-700" />
            Finding Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Analyzing your preferences...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card className="h-full shadow-xl border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
            <Sparkles className="mr-2 h-5 w-5 text-blue-700" />
            Your Recommendations
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
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
        <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
          <Sparkles className="mr-2 h-5 w-5 text-blue-700" />
          Your Recommendations
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          {results.length} personalized fragrance{results.length !== 1 ? "s" : ""} found
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 pb-6 space-y-4">
            {results.map((fragrance, index) => (
              <Card
                key={index}
                className="border border-slate-200/60 dark:border-slate-600/60 hover:shadow-md transition-shadow bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm w-full"
                data-testid={`fragrance-card-${index}`}
              >
                <CardContent className="p-4 w-full">
                  <div className="space-y-3 w-full">
                    {/* Header with match score */}
                    <div className="flex justify-between items-start gap-3 w-full">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 leading-tight">
                          {fragrance.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">by {fragrance.brand}</p>
                      </div>
                      {fragrance.match_score && (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-800 dark:text-blue-200 border-0 flex-shrink-0 text-sm font-semibold"
                          data-testid={`match-score-${index}`}
                        >
                          {(fragrance.match_score * 100).toFixed(0)}% Match
                        </Badge>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-3 text-sm w-full">
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Star className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
                        <span>{fragrance.rating_value?.toFixed(1) ?? "N/A"}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{fragrance.rating_count || 0}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{fragrance.price_value_label}</span>
                      </div>
                      <div className="flex justify-end">
                        <Badge
                          variant="outline"
                          className="text-sm border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300"
                        >
                          {fragrance.gender_label}
                        </Badge>
                      </div>
                    </div>

                    {/* Dominant Accords - always visible */}
                    {fragrance.dominant_accords && fragrance.dominant_accords.length > 0 && (
                      <div className="w-full">
                        <div className="flex flex-wrap gap-2 w-full">
                          {fragrance.dominant_accords.slice(0, 3).map(([accord, value], i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-sm bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1"
                            >
                              {accord}
                            </Badge>
                          ))}
                          {fragrance.dominant_accords.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-sm border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 px-3 py-1"
                            >
                              +{fragrance.dominant_accords.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expandable section */}
                    {expandedFragrance === index && (
                      <div className="pt-3 space-y-4 border-t border-slate-200 dark:border-slate-600 w-full">
                        {/* Full Dominant Accords */}
                        {fragrance.dominant_accords && fragrance.dominant_accords.length > 0 && (
                          <div className="w-full">
                            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                              Dominant Accords
                            </h4>
                            <div className="flex flex-wrap gap-2 w-full">
                              {fragrance.dominant_accords.map(([accord, value], i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-sm bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1"
                                >
                                  {accord} {value ? `(${(value * 100).toFixed(0)}%)` : ""}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes Breakdown */}
                        {fragrance.notes_breakdown && (
                          <div className="space-y-2 w-full">
                            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Notes</h4>
                            {Object.entries(fragrance.notes_breakdown).map(
                              ([key, notes]) =>
                                notes &&
                                notes.length > 0 && (
                                  <div key={key} className="text-sm w-full">
                                    <span className="font-medium text-slate-700 dark:text-slate-200">
                                      {key === "topnotes" ? "Top:" : key === "midnotes" ? "Heart:" : "Base:"}
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-300 ml-2">{notes.join(", ")}</span>
                                  </div>
                                ),
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expand/Collapse button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(index)}
                      className="w-full h-8 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 mt-2"
                      data-testid={`expand-button-${index}`}
                    >
                      {expandedFragrance === index ? (
                        <ChevronUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      )}
                      {expandedFragrance === index ? "Show less" : "Show more"}
                    </Button>
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
