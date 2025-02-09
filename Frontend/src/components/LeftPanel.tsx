"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { RecommendationTypeSelector } from "./RecommendationTypeSelector"
import { FragranceSearch } from "./FragranceSearch"
import { AccordSelector } from "./AccordSelector"
import { TimeSelector } from "./TimeSelector"
import { WeatherSelector } from "./WeatherSelector"
import { DiversitySlider } from "./DiversitySlider"
import { NumberOfRecommendationsInput } from "./NumberOfRecommendationsInput"
import { Button } from "@/components/ui/button"

interface LeftPanelProps {
  setResults: React.Dispatch<React.SetStateAction<any>>
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ setResults }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fragrancesResponse, accordsResponse] = await Promise.all([
          axios.get("http://localhost:8000/fragrances"),
          axios.get("http://localhost:8000/accords"),
        ])
        setFragrances(fragrancesResponse.data.fragrances)
        setAccords(accordsResponse.data.accords)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch fragrances and accords. Please try again later.")
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    setError(null)

    if (recommendationType === "fragrances" && selectedFragrances.length === 0) {
      setError("Please select at least one fragrance.")
      return
    }

    if (recommendationType === "accords") {
      const selectedAccordValues = Object.values(selectedAccords)
      console.log(selectedAccords)
      if (selectedAccordValues.length === 0 || selectedAccordValues.every((value) => value === 0)) {
        setError("Please select at least one accord with a value greater than zero.")
        return
      }
    }

    try {
      let response
      if (recommendationType === "fragrances") {
        response = await axios.post("http://localhost:8000/recommend-by-fragrances", {
          liked_fragrances: selectedFragrances,
          time_pref: time,
          season_pref: weather,
          diversity_factor: diversity,
          top_k: numberOfRecommendations,
        })
      } else {
        response = await axios.post("http://localhost:8000/recommend-by-accords", {
          accord_preferences: selectedAccords,
          time_pref: time,
          season_pref: weather,
          diversity_factor: diversity,
          top_k: numberOfRecommendations,
        })
      }

      // Convert the notes_breakdown to the correct structure
      const processedResults = response.data.map((fragrance: any) => {
        let notesBreakdown = fragrance.notes_breakdown;
      
        if (typeof notesBreakdown === "string") {
          try {
            // Replace single quotes with double quotes to make it valid JSON
            const correctedJSON = notesBreakdown.replace(/'/g, '"');
            notesBreakdown = JSON.parse(correctedJSON);
          } catch (error) {
            console.error("Error parsing notes_breakdown:", error);
            notesBreakdown = null;
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
        };
      });
      
      setResults(processedResults);            
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setError("Failed to fetch recommendations. Please try again later.")
    }
  }

  return (
    <div className="w-full md:w-2/3 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Fragrance Recommender</h1>
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
      <TimeSelector time={time} setTime={setTime} />
      <WeatherSelector weather={weather} setWeather={setWeather} />
      <DiversitySlider diversity={diversity} setDiversity={setDiversity} />
      <NumberOfRecommendationsInput
        numberOfRecommendations={numberOfRecommendations}
        setNumberOfRecommendations={setNumberOfRecommendations}
      />
      {error && <p className="text-destructive mb-4">{error}</p>}
      <Button onClick={handleSubmit} className="mt-6">
        Get Recommendations
      </Button>
    </div>
  )
}

