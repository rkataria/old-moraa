import { ContentType } from "@/components/slides/ContentTypePicker"

export const getDefaultContent = (contentType: ContentType) => {
  switch (contentType) {
    case ContentType.BASIC:
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
