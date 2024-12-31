export function isValidYouTubeVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)

    // Check if the hostname is a valid YouTube domain
    const validHostnames = [
      'www.youtube.com',
      'youtube.com',
      'm.youtube.com',
      'youtu.be',
    ]
    if (!validHostnames.includes(urlObj.hostname)) {
      return false
    }

    // Check for "v" parameter in full YouTube URLs or a valid ID in youtu.be short URLs
    if (urlObj.hostname === 'youtu.be') {
      return /^[a-zA-Z0-9_-]{11}$/.test(urlObj.pathname.slice(1))
    }

    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v')

      return /^[a-zA-Z0-9_-]{11}$/.test(videoId as string)
    }

    return false
  } catch (error) {
    // If URL parsing fails, it's not a valid URL
    return false
  }
}

export function isValidVimeoVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)

    // Define valid hostnames for Vimeo
    const validHostnames = ['www.vimeo.com', 'vimeo.com']

    // Check if the hostname is valid for Vimeo
    if (!validHostnames.includes(urlObj.hostname)) {
      return false
    }

    // Validate Vimeo video URL
    if (validHostnames.includes(urlObj.hostname)) {
      // Vimeo video IDs are numeric
      return /^\d+$/.test(urlObj.pathname.slice(1))
    }

    return false
  } catch (error) {
    // If URL parsing fails, it's not a valid URL
    return false
  }
}
