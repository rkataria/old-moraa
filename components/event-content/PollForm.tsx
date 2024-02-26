import { useContext, useEffect, useRef, useState } from "react"
import { useThrottle } from "@uidotdev/usehooks"
import ReactTextareaAutosize from "react-textarea-autosize"
import { IconTrash } from "@tabler/icons-react"
import clsx from "clsx"

import SlideManagerContext from "@/contexts/SlideManagerContext"
import { ISlide, SlideManagerContextType } from "@/types/slide.type"

interface PollFormProps {
  slide: ISlide
}

function PollForm({ slide: slideFromRemote }: PollFormProps) {
  const [successiveEnterPressCount, setSuccessiveEnterPressCount] = useState(0)
  const optionsRef = useRef<any>([])

  const { updateSlide } = useContext(
    SlideManagerContext
  ) as SlideManagerContextType

  const [question, setQuestion] = useState<string>(
    slideFromRemote.content.question
  )
  const [options, setOptions] = useState<string[]>(
    slideFromRemote.content.options
  )
  const throttledQuestion = useThrottle(question, 500)
  const throttledOptions = useThrottle(options, 500)

  const updateQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value)
  }

  const updateOption = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newOptions = [...options]
    newOptions[index] = e.target.value
    setOptions(newOptions)
  }

  const deleteOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const addNewOption = () => {
    setOptions([...options, ""])
  }

  const focusOnFirstEmptyOption = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      const indexOfFirstEmptyOption = options.findIndex(
        (option) => option?.length === 0
      )
      if (indexOfFirstEmptyOption !== -1) {
        optionsRef.current[indexOfFirstEmptyOption].focus()
        e.preventDefault()
        return
      }
      addNewOption()
      e.preventDefault()
    }
  }

  const onQuestionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") {
      setSuccessiveEnterPressCount(0)
      return
    }
    if (successiveEnterPressCount < 1) {
      setSuccessiveEnterPressCount(successiveEnterPressCount + 1)
      return
    }
    if (successiveEnterPressCount === 1) {
      setQuestion(question.trim())
      focusOnFirstEmptyOption(e)
      setSuccessiveEnterPressCount(0)
    }
  }

  useEffect(() => {
    updateSlide({
      ...slideFromRemote,
      content: {
        ...slideFromRemote.content,
        question: throttledQuestion,
        options: throttledOptions,
      },
    })
  }, [throttledQuestion, throttledOptions])

  const handleAddOption = () => {
    updateSlide({
      ...slideFromRemote,
      content: { ...slideFromRemote.content, options: [...options, ""] },
    })
  }

  return (
    <div
      className={clsx("absolute w-full h-full flex justify-center items-start")}
    >
      <div className="p-8 w-4/5">
        <ReactTextareaAutosize
          autoFocus={question?.length === 0}
          maxLength={100}
          className="text-3xl font-bold mb-8 bg-transparent w-full text-black outline-none hover:outline-none border-0 resize-none"
          value={question}
          placeholder="Question goes here"
          onChange={updateQuestion}
          onKeyDown={onQuestionKeyDown}
        />
        <ul>
          {options.map((option: string, index: number) => (
            <li
              key={index}
              className="flex justify-between items-center mb-2 rounded-md font-semibold bg-black/5 text-black"
            >
              <ReactTextareaAutosize
                ref={(el: any) => (optionsRef.current[index] = el)}
                autoFocus={option.length === 0 && question?.length !== 0}
                className={clsx(
                  "w-full text-left p-4 bg-transparent  border-0 outline-none focus:border-0 focus:ring-0 hover:outline-none resize-none"
                )}
                value={option}
                placeholder={`Option ${index + 1}`}
                onChange={(e) => updateOption(e, index)}
                onKeyDown={focusOnFirstEmptyOption}
              />
              <button className="p-4" onClick={() => deleteOption(index)}>
                <IconTrash size={16} />
              </button>
            </li>
          ))}
          <li>
            <button
              className={clsx(
                "w-full text-center p-4 border-2 border-black rounded-md mb-2 font-semibold cursor-pointer text-black outline-none hover:outline-none"
              )}
              onClick={addNewOption}
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
