import clsx from "clsx"
import React, { useState } from "react"

const votes = [10, 20, 50]
const totalVotes = votes.reduce((a, b) => a + b, 0)

export interface PollPreviewProps {
  question: string
  options: string[]
  config?: {
    backgroundColor: string
  }
  mode?: "present" | "vote"
  onVote?: (index: number) => void
}

function PollPreview({
  question,
  options,
  config,
  mode = "present",
  onVote = () => {},
}: PollPreviewProps) {
  const [voted, setVoted] = useState<boolean>(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<number[]>(votes)
  const [showResults, setShowResults] = useState<boolean>(false)

  const handleVote = () => {
    if (voted) {
      setShowResults(true)
    }

    if (selected !== null) {
      setVoted(true)
      setResults((prev) => {
        const newResults = [...prev]
        newResults[selected]++
        return newResults
      })
      onVote(selected)
    }
  }

  return (
    <div
      className={clsx(
        "absolute w-full h-full flex justify-center items-start pt-12"
      )}
      style={{
        backgroundColor: config?.backgroundColor,
      }}
    >
      <div className="p-8 w-4/5">
        <h2 className="text-3xl font-bold mb-8 text-white">{question}</h2>
        <ul>
          {options.map((option, index) => (
            <li key={index}>
              <button
                className={clsx(
                  "w-full text-left p-4 hover:bg-black/25 rounded-md mb-2 font-semibold cursor-pointer",
                  {
                    "bg-black/5 text-white/50": selected !== index,
                    "bg-black/25 text-white": selected === index,
                  }
                )}
                onClick={() => setSelected(index)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        {mode == "vote" && (
          <div className="flex justify-end items-center mt-4">
            <button
              className={clsx("bg-black text-white px-8 py-3 rounded-md")}
              onClick={handleVote}
            >
              {voted ? "View Results" : "Vote"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PollPreview
