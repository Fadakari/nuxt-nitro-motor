import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  try {
    // مسیر فایل جیسون در روت پروژه
    const filePath = path.resolve(process.cwd(), 'site-data.json');
    
    if (!fs.existsSync(filePath)) {
      return { error: 'Configuration file not found' };
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { error: 'Failed to read configuration' };
  }
});