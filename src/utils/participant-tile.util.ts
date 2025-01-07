import { TOPBAR_PARTICIPANT_TILES_HEIGHT } from '@/components/event-session/MeetingScreen/Content'

export function calculateTileDimensions({
  containerWidth,
  containerHeight,
  aspectRatio,
  boxCount,
  maxRows = 9,
  boxWidthInTopbar = (TOPBAR_PARTICIPANT_TILES_HEIGHT * 16) / 9,
}: {
  containerWidth: number
  containerHeight: number
  aspectRatio: number
  boxMinWidth?: number
  boxCount: number
  maxRows?: number
  boxWidthInTopbar?: number
}): { boxWidth: number; boxHeight?: number; tilesInRowForTopbar?: number } {
  // Function to calculate the box dimensions
  let rows
  let cols
  let colBoxWidth = 0
  let colBoxHeight = 0
  let rowBoxWidth = 0
  let rowBoxHeight = 0
  let boxWidth = 0
  let tilesInRowForTopbar = 0

  if (maxRows === 1) {
    tilesInRowForTopbar = containerWidth / boxWidthInTopbar
  } else {
    // eslint-disable-next-line no-plusplus
    for (cols = 1; cols <= boxCount; cols++) {
      rows = Math.ceil(boxCount / cols)

      // Calculate the width and height of the box
      colBoxWidth = containerWidth / cols
      colBoxHeight = colBoxWidth / aspectRatio

      // Check if it fits within the container height
      if (colBoxHeight * rows <= containerHeight) {
        break
      }
    }

    // eslint-disable-next-line no-plusplus
    for (rows = 1; rows <= boxCount; rows++) {
      cols = Math.ceil(boxCount / rows)

      // Calculate the width and height of the box
      rowBoxHeight = containerHeight / rows
      rowBoxWidth = rowBoxHeight * aspectRatio

      // Check if it fits within the container height
      if (rowBoxWidth * cols <= containerWidth) {
        break
      }
    }

    while (
      colBoxWidth * rows > containerWidth ||
      rowBoxHeight * cols > containerHeight
    ) {
      if (colBoxWidth * rows > containerWidth) {
        colBoxWidth -= 1
        colBoxHeight = colBoxWidth / aspectRatio
      }

      if (rowBoxHeight * cols > containerHeight) {
        rowBoxHeight -= 1
        rowBoxWidth = rowBoxHeight * aspectRatio
      }
    }

    boxWidth = Math.max(colBoxWidth as number, rowBoxWidth as number)
  }

  return {
    boxWidth: Math.floor(boxWidth as number),
    // boxHeight: Math.floor(boxHeight as number),
    tilesInRowForTopbar: Math.floor(tilesInRowForTopbar),
  }
}
