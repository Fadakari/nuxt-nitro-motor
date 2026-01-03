export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient()
  const { data: { session } } = await client.auth.getSession()

  if (!session && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})