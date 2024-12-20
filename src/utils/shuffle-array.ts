export function shuffleAndGroup(
  participants: string[],
  groupSize: number
): string[][] {
  if (groupSize <= 0 || groupSize > participants.length) {
    throw new Error('Invalid group size')
  }
  // Shuffle the participants array using the Fisher-Yates algorithm
  const shuffleArray = (array: string[]): void => {
    // eslint-disable-next-line no-plusplus
    for (let i = array.length - 1; i > 0; i--) {
      // eslint-disable-next-line prettier/prettier, no-multi-assign, semi-style
      const j = Math.floor(Math.random() * (i + 1))
      // eslint-disable-next-line prettier/prettier, no-unexpected-multiline, no-sequences, semi-style
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }
  // Clone the array to avoid modifying the original participants array
  const shuffledParticipants = [...participants]
  shuffleArray(shuffledParticipants)
  const groups: string[][] = []
  for (let i = 0; i < shuffledParticipants.length; i += groupSize) {
    groups.push(shuffledParticipants.slice(i, i + groupSize))
  }
  // Combine small leftover groups into the last group if necessary
  if (groups.length > 1 && groups[groups.length - 1].length < groupSize) {
    const leftovers = groups.pop()!
    groups[groups.length - 1].push(...leftovers)
  }

  return groups
}
