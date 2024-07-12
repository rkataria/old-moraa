import axios from 'axios'

const getFlags = async () => {
  try {
    const response = await axios.get('/.well-known/vercel/overrides-flags')
    console.log('Response:', response)

    return response.data.flagsFromVercel
  } catch (error) {
    console.error('Error fetching flags:', error)

    return {}
  }
}
export const VercelService = {
  getFlags,
}
