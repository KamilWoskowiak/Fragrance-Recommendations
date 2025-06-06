"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sun, Moon, Clock } from "lucide-react"

interface TimeSelectorProps {
  time: "day" | "night" | "both"
  setTime: React.Dispatch<React.SetStateAction<"day" | "night" | "both">>
}

export function TimeSelector({ time, setTime }: TimeSelectorProps) {
  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center text-blue-900 dark:text-blue-100">
          <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-700 flex-shrink-0" />
          Time of Day
        </CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
          When do you plan to wear this fragrance?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={time}
          onValueChange={(value) => setTime(value as "day" | "night" | "both")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="day" id="day" />
            <Sun className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <Label htmlFor="day" className="cursor-pointer text-sm">
              Daytime
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="night" id="night" />
            <Moon className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <Label htmlFor="night" className="cursor-pointer text-sm">
              Evening
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="both" id="both-time" />
            <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <Label htmlFor="both-time" className="cursor-pointer text-sm">
              Any Time
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
