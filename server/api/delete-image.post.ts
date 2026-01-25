// server/api/delete-image.post.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const imagePath = body.imagePath // مثلا: uploads/filename.jpg

  if (!imagePath) {
    throw createError({ statusCode: 400, message: 'مسیر فایل الزامی است' })
  }

  const client = await serverSupabaseClient(event)

  // حذف فایل از باکت images
  const { error } = await client
    .storage
    .from('images')
    .remove([imagePath])

  if (error) {
    throw createError({ statusCode: 500, message: 'خطا در حذف فایل' })
  }

  return { success: true }
})