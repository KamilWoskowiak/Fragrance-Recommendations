"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecommendationTypeSelector } from "./recommendation-type-selector"
import { FragranceSearch } from "./fragrance-search"
import { AccordSelector } from "./accord-selector"
import { TimeSelector } from "./time-selector"
import { WeatherSelector } from "./weather-selector"
import { DiversitySlider } from "./diversity-slider"
import { NumberOfRecommendationsInput } from "./number-of-recommendations-input"
import { Button } from "@/components/ui/button"
import { Sparkles, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import type { FragranceRecommendation } from "@/app/page"

interface LeftPanelProps {
  setResults: (results: FragranceRecommendation[] | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function LeftPanel({ setResults, isLoading, setIsLoading }: LeftPanelProps) {
  const [recommendationType, setRecommendationType] = useState<"fragrances" | "accords">("fragrances")
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([])
  const [selectedAccords, setSelectedAccords] = useState<Record<string, number>>({})
  const [time, setTime] = useState<"day" | "night" | "both">("both")
  const [weather, setWeather] = useState<"cold" | "hot" | "both">("both")
  const [diversity, setDiversity] = useState<number>(0.3)
  const [numberOfRecommendations, setNumberOfRecommendations] = useState<number>(5)
  const [fragrances, setFragrances] = useState<[string, string][]>([])
  const [accords, setAccords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true)
        setError(null)

        const [fragrancesResponse, accordsResponse] = await Promise.all([api.get("/fragrances"), api.get("/accords")])

        setFragrances(fragrancesResponse.data.fragrances)
        setAccords(accordsResponse.data.accords)
      } catch (error) {
        console.error("Error fetching data:", error)

        const fallbackFragrances: [string, string][] = [
          ["Chanel", "Bleu de Chanel"],
          ["Dior", "Sauvage"],
          ["Tom Ford", "Black Orchid"],
          ["Creed", "Aventus"],
          ["Yves Saint Laurent", "La Nuit de L'Homme"],
        ]

        const fallbackAccords = ["Fresh", "Citrus", "Woody", "Floral", "Oriental", "Spicy"]

        setFragrances(fallbackFragrances)
        setAccords(fallbackAccords)
        setError("Unable to connect to the recommendation service. Using demo data.")
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    setError(null)
    setIsLoading(true)

    if (recommendationType === "fragrances" && selectedFragrances.length === 0) {
      setError("Please select at least one fragrance.")
      setIsLoading(false)
      return
    }

    if (recommendationType === "accords") {
      const selectedAccordValues = Object.values(selectedAccords)
      if (selectedAccordValues.length === 0 || selectedAccordValues.every((value) => value === 0)) {
        setError("Please select at least one accord with a value greater than zero.")
        setIsLoading(false)
        return
      }
    }

    try {
      let response
      if (recommendationType === "fragrances") {
        response = await api.post("/recommend-by-fragrances", {
          liked_fragrances: selectedFragrances,
          time_pref: time,
          season_pref: weather,
          diversity_factor: diversity,
          top_k: numberOfRecommendations,
        })
      } else {
        response = await api.post("/recommend-by-accords", {
          accord_preferences: selectedAccords,
          time_pref: time,
          season_pref: weather,
          diversity_factor: diversity,
          top_k: numberOfRecommendations,
        })
      }

      // Process the results
      const processedResults = response.data.map((fragrance: any) => {
        let notesBreakdown = fragrance.notes_breakdown

        if (typeof notesBreakdown === "string") {
          try {
            const correctedJSON = notesBreakdown.replace(/'/g, '"')
            notesBreakdown = JSON.parse(correctedJSON)
          } catch (error) {
            console.error("Error parsing notes_breakdown:", error)
            notesBreakdown = null
          }
        }

        return {
          ...fragrance,
          notes_breakdown: notesBreakdown
            ? {
                topnotes: notesBreakdown.topnotes || [],
                midnotes: notesBreakdown.midnotes || [],
                bottomnotes: notesBreakdown.bottomnotes || [],
              }
            : null,
        }
      })

      setResults(processedResults)
    } catch (error) {
      console.error("Error:", error)
      setError("An error occurred while getting recommendations.")
    } finally {
      setIsLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <Card className="w-full border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-slate-100">Loading...</CardTitle>
          <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
            Fetching fragrance data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-xl border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Find Your Perfect Fragrance
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Discover personalized fragrance recommendations based on your preferences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 sm:space-y-8">
        <RecommendationTypeSelector
          recommendationType={recommendationType}
          setRecommendationType={setRecommendationType}
        />

        {recommendationType === "fragrances" ? (
          <FragranceSearch
            fragrances={fragrances}
            selectedFragrances={selectedFragrances}
            setSelectedFragrances={setSelectedFragrances}
          />
        ) : (
          <AccordSelector accords={accords} selectedAccords={selectedAccords} setSelectedAccords={setSelectedAccords} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <TimeSelector time={time} setTime={setTime} />
          <WeatherSelector weather={weather} setWeather={setWeather} />
        </div>

        <DiversitySlider diversity={diversity} setDiversity={setDiversity} />

        <NumberOfRecommendationsInput
          numberOfRecommendations={numberOfRecommendations}
          setNumberOfRecommendations={setNumberOfRecommendations}
        />

        {error && (
          <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800 dark:text-red-200 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full h-10 sm:h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 shadow-lg text-white border-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
              Finding Recommendations...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Get Recommendations
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
