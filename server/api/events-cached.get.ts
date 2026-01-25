import { serverSupabaseClient } from '#supabase/server'

export default defineCachedEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data } = await client
    .from('events')
    .select('id, title, description, image_url, created_at')
    .eq('is_important', true)
    .order('created_at', { ascending: false })
    .limit(2)

  return data
}, {
  maxAge: 10,
  swr: true,
})