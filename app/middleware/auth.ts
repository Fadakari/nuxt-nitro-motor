export default defineNuxtRouteMiddleware((to, from) => {
  const authCookie = useCookie('is-logged-in');

  console.log('Auth Middleware Check:', {
    value: authCookie.value,
    type: typeof authCookie.value
  });

  const isLoggedIn = String(authCookie.value) === 'true';

  if (!isLoggedIn && to.path !== '/admin/login') {
    return navigateTo('/admin/login');
  }
  
  if (isLoggedIn && to.path === '/admin/login') {
    return navigateTo('/admin');
  }
});