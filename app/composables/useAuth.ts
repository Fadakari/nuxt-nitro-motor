export const useAuth = () => {
  // تغییر ۱: تنظیمات کوکی را اینجا اضافه کنید
  const authCookie = useCookie('is-logged-in', {
    maxAge: 60 * 60 * 24, // یک روز
    path: '/' // در دسترس در کل سایت
  });
  
  const isAuthenticated = useState('auth-status', () => authCookie.value === 'true');
  const { siteData, fetchSiteData } = useSiteData();

  const checkAuth = () => {
    isAuthenticated.value = authCookie.value === 'true';
  };

  const login = async (password: string) => {
    console.log("در حال بررسی رمز...");
    
    if (!siteData.value) await fetchSiteData();
    const correctPassword = (siteData.value as any)?.settings?.adminPassword || 'admin123';

    if (password === correctPassword) {
      console.log("رمز صحیح است. در حال تنظیم کوکی...");
      
      // تغییر ۲: حذف کدهای دستی document.cookie (چون useCookie با تنظیمات بالا خودش انجام می‌دهد)09192022887    تقی زاده
      authCookie.value = 'true';
      isAuthenticated.value = true;
      return true;
    }
    
    console.log("رمز اشتباه است");
    return false;
  };

  const logout = () => {
    isAuthenticated.value = false;
    authCookie.value = null;
    if (process.client) {
      document.cookie = "is-logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/admin/login';
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
};