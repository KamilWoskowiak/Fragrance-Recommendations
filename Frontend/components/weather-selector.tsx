"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Snowflake, Sun, Cloud } from "lucide-react"

interface WeatherSelectorProps {
  weather: "cold" | "hot" | "both"
  setWeather: React.Dispatch<React.SetStateAction<"cold" | "hot" | "both">>
}

export function WeatherSelector({ weather, setWeather }: WeatherSelectorProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center text-blue-900 dark:text-blue-100">
          <Cloud className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700 flex-shrink-0" />
          Season/Weather
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
          What weather conditions will you wear this in?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={weather}
          onValueChange={(value) => setWeather(value as "cold" | "hot" | "both")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cold" id="cold" />
            <Snowflake className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <Label htmlFor="cold" className="cursor-pointer text-sm">
              Cold Weather
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="hot" id="hot" />
            <Sun className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <Label htmlFor="hot" className="cursor-pointer text-sm">
              Warm Weather
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="both" id="both-weather" />
            <Cloud className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <Label htmlFor="both-weather" className="cursor-pointer text-sm">
              Any Weather
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
