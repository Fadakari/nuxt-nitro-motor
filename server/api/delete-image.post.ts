import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imagePath } = body;

  if (!imagePath) {
    throw createError({ statusCode: 400, message: 'مسیر فایل الزامی است' });
  }

  if (!imagePath.includes('/uploads/')) {
    throw createError({ statusCode: 403, message: 'حذف فایل‌های سیستمی مجاز نیست' });
  }

  const filePath = path.join(process.cwd(), 'public', imagePath);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true, message: 'فایل حذف شد' };
    } else {
      return { success: false, message: 'فایل پیدا نشد' };
    }
  } catch (error) {
    throw createError({ statusCode: 500, message: 'خطا در حذف فایل' });
  }
});