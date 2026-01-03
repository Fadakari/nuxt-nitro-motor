<template>
  <div class="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
    <div class="container-center relative z-10">
      
      <div class="text-center mb-12 space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white">
          <span class="text-gold">راه‌های</span> ارتباطی
        </h1>
        <p class="text-gray-400 max-w-xl mx-auto">
          برای مشاوره، ثبت‌نام در کلاس‌ها یا طرح هرگونه سوال، با ما در تماس باشید.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        <div class="glass-panel p-8 space-y-8 h-full">
          <h3 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">اطلاعات تماس</h3>
          
          <div class="flex items-start gap-4 group cursor-pointer">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <span class="i-heroicons-phone text-2xl"></span>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">شماره تماس</p>
              <a href="tel:+989122719204" class="text-xl font-bold text-gold dir-ltr block text-right hover:text-white transition-colors">
                0912 271 9204
              </a>
            </div>
          </div>

          <div class="flex items-start gap-4">
             <div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <span class="i-heroicons-map-pin text-2xl"></span>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">آدرس آموزشگاه</p>
              <p class="text-white leading-relaxed">
                تهران، خیابان هنر، پلاک ۱۰، ساختمان موسیقی اوزان
              </p>
            </div>
          </div>

           <div class="flex items-start gap-4 group">
             <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span class="i-heroicons-envelope text-2xl text-white"></span>
            </div>
            <div>
              <p class="text-gray-400 text-sm mb-1">پست الکترونیک</p>
              <a href="mailto:info@ozanacademy.ir" class="text-white hover:text-gold transition-colors">info@ozanacademy.ir</a>
            </div>
          </div>

        </div>

        <div class="glass-panel p-8 flex flex-col justify-center h-full relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-primary"></div>
          
          <h3 class="text-2xl font-bold text-white mb-6">ساعات پاسخگویی</h3>
          
          <ul class="space-y-4">
            <li class="flex justify-between items-center text-gray-300 border-b border-white/5 pb-3">
              <span>شنبه تا چهارشنبه</span>
              <span class="text-gold font-bold">۱۰:۰۰ تا ۲۰:۰۰</span>
            </li>
            <li class="flex justify-between items-center text-gray-300 border-b border-white/5 pb-3">
              <span>پنج‌شنبه‌ها</span>
              <span class="text-gold font-bold">۱۰:۰۰ تا ۱۴:۰۰</span>
            </li>
            <li class="flex justify-between items-center text-gray-500">
              <span>جمعه‌ها و تعطیلات</span>
              <span class="text-red-400 text-sm">تعطیل</span>
            </li>
          </ul>

          <div class="mt-8 pt-6 border-t border-white/10 text-center">
            <p class="text-gray-400 text-sm mb-4">شبکه‌های اجتماعی ما</p>
            <div class="flex justify-center gap-4">
              <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all">
                <span class="i-simple-icons-instagram text-xl"></span>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2AABEE] hover:text-white transition-all">
                <span class="i-simple-icons-telegram text-xl"></span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>