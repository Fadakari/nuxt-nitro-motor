export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  
  image: {
    quality: 80,
    format: ['webp'],
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    '@nuxt/image',
    '@nuxtjs/supabase'
  ],
  supabase: {
    redirect: false
  },

  site: {
    url: 'https://behzadheydari.ir',
    name: 'آکادمی اوزان',
    description: 'منوی اساتید، کلاس‌ها و رویدادها و اخبار آکادمی اوزان',
    defaultLocale: 'fa', 
    indexable: true,
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'آکادمی اوزان',
      image: '/me.jpg',
      url: 'https://behzadheydari.ir'
    }
  },

  content: {
    
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'منوی دیجیتال',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap' }
      ]
    }
  },
})