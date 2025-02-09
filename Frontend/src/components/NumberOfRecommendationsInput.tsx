import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface NumberOfRecommendationsInputProps {
  numberOfRecommendations: number
  setNumberOfRecommendations: React.Dispatch<React.SetStateAction<number>>
}

export const NumberOfRecommendationsInput: React.FC<NumberOfRecommendationsInputProps> = ({
  numberOfRecommendations,
  setNumberOfRecommendations,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setNumberOfRecommendations(value)
    }
  }

  return (
    <div className="mb-6">
      <Label htmlFor="numberOfRecommendations">Number of Recommendations (1-10)</Label>
      <Input
        type="number"
        id="numberOfRecommendations"
        min={1}
        max={10}
        value={numberOfRecommendations}
        onChange={handleChange}
      />
    </div>
  )
}

