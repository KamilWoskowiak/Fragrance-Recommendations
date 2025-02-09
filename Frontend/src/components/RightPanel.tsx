import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RecommendationResponse {
  name: string
  brand: string
  rating_value: number
  rating_count: number
  gender_label: string
  price_value_label: string
  match_score: number
  dominant_accords: [string, number][]
  notes_breakdown: {
    topnotes?: string[]
    midnotes?: string[]
    bottomnotes?: string[]
  } | null
}

interface RightPanelProps {
  results: RecommendationResponse[] | null
}

export const RightPanel: React.FC<RightPanelProps> = ({ results }) => {
  return (
    <div className="w-full md:w-1/3 bg-secondary/80 border-l border-border flex flex-col h-full">
      <div className="p-6 flex-grow overflow-hidden flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
        {results ? (
          <ScrollArea className="flex-grow">
            <div className="space-y-6 pr-4">
              {results.map((fragrance, index) => (
                <div key={index} className="bg-background p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold">{fragrance.name}</h3>
                  <p className="text-muted-foreground">by {fragrance.brand}</p>
                  <div className="mt-2">
                    <p>
                      Rating: {fragrance.rating_value?.toFixed(1) ?? "N/A"} ({fragrance.rating_count} reviews)
                    </p>
                    <p>Gender: {fragrance.gender_label}</p>
                    <p>Price: {fragrance.price_value_label}</p>
                    <p>Match Score: {fragrance.match_score ? (fragrance.match_score * 100).toFixed(2) + "%" : "N/A"}</p>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Dominant Accords:</h4>
                    <ul className="list-disc list-inside">
                      {fragrance.dominant_accords &&
                        fragrance.dominant_accords.map(([accord, value], i) => (
                          <li key={i}>
                            {accord}: {value ? (value * 100).toFixed(2) + "%" : "N/A"}
                          </li>
                        ))}
                    </ul>
                  </div>
                  {fragrance.notes_breakdown && (
                    <div className="mt-2">
                      <h4 className="font-semibold">Notes Breakdown:</h4>
                      {Object.entries(fragrance.notes_breakdown).map(
                        ([key, notes]) =>
                          notes &&
                          notes.length > 0 && (
                            <div key={key}>
                              <p className="font-medium">
                                {key === "topnotes"
                                  ? "Top Notes:"
                                  : key === "midnotes"
                                    ? "Mid Notes:"
                                    : key === "bottomnotes"
                                      ? "Base Notes:"
                                      : "Notes:"}
                              </p>
                              <p>{notes.join(", ")}</p>
                            </div>
                          ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              No recommendations yet. Please submit the form to get recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

