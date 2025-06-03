import type React from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface DiversitySliderProps {
  diversity: number
  setDiversity: React.Dispatch<React.SetStateAction<number>>
}

export const DiversitySlider: React.FC<DiversitySliderProps> = ({ diversity, setDiversity }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Diversity Factor</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Adjust this slider to control how diverse the recommendations should be. A higher value will result in more
        unique fragrances, while a lower value will stick closer to your preferences.
      </p>
      <Label htmlFor="diversity">Diversity: {diversity.toFixed(2)}</Label>
      <Slider
        id="diversity"
        min={0}
        max={1}
        step={0.01}
        value={[diversity]}
        onValueChange={(value) => setDiversity(value[0])}
      />
    </div>
  )
}
