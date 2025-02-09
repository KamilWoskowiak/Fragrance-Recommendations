import type React from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface AccordSelectorProps {
  accords: string[]
  selectedAccords: Record<string, number>
  setSelectedAccords: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export const AccordSelector: React.FC<AccordSelectorProps> = ({ accords, selectedAccords, setSelectedAccords }) => {
  const handleAccordChange = (accord: string, value: number) => {
    setSelectedAccords({ ...selectedAccords, [accord]: value })
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Select Accords</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Note: An accord will not be considered if it is left at zero.
      </p>
      {accords.map((accord) => (
        <div key={accord} className="mb-4">
          <Label htmlFor={accord}>{accord}</Label>
          <Slider
            id={accord}
            min={0}
            max={1}
            step={0.01}
            value={[selectedAccords[accord] || 0]}
            onValueChange={(value) => handleAccordChange(accord, value[0])}
          />
          <span className="text-sm">{(selectedAccords[accord] || 0).toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

