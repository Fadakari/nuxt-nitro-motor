import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = await serverSupabaseClient(event)

  try {
    // تبدیل آبجکت به رشته جیسون
    const jsonString = JSON.stringify(body, null, 2)

    // آپلود (بازنویسی) فایل تنظیمات در باکت
    const { error } = await client
      .storage
      .from('images') // همان باکتی که در get استفاده کردید
      .upload('site-data.json', jsonString, {
        contentType: 'application/json',
        upsert: true // این گزینه مهم است: فایل قبلی را جایگزین می‌کند
      })

    if (error) throw error

    return { success: true, message: 'Settings updated successfully' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save settings',
    })
  }
})