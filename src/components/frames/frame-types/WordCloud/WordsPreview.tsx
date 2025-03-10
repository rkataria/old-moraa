/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

const callbacks = {
  getWordColor: (word: any) => word.color,
}

interface Participant {
  id: string
  name: string
  avatar_url: string
}
export interface Word {
  [key: string]: any
  text: string
  value: number
  participants: Participant[]
}

export function WordCloud({
  words = [],
  colors = [],
  optionProps,
}: {
  words: Word[]
  colors: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionProps?: any
}) {
  const sortedWords = words.sort((a, b) => b.value - a.value)

  const wordsWithColors = sortedWords.map((word, index) => ({
    ...word,
    color: index < colors.length ? colors[index] : colors[colors.length - 1],
  }))

  return (
    <div className="h-full flex word-cloud">
      {/* TODO: FixAI */}
      {/* <ReactWordcloud
        callbacks={callbacks}
        words={wordsWithColors}
        options={{
          rotations: 0,
          deterministic: true,
          fontSizes: [25, 80],
          padding: 10,
          fontFamily: 'Poppins',
          transitionDuration: 1000,
          tooltipOptions: {
            render: (instance) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { reference = {} as any } = instance
              const wordData = reference?.__data__

              const participants: Participant[] = wordData?.participants || []

              const participantsHTML = participants.length
                ? participants
                    .map(
                      (participant) => `
                      <div class='flex items-center gap-2'>
                        <img src=${participant.avatar_url} class='w-6 h-6 rounded-full object-cover'/>
                        <p>${participant.name}</p>
                    </div>`
                    )
                    .join('')
                : '<p>No participants</p>'

              const tooltipContent = document.createElement('div')
              tooltipContent.style.backgroundColor = '#1e293b'
              tooltipContent.style.color = '#f8fafc'
              tooltipContent.style.padding = '8px'
              tooltipContent.style.borderRadius = '6px'
              tooltipContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
              tooltipContent.style.fontSize = '14px'
              tooltipContent.style.maxWidth = '200px'
              tooltipContent.style.whiteSpace = 'normal'

              tooltipContent.innerHTML = `
                <p class='text-xs text-gray-300'>${wordData?.text}</p>
                <div class='grid gap-2 mt-2'>
                  ${participantsHTML}
                </div>
              `

              return {
                popper: tooltipContent,
              }
            },
          },
          ...optionProps,
        }}
      /> */}
    </div>
  )
}
