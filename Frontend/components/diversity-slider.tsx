"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Shuffle } from "lucide-react"

interface DiversitySliderProps {
  diversity: number
  setDiversity: React.Dispatch<React.SetStateAction<number>>
}

export function DiversitySlider({ diversity, setDiversity }: DiversitySliderProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center text-blue-900 dark:text-blue-100">
          <Shuffle className="mr-2 h-5 w-5 text-blue-700" />
          Diversity Factor
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          Control how adventurous your recommendations should be
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="diversity" className="font-medium text-blue-900 dark:text-blue-100">
            Diversity Level
          </Label>
          <span className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {diversity.toFixed(2)}
          </span>
        </div>

        <Slider
          id="diversity"
          min={0}
          max={1}
          step={0.01}
          value={[diversity]}
          onValueChange={(value) => setDiversity(value[0])}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Similar to preferences</span>
          <span>More adventurous</span>
        </div>
      </CardContent>
    </Card>
  )
}
