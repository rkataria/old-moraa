import { IconLoader } from "@tabler/icons-react"
import React from "react"

function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <IconLoader className="animate-spin" />
    </div>
  )
}

export default Loading
