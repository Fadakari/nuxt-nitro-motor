// server/api/upload.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // دریافت فایل از فرم
  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, message: 'فایلی ارسال نشد' })
  }

  const file = files.find(f => f.name === 'file')
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, message: 'فایل نامعتبر است' })
  }

  const client = await serverSupabaseClient(event)
  
  // ساخت نام یکتا برای فایل
  const ext = file.filename.split('.').pop()
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`
  const filePath = `uploads/${fileName}` // ذخیره در پوشه uploads داخل باکت

  // آپلود به باکت images در سوپابیس
  const { data, error } = await client
    .storage
    .from('images') // مطمئن شو نام باکت در پنل سوپابیس images باشد
    .upload(filePath, file.data, {
      contentType: file.type,
      upsert: false
    })

  if (error) {
    console.error('Upload Error:', error)
    throw createError({ statusCode: 500, message: 'خطا در آپلود به سوپابیس' })
  }

  // برگرداندن مسیر فایل (فقط مسیر نسبی)
  // در فرانت‌اند این مسیر به getPublicUrl داده میشه
  return { url: filePath }
})