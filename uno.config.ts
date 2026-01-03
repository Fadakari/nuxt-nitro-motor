// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetTypography, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/' // استفاده از CDN برای اطمینان از لود شدن
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  // لیست آیکون‌هایی که ممکن است در دیتابیس باشند تا UnoCSS حتما آنها را بسازد
  safelist: [
    'i-ph-pizza', 'i-ph-hamburger', 'i-ph-coffee', 'i-ph-cake', 
    'i-ph-ice-cream', 'i-ph-beer-bottle', 'i-ph-bowl-food', 
    'i-ph-fire', 'i-ph-leaf', 'i-ph-check', 'i-ph-x', 'i-ph-plus', 
    'i-ph-trash', 'i-ph-pencil', 'i-ph-image', 'i-ph-upload',
    'i-ph-caret-down', 'i-ph-caret-up'
  ],
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
    }
  }
})