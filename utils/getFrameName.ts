import { HtmlToTextOptions, convert } from 'html-to-text'

import { ContentType } from '@/components/common/ContentTypePicker'
import { IFrame, ISection, TextBlock } from '@/types/frame.type'

const options: HtmlToTextOptions = {
  selectors: [{ selector: 'h1', options: { uppercase: false } }],
}

function maxPollNumber(pollName: string) {
  const match = pollName.match(/Poll #(\d+)/)

  return match ? parseInt(match[1], 10) : 0
}

const getPollNumber = ({ sections }: { sections: ISection[] }) => {
  const allPollNumber: number[] = []

  sections.forEach((section) => {
    const { frames } = section
    const polls = frames.filter((_f) => _f.type === ContentType.POLL)
    polls.forEach((_frame) => allPollNumber.push(maxPollNumber(_frame.name)))
  })

  return Math.max(...allPollNumber) + 1
}

export const getFrameName = ({
  frame,
  sections,
}: {
  frame: IFrame
  sections?: ISection[]
}) => {
  if (
    !frame.content?.blocks &&
    !frame.content?.title &&
    !frame.content?.question
  ) {
    return frame.name
  }

  if (frame.type === ContentType.REFLECTION) {
    return frame.content?.title || frame.name
  }

  if (frame.type === ContentType.POLL) {
    let pollIdentifier
    if (!sections) return frame.name
    if (frame.name.includes('Poll #')) {
      // eslint-disable-next-line prefer-destructuring
      pollIdentifier = frame.name.split('-')[0]
    } else {
      pollIdentifier = `Poll #${getPollNumber({ sections })}`
    }

    const shortName = createShortName(frame.content?.question as string)

    const shortTitle = shortName
      ? `${pollIdentifier} - ${shortName}`
      : `${pollIdentifier}`

    return shortTitle
  }

  const header = frame.content?.blocks?.find(
    (b) => b.type === 'header'
  ) as TextBlock

  if (!header?.data) {
    return frame.name as string
  }

  if (convert(header.data.html).length > 0) {
    return convert(header.data.html, options) as string
  }

  return frame.name as string
}

function createShortName(inputValue: string, maxWords = 6) {
  if (!inputValue) {
    return ''
  }

  // Define lists of verbs, prepositions, and interrogative words
  const verbs = [
    'am',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'shall',
    'will',
    'should',
    'would',
    'may',
    'might',
    'must',
    'can',
    'could',
    'ought',
    'need',
    'dare',
    'let',
  ]
  const prepositions = [
    'about',
    'above',
    'across',
    'after',
    'against',
    'along',
    'among',
    'around',
    'at',
    'before',
    'behind',
    'below',
    'beneath',
    'beside',
    'between',
    'beyond',
    'but',
    'by',
    'concerning',
    'despite',
    'down',
    'during',
    'except',
    'for',
    'from',
    'in',
    'inside',
    'into',
    'like',
    'near',
    'of',
    'off',
    'on',
    'onto',
    'out',
    'outside',
    'over',
    'past',
    'since',
    'through',
    'throughout',
    'till',
    'to',
    'toward',
    'under',
    'underneath',
    'until',
    'up',
    'upon',
    'with',
    'within',
    'without',
  ]
  const interrogatives = [
    'who',
    'whom',
    'whose',
    'which',
    'what',
    'when',
    'where',
    'why',
    'how',
  ]
  const subjects = [
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'my',
    'your',
    'his',
    'her',
    'its',
    'our',
    'their',
    'me',
    'him',
    'her',
    'us',
    'them',
    'myself',
    'yourself',
    'himself',
    'herself',
    'itself',
    'ourselves',
    'themselves',
    'this',
    'that',
    'these',
    'those',
    'some',
    'any',
    'many',
    'much',
    'few',
    'little',
    'a',
    'an',
    'the',
  ]

  const articles = ['a', 'an', 'the']
  // Normalize input: convert to lowercase and remove non-alphanumeric characters except spaces
  const normalizedInput = inputValue.toLowerCase().replace(/[^\w\s]/g, '')

  // Split into words
  const words = normalizedInput.split(/\s+/)

  if (words.length === 0) {
    return ''
  }

  // Filter out verbs, prepositions, and interrogatives
  const filteredWords = words.filter(
    (word) =>
      !verbs.includes(word) &&
      !prepositions.includes(word) &&
      !interrogatives.includes(word) &&
      !subjects.includes(word) &&
      !articles.includes(word)
  )

  // Limit the number of words in the short name
  const shortNameWords = filteredWords.slice(0, maxWords)

  // Join and capitalize the first letter of each word
  const shortName = shortNameWords
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return shortName
}
