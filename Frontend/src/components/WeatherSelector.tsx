import type React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface WeatherSelectorProps {
  weather: "cold" | "hot" | "both"
  setWeather: React.Dispatch<React.SetStateAction<"cold" | "hot" | "both">>
}

export const WeatherSelector: React.FC<WeatherSelectorProps> = ({ weather, setWeather }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Weather</h2>
      <RadioGroup value={weather} onValueChange={(value) => setWeather(value as "cold" | "hot" | "both")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cold" id="cold" />
          <Label htmlFor="cold">Cold</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hot" id="hot" />
          <Label htmlFor="hot">Hot</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="both" id="both-weather" />
          <Label htmlFor="both-weather">Both</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
