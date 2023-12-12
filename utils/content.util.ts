import { ContentType } from "@/components/slides/ContentTypePicker"
import { v4 as uuidv4 } from "uuid"

export const getDefaultContent = (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.COVER:
      return {
        title: "Title",
        description: "Description",
      }
    case ContentType.IMAGE:
      return {
        url: "https://picsum.photos/200/300",
      }
    case ContentType.VIDEO:
      return {
        url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
      }
    case ContentType.POLL:
      return {
        question: "Question",
        options: ["Option 1", "Option 2", "Option 3"],
      }
    default:
      return {}
  }
}

export const getDefaultCoverSlide = ({
  name = "Slide 1",
  title = "Title",
  description = "Description",
}: {
  name?: string
  title?: string
  description?: string
}) => {
  return {
    id: uuidv4(),
    name,
    config: {
      backgroundColor: "#fff",
      textColor: "#000",
    },
    content: {
      title,
      description,
    },
    contentType: ContentType.COVER,
  }
}

export const checkVoted = (votes: any, user: any) => {
  if (!Array.isArray(votes)) return false
  if (!user) return false

  return votes.some((vote) => vote.profile_id === user.id)
}
