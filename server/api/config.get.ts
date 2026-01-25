import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  try {
    // دانلود فایل تنظیمات از باکت
    const { data, error } = await client
      .storage
      .from('images') // یا یک باکت جداگانه مثل 'configs' بسازید
      .download('site-data.json')

    if (error) {
      // اگر فایل نبود، یک تنظیمات پیش‌فرض برگردان
      return {
        meta: { version: '1.0.0', lastUpdated: Date.now() },
        business: {},
        appearance: {},
        categories: []
      }
    }

    // خواندن محتوای متنی فایل
    const text = await data.text()
    return JSON.parse(text)
    
  } catch (error) {
    return { error: 'Failed to read configuration' }
  }
})