const tiptapAuthUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tiptap-auth`

const fetchAiToken = async () => {
  const data = await (
    await fetch(tiptapAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ type: 'AI' }),
    })
  ).json()

  const { token } = data
  localStorage.setItem('tiptap-ai-token', token)

  return token
}

const fetchCollabToken = async () => {
  const data = await (
    await fetch(tiptapAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ type: 'COLLAB' }),
    })
  ).json()

  const { token } = data
  localStorage.setItem('tiptap-collab-token', token)

  return token
}

const fetchTokens = async () => ({
  aiToken: await fetchAiToken(),
  collabToken: await fetchCollabToken(),
})

export { fetchTokens }
