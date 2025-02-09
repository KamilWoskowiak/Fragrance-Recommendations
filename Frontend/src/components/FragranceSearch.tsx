"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FragranceSearchProps {
  fragrances: [string, string][]
  selectedFragrances: string[]
  setSelectedFragrances: React.Dispatch<React.SetStateAction<string[]>>
}

export const FragranceSearch: React.FC<FragranceSearchProps> = ({
  fragrances,
  selectedFragrances,
  setSelectedFragrances,
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFragrances = fragrances.filter(([brand, name]) =>
    `${brand} ${name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectFragrance = (fragrance: string) => {
    if (selectedFragrances.length < 10 && !selectedFragrances.includes(fragrance)) {
      setSelectedFragrances([...selectedFragrances, fragrance])
    }
  }

  const handleRemoveFragrance = (fragrance: string) => {
    setSelectedFragrances(selectedFragrances.filter((f) => f !== fragrance))
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Select Fragrances (Max 10)</h2>
      <p className="text-sm text-muted-foreground mb-4">Choose fragrances that you like.</p>
      <Input
        type="text"
        placeholder="Search fragrances..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <ScrollArea className="h-60 border rounded-md p-2">
        {filteredFragrances.map(([brand, name]) => (
          <div key={`${brand}-${name}`} className="flex justify-between items-center mb-2">
            <span>{`${brand} - ${name}`}</span>
            <Button onClick={() => handleSelectFragrance(name)} disabled={selectedFragrances.length >= 10} size="sm">
              Add
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Selected Fragrances:</h3>
        {selectedFragrances.map((fragrance) => (
          <div key={fragrance} className="flex justify-between items-center mb-2">
            <span>{fragrance}</span>
            <Button onClick={() => handleRemoveFragrance(fragrance)} size="sm" variant="destructive">
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

