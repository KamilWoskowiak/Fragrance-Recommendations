import type React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface TimeSelectorProps {
  time: "day" | "night" | "both"
  setTime: React.Dispatch<React.SetStateAction<"day" | "night" | "both">>
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ time, setTime }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Time of Day</h2>
      <RadioGroup value={time} onValueChange={(value) => setTime(value as "day" | "night" | "both")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="day" id="day" />
          <Label htmlFor="day">Day</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="night" id="night" />
          <Label htmlFor="night">Night</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="both" id="both-time" />
          <Label htmlFor="both-time">Both</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

