import fs from 'node:fs';
import path from 'node:path';
import { readMultipartFormData } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event);
  if (!body) throw createError({ statusCode: 400, message: 'فایلی ارسال نشد' });

  const file = body.find(item => item.name === 'file');
  if (!file || !file.filename) throw createError({ statusCode: 400, message: 'فایل نامعتبر است' });

  const ext = path.extname(file.filename);
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
  const uploadDir = path.resolve(process.cwd(), 'public/uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);
  fs.writeFileSync(filePath, file.data);

  return { url: `/uploads/${uniqueName}` };
});