import React from "react"
import Loading from "../common/Loading"

export default function SlideLoading() {
  return (
    <div className="absolute h-full w-full flex justify-center items-center">
      <Loading />
    </div>
  )
}
