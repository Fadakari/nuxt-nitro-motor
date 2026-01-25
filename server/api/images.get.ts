// server/api/images.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  // لیست کردن فایل‌های پوشه uploads از باکت images
  const { data, error } = await client
    .storage
    .from('images')
    .list('uploads', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) {
    return []
  }

  // تبدیل فرمت خروجی به آرایه‌ای از آدرس‌ها
  // نکته: ما آدرس کامل برنمی‌گردانیم، بلکه getPublicUrl در فرانت این کار را می‌کند
  const images = data
    .filter(file => file.name !== '.emptyFolderPlaceholder') // حذف فایل‌های سیستمی
    .map(file => `uploads/${file.name}`)

  return images
})