import type React from "react"
import { useState } from "react"
import { LeftPanel } from "./components/LeftPanel"
import { RightPanel } from "./components/RightPanel"

const App: React.FC = () => {
  const [results, setResults] = useState<any>(null)

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row">
        <LeftPanel setResults={setResults} />
        <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <RightPanel results={results} />
      </main>
      <footer className="py-4 text-center bg-background">
        <a
          href="https://github.com/kamilwoskowiak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Made by Kamil Woskowiak | GitHub
        </a>
      </footer>
    </div>
  )
}

export default App

