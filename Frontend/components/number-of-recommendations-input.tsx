"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Hash } from "lucide-react"

interface NumberOfRecommendationsInputProps {
  numberOfRecommendations: number
  setNumberOfRecommendations: React.Dispatch<React.SetStateAction<number>>
}

export function NumberOfRecommendationsInput({
  numberOfRecommendations,
  setNumberOfRecommendations,
}: NumberOfRecommendationsInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setNumberOfRecommendations(value)
    }
  }

  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center text-blue-900 dark:text-blue-100">
          <Hash className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700 flex-shrink-0" />
          Number of Recommendations
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
          How many fragrance suggestions would you like? (1-10)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="numberOfRecommendations" className="font-medium text-blue-900 dark:text-blue-100 text-sm">
            Recommendations Count
          </Label>
          <Input
            type="number"
            id="numberOfRecommendations"
            min={1}
            max={10}
            value={numberOfRecommendations}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
