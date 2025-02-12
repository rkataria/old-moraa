const fetchEmbed = async ({ url }: { url: string }) => {
  try {
    const response = await fetch(
      `https://iframe.ly/api/iframely?url=${encodeURIComponent(url)}&api_key=${import.meta.env.VITE_IFRAMELY_API_KEY}`
    )

    const data = await response.json()

    if (data.error) {
      return {
        isError: true,
        message: data.error,
      }
    }

    return data
  } catch (error) {
    console.error(error)

    return {
      isError: true,
      message: 'An error occurred while fetching embed data.',
    }
  }
}

export const IFramelyService = {
  fetchEmbed,
}
