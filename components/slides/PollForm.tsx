import { IconTrash } from "@tabler/icons-react"
import clsx from "clsx"
import React from "react"

interface PollFormProps {
  question: string
  options: string[]
  onChangePoll: (poll: any) => void
}

function PollForm({ question, options, onChangePoll }: PollFormProps) {
  return (
    <div
      className={clsx("absolute w-full h-full flex justify-center items-start")}
    >
      <div className="p-8 w-4/5">
        <input
          className="text-3xl font-bold mb-8 bg-transparent w-full text-black outline-none hover:outline-none border-0"
          value={question}
          placeholder="Question goes here"
          onChange={(e) => onChangePoll({ question: e.target.value })}
        />
        <ul>
          {options.map((option, index) => (
            <li
              key={index}
              className="flex justify-between items-center mb-2 rounded-md font-semibold bg-black/5 text-black"
            >
              <input
                className={clsx(
                  "w-full text-left p-4 bg-transparent  border-0 outline-none focus:border-0 focus:ring-0 hover:outline-none"
                )}
                type="text"
                value={option}
                placeholder={`Option ${index + 1}`}
                onChange={(e) =>
                  onChangePoll({
                    options: options.map((o, i) =>
                      i == index ? e.target.value : o
                    ),
                  })
                }
              />
              <button
                className="p-4"
                onClick={() => {
                  onChangePoll({
                    options: options.filter((o, i) => i !== index),
                  })
                }}
              >
                <IconTrash size={16} />
              </button>
            </li>
          ))}
          <li>
            <button
              className={clsx(
                "w-full text-center p-4 border-2 border-black rounded-md mb-2 font-semibold cursor-pointer text-black outline-none hover:outline-none"
              )}
              onClick={(e) => {
                onChangePoll({
                  options: [...options, `Option ${options.length + 1}`],
                })
              }}
            >
              Add option
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PollForm
