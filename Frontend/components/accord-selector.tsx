"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Palette } from "lucide-react"

interface AccordSelectorProps {
  accords: string[]
  selectedAccords: Record<string, number>
  setSelectedAccords: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export function AccordSelector({ accords, selectedAccords, setSelectedAccords }: AccordSelectorProps) {
  const handleAccordChange = (accord: string, value: number) => {
    setSelectedAccords({ ...selectedAccords, [accord]: value })
  }

  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center text-blue-900 dark:text-blue-100">
          <Palette className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700 flex-shrink-0" />
          Select Scent Accords
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
          Adjust the intensity of different scent profiles. Accords set to zero will be ignored.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-64 sm:h-80">
          <div className="space-y-4 sm:space-y-6 pr-2 sm:pr-4">
            {accords.map((accord) => (
              <div key={accord} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={accord} className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    {accord}
                  </Label>
                  <span className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {(selectedAccords[accord] || 0).toFixed(2)}
                  </span>
                </div>
                <Slider
                  id={accord}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[selectedAccords[accord] || 0]}
                  onValueChange={(value) => handleAccordChange(accord, value[0])}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
