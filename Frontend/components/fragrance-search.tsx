"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X } from "lucide-react"

interface FragranceSearchProps {
  fragrances: [string, string][]
  selectedFragrances: string[]
  setSelectedFragrances: React.Dispatch<React.SetStateAction<string[]>>
}

export function FragranceSearch({ fragrances, selectedFragrances, setSelectedFragrances }: FragranceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFragrances = fragrances.filter(([brand, name]) =>
    `${brand} ${name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[120px] sm:max-w-none">{fragrance}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                    onClick={() => handleRemoveFragrance(fragrance)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <ScrollArea className="h-48 sm:h-64 border rounded-lg">
          <div className="p-2 space-y-1">
            {filteredFragrances.length > 0 ? (
              filteredFragrances.map(([brand, name]) => (
                <div
                  key={`${brand}-${name}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-blue-900 dark:text-blue-100 truncate">{name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate">by {brand}</p>
                  </div>
                  <Button
                    onClick={() => handleSelectFragrance(name)}
                    disabled={selectedFragrances.length >= 10 || selectedFragrances.includes(name)}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                {searchTerm ? "No fragrances found matching your search" : "Start typing to search fragrances"}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
