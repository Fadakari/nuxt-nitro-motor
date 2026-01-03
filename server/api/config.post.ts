import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const filePath = path.resolve(process.cwd(), 'site-data.json');

    // ذخیره کردن تغییرات روی فایل اصلی
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');

    return { success: true, message: 'Settings updated successfully' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save settings',
    });
  }
});