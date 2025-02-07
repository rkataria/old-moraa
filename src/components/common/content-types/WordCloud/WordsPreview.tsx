import ReactWordcloud, { Word } from 'react-wordcloud'

const callbacks = {
  getWordColor: (word: Word) => word.color,
}

export function WordCloud({
  words = [],
  colors = [],
  optionProps,
  animate,
}: {
  words: Word[]
  colors: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionProps?: any
  animate?: boolean
}) {
  // const [transitionDuration, setTransitionDuration] = useState(1000)
  // const [wordsList, setWordsList] = useState<Word[]>([])

  // useEffect(() => {
  //   if (JSON.stringify(words) === JSON.stringify(wordsList)) {
  //     return
  //   }
  //   setTransitionDuration(1000)
  //   setTimeout(() => {
  //     setTransitionDuration(10000000)
  //   }, 2000)

  //   setWordsList(words)

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [words])

  const sortedWords = words.sort((a, b) => b.value - a.value)

  const wordsWithColors = sortedWords.map((word, index) => ({
    ...word,
    color: index < colors.length ? colors[index] : colors[colors.length - 1],
  }))

  return (
    <div className="h-full flex">
      <ReactWordcloud
        callbacks={callbacks}
        words={wordsWithColors}
        options={{
          rotations: 0,
          fontSizes: [25, 80],
          padding: 10,
          enableTooltip: false,
          fontFamily: 'Poppins',
          transitionDuration: animate ? 1000 : 10000000000000000,
          ...optionProps,
        }}
      />
    </div>
  )
}
