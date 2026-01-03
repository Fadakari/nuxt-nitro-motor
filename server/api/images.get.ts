import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  const uploadDir = path.resolve(process.cwd(), 'public/uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const files = fs.readdirSync(uploadDir);
  
  const images = files.filter(file => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file));
  
  return images.map(file => `/uploads/${file}`);
});