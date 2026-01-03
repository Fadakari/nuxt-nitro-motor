import { defineConfig, presetUno, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Vazirmatn:400,700,900',
      },
    }),
  ],
  theme: {
    colors: {
      bg: '#000000',
      glass: 'rgba(20, 20, 20, 0.6)',
      glassBorder: 'rgba(255, 255, 255, 0.1)',
      primary: {
        DEFAULT: '#D90429', 
        hover: '#EF233C',
        text: '#ffffff',
      },
      gold: {
        DEFAULT: '#CCA43B',
        light: '#E5C15D',
        dim: '#856A20',
      },
      text: {
        main: '#EEEEEE',
        muted: '#9CA3AF',
      }
    }
  },
  shortcuts: {
    'glass-panel': 'bg-glass backdrop-blur-md border border-glassBorder rounded-2xl shadow-2xl',
    'container-center': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'btn-primary': 'bg-primary text-white px-6 py-2 rounded-xl transition-all hover:bg-primary-hover hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(217,4,41,0.4)]',
    'btn-gold': 'bg-transparent border border-gold text-gold px-6 py-2 rounded-xl transition-all hover:bg-gold hover:text-black hover:scale-105',
    'heading-gold': 'text-gold font-bold tracking-wide',
  }
})