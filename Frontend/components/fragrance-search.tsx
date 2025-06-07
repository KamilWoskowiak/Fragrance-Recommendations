"use client"

import type React from "react"
import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X } from "lucide-react"

interface FragranceSearchProps {
  fragrances: [string, string][]
  selectedFragrances: string[]
  setSelectedFragrances: React.Dispatch<React.SetStateAction<string[]>>
}

const ITEM_HEIGHT = 60
const CONTAINER_HEIGHT = 256
const BUFFER_SIZE = 5
const MAX_INITIAL_RESULTS = 50
const MAX_SEARCH_RESULTS = 300

export function FragranceSearch({ fragrances, selectedFragrances, setSelectedFragrances }: FragranceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const { filteredFragrances, totalMatches, isLimited } = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        filteredFragrances: fragrances.slice(0, MAX_INITIAL_RESULTS),
        totalMatches: fragrances.length,
        isLimited: false,
      }
    }

    const allMatches = fragrances.filter(([brand, name]) =>
      `${brand} ${name}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const limited = allMatches.length > MAX_SEARCH_RESULTS
    const results = limited ? allMatches.slice(0, MAX_SEARCH_RESULTS) : allMatches

    return {
      filteredFragrances: results,
      totalMatches: allMatches.length,
      isLimited: limited,
    }
  }, [fragrances, searchTerm])

  const { visibleItems, totalHeight, startIndex } = useMemo(() => {
    const itemCount = filteredFragrances.length
    const visibleCount = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT)
    const startIdx = Math.floor(scrollTop / ITEM_HEIGHT)
    const endIdx = Math.min(startIdx + visibleCount + BUFFER_SIZE, itemCount)
    const actualStartIdx = Math.max(0, startIdx - BUFFER_SIZE)

    return {
      visibleItems: filteredFragrances.slice(actualStartIdx, endIdx),
      totalHeight: itemCount * ITEM_HEIGHT,
      startIndex: actualStartIdx,
    }
  }, [filteredFragrances, scrollTop])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const handleSelectFragrance = (fragrance: string) => {
    if (selectedFragrances.length < 10 && !selectedFragrances.includes(fragrance)) {
      setSelectedFragrances([...selectedFragrances, fragrance])
    }
  }

  const handleRemoveFragrance = (fragrance: string) => {
    setSelectedFragrances(selectedFragrances.filter((f) => f !== fragrance))
  }

  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center text-blue-900 dark:text-blue-100">
          <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700 flex-shrink-0" />
          Select Your Favorite Fragrances
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
          Choose up to 10 fragrances you love. We'll find similar ones for you.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search fragrances by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {selectedFragrances.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
              Selected Fragrances ({selectedFragrances.length}/10)
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedFragrances.map((fragrance) => (
                <Badge
                  key={fragrance}
                  variant="secondary"
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-xs sm:text-sm max-w-[200px]"
                >
                  <span className="truncate">{fragrance}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800 flex-shrink-0"
                    onClick={() => handleRemoveFragrance(fragrance)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="border rounded-lg overflow-hidden">
          <div
            ref={scrollElementRef}
            className="h-64 overflow-auto"
            onScroll={handleScroll}
            style={{ height: CONTAINER_HEIGHT }}
          >
            <div style={{ height: totalHeight, position: "relative" }}>
              <div
                style={{
                  transform: `translateY(${startIndex * ITEM_HEIGHT}px)`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              >
                {visibleItems.length > 0 ? (
                  visibleItems.map(([brand, name], index) => (
                    <div
                      key={`${brand}-${name}-${startIndex + index}`}
                      className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                      style={{ height: ITEM_HEIGHT }}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-medium text-sm text-blue-900 dark:text-blue-100 truncate leading-tight">
                          {name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate leading-tight">by {brand}</p>
                      </div>
                      <div className="flex-shrink-0 w-10 flex justify-center">
                        <Button
                          onClick={() => handleSelectFragrance(name)}
                          disabled={selectedFragrances.length >= 10 || selectedFragrances.includes(name)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 text-sm">
                    {searchTerm ? "No fragrances found matching your search" : "Start typing to search fragrances"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredFragrances.length > 0 && (
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Showing {filteredFragrances.length} fragrance{filteredFragrances.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
            {isLimited && ` (limited from ${totalMatches} total matches)`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
