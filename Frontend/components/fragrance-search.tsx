"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X, FilterX } from "lucide-react"

interface FragranceSearchProps {
  fragrances: [string, string][]
  selectedFragrances: string[]
  setSelectedFragrances: React.Dispatch<React.SetStateAction<string[]>>
}

// Predefined filter categories
const FILTERS = {
  // Categories
  popular: ["Bleu de Chanel", "Sauvage", "Aventus", "Black Orchid", "La Nuit de L'Homme"],
  fresh: ["Light Blue", "Acqua di Gio", "Cool Water", "CK One", "L'Eau d'Issey"],
  woody: ["Terre d'Hermès", "Oud Wood", "Encre Noire", "Tam Dao", "Santal 33"],
  oriental: ["Spicebomb", "Black Opium", "Tobacco Vanille", "Shalimar", "Hypnotic Poison"],
  floral: ["J'adore", "Flowerbomb", "Daisy", "Miss Dior", "Chanel No 5"],

  // Price ranges
  budget: ["CK One", "Cool Water", "Nautica Voyage", "Encre Noire", "Davidoff Cool Water"],
  midrange: ["Bleu de Chanel", "Sauvage", "Light Blue", "La Nuit de L'Homme", "Acqua di Gio"],
  luxury: ["Aventus", "Tobacco Vanille", "Oud Wood", "Baccarat Rouge 540", "Santal 33"],

  // Brands
  chanel: ["Chanel"],
  dior: ["Dior"],
  tomford: ["Tom Ford"],
  creed: ["Creed"],
  guerlain: ["Guerlain"],
}

// Filter categories for UI organization
const FILTER_CATEGORIES = {
  type: ["popular", "fresh", "woody", "oriental", "floral"],
  price: ["budget", "midrange", "luxury"],
  brand: ["chanel", "dior", "tomford", "creed", "guerlain"],
}

// Filter display names
const FILTER_NAMES = {
  popular: "Popular",
  fresh: "Fresh",
  woody: "Woody",
  oriental: "Oriental",
  floral: "Floral",
  budget: "Budget",
  midrange: "Mid-range",
  luxury: "Luxury",
  chanel: "Chanel",
  dior: "Dior",
  tomford: "Tom Ford",
  creed: "Creed",
  guerlain: "Guerlain",
}

export function FragranceSearch({ fragrances, selectedFragrances, setSelectedFragrances }: FragranceSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Apply filters to the fragrances
  const filteredFragrances = fragrances.filter(([brand, name]) => {
    // First apply text search
    const matchesSearch = `${brand} ${name}`.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // If no filters are active, show all search results
    if (activeFilters.length === 0) return true

    // Check if fragrance matches any of the active filters
    return activeFilters.some((filter) => {
      // For brand filters, check the brand name
      if (FILTER_CATEGORIES.brand.includes(filter)) {
        return brand.toLowerCase().includes(filter.toLowerCase())
      }

      // For other filters, check if the fragrance name is in the filter list
      return FILTERS[filter as keyof typeof FILTERS].some((filterName) =>
        name.toLowerCase().includes(filterName.toLowerCase()),
      )
    })
  })

  const handleSelectFragrance = (fragrance: string) => {
    if (selectedFragrances.length < 10 && !selectedFragrances.includes(fragrance)) {
      setSelectedFragrances([...selectedFragrances, fragrance])
    }
  }

  const handleRemoveFragrance = (fragrance: string) => {
    setSelectedFragrances(selectedFragrances.filter((f) => f !== fragrance))
  }

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const clearFilters = () => {
    setActiveFilters([])
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

        {/* Filter Section */}
        <div className="space-y-3">
          {/* Category Filters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">By Category</h4>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 flex items-center"
                >
                  <FilterX className="h-3 w-3 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
            <div className="w-full overflow-auto pb-2">
              <div className="flex space-x-2 min-w-max">
                {FILTER_CATEGORIES.type.map((filter) => (
                  <Badge
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-xs"
                    onClick={() => handleFilterToggle(filter)}
                  >
                    {FILTER_NAMES[filter as keyof typeof FILTER_NAMES]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Price Filters */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">By Price</h4>
            <div className="w-full overflow-auto pb-2">
              <div className="flex space-x-2 min-w-max">
                {FILTER_CATEGORIES.price.map((filter) => (
                  <Badge
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-xs"
                    onClick={() => handleFilterToggle(filter)}
                  >
                    {FILTER_NAMES[filter as keyof typeof FILTER_NAMES]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Filters */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">By Brand</h4>
            <div className="w-full overflow-auto pb-2">
              <div className="flex space-x-2 min-w-max">
                {FILTER_CATEGORIES.brand.map((filter) => (
                  <Badge
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-xs"
                    onClick={() => handleFilterToggle(filter)}
                  >
                    {FILTER_NAMES[filter as keyof typeof FILTER_NAMES]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
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
                  className="flex items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors"
                >
                  {/* Fixed layout to ensure button is always visible */}
                  <div className="flex-1 min-w-0 mr-2">
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
                {searchTerm || activeFilters.length > 0
                  ? "No fragrances found matching your criteria"
                  : "Start typing to search fragrances"}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
