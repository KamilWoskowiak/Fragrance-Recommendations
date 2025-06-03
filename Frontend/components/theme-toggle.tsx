"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-9 px-3 min-w-[90px]">
        <div className="h-4 w-4" />
        <span className="ml-2 text-sm">Theme</span>
      </Button>
    )
  }

  const isLight = theme === "light"

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 px-3 min-w-[90px] border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      <div className="relative flex items-center">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
        <span className="ml-2 text-sm whitespace-nowrap">{isLight ? "Light" : "Dark"}</span>
      </div>
    </Button>
  )
}
