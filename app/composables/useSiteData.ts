import { ref, useState, onMounted, onUnmounted } from '#imports';

// تعریف تایپ‌ها برای داشتن Intellisense عالی در زمان کدنویسی
export interface SiteData {
  meta: { version: string; lastUpdated: number; adminPassword?: string };
  business: any;
  appearance: any;
  categories: any[];
}

export const useSiteData = () => {
  // استفاده از useState برای اشتراک‌گذاری دیتا بین صفحات بدون درخواست اضافی
  const siteData = useState<SiteData | null>('site-data-state', () => null);
  const isLoading = useState<boolean>('site-data-loading', () => false);
  const error = useState<string | null>('site-data-error', () => null);
  
  // نگهداری تایمر برای Polling
  const pollingInterval = useState<any>('polling-timer', () => null);

  // تابع اصلی دریافت اطلاعات
  const fetchSiteData = async (background = false) => {
    if (!background) isLoading.value = true;
    
    try {
      // اضافه کردن timestamp برای جلوگیری از کش شدن توسط مرورگر
      const timestamp = new Date().getTime();
      const response = await $fetch<SiteData>('/api/config', {
        query: { t: timestamp },
        // هدرهای مخصوص برای اینکه مطمئن شیم دیتا تازه است
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (response) {
        // چک کردن اینکه آیا واقعا تغییری ایجاد شده؟ (برای جلوگیری از رندرهای بیهوده)
        if (JSON.stringify(siteData.value) !== JSON.stringify(response)) {
          console.log('🔄 Data updated from server');
          siteData.value = response;
        }
      }
    } catch (err) {
      console.error('Error fetching site data:', err);
      error.value = 'خطا در برقراری ارتباط با سرور';
    } finally {
      if (!background) isLoading.value = false;
    }
  };

  // شروع سیستم آپدیت خودکار (Polling)
  const startRealtimeUpdates = (intervalMs = 10000) => {
    if (import.meta.server) return; // در سرور اجرا نشود

    // اگر قبلا تایمر بود، پاکش کن
    stopRealtimeUpdates();

    console.log('🚀 Realtime updates started...');
    // اولین درخواست را بلافاصله بفرست
    fetchSiteData(true);

    // تنظیم تایمر
    pollingInterval.value = setInterval(() => {
      fetchSiteData(true); // true یعنی لودینگ نشان نده (آپدیت مخفی)
    }, intervalMs);
  };

  const stopRealtimeUpdates = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  };

  // متد ذخیره‌سازی (برای پنل ادمین)
  const saveSiteData = async (newData: SiteData) => {
    isLoading.value = true;
    try {
      // آپدیت کردن timestamp قبل از ذخیره
      newData.meta.lastUpdated = Date.now();
      
      await $fetch('/api/config', {
        method: 'POST',
        body: newData
      });
      
      // آپدیت لوکال بلافاصله
      siteData.value = newData;
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    siteData,
    isLoading,
    error,
    fetchSiteData,
    saveSiteData,
    startRealtimeUpdates,
    stopRealtimeUpdates
  };
};