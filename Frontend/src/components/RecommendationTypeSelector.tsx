import type React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface RecommendationTypeSelectorProps {
  recommendationType: "fragrances" | "accords"
  setRecommendationType: React.Dispatch<React.SetStateAction<"fragrances" | "accords">>
}

export const RecommendationTypeSelector: React.FC<RecommendationTypeSelectorProps> = ({
  recommendationType,
  setRecommendationType,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Recommendation Type</h2>
      <RadioGroup
        value={recommendationType}
        onValueChange={(value) => setRecommendationType(value as "fragrances" | "accords")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fragrances" id="fragrances" />
          <Label htmlFor="fragrances">By Liked Fragrances</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="accords" id="accords" />
          <Label htmlFor="accords">By Accords</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
