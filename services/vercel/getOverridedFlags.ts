import axios from 'axios'

export const getVercelFlags = async () => {
  const res = await axios.get('/.well-known/vercel/overrides-flags')
  console.log('res', res)

  return res.data.flagsFromVercel
}
