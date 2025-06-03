"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart, Palette } from "lucide-react"

interface RecommendationTypeSelectorProps {
  recommendationType: "fragrances" | "accords"
  setRecommendationType: React.Dispatch<React.SetStateAction<"fragrances" | "accords">>
}

export function RecommendationTypeSelector({
  recommendationType,
  setRecommendationType,
}: RecommendationTypeSelectorProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Recommendation Method</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          Choose how you'd like to discover new fragrances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={recommendationType}
          onValueChange={(value) => setRecommendationType(value as "fragrances" | "accords")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors">
            <RadioGroupItem value="fragrances" id="fragrances" />
            <Heart className="h-4 w-4 text-blue-700" />
            <div className="flex-1">
              <Label htmlFor="fragrances" className="font-medium cursor-pointer text-blue-900 dark:text-blue-100">
                Based on Liked Fragrances
              </Label>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Get recommendations similar to fragrances you already love
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors">
            <RadioGroupItem value="accords" id="accords" />
            <Palette className="h-4 w-4 text-blue-700" />
            <div className="flex-1">
              <Label htmlFor="accords" className="font-medium cursor-pointer text-blue-900 dark:text-blue-100">
                Based on Scent Accords
              </Label>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Discover fragrances by selecting your preferred scent profiles
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
