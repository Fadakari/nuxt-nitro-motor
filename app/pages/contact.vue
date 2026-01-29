<template>
  <div class="relative min-h-screen bg-[#020202] text-white overflow-hidden flex flex-col justify-center py-28">

    <!-- Ambient Lights -->
    <div class="absolute -top-1/3 -left-1/4 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[180px] opacity-30 pointer-events-none"></div>
    <div class="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] bg-gold/10 rounded-full blur-[180px] opacity-30 pointer-events-none"></div>

    <!-- Noise Grid -->
    <div class="absolute inset-0 opacity-[0.025]"
         style="background-image:
         linear-gradient(#333 1px, transparent 1px),
         linear-gradient(90deg, #333 1px, transparent 1px);
         background-size: 48px 48px;">
    </div>

    <div class="relative z-10 container-center max-w-6xl">

      <!-- Header -->
      <div class="text-center mb-20 space-y-6">
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full rounded-full bg-gold opacity-70 animate-ping"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-gold"></span>
          </span>
          <span class="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-300">
            ارتباط با آکادمی
          </span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          صدای شما،
          <span
            class="block text-transparent bg-clip-text
                   bg-gradient-to-r from-white via-gold to-white
                   bg-[length:200%_auto] animate-shine">
            شروع یک مسیر است
          </span>
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed font-light">
          برای مشاوره، ثبت‌نام یا هر پرسشی، مسیرهای ارتباطی ما همیشه روشن است.
        </p>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6 h-96">
        <div v-for="i in 3" :key="i" class="rounded-[2rem] bg-white/5 animate-pulse"></div>
      </div>

      <!-- Content -->
      <div v-else-if="info"
           class="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

        <!-- Phones -->
        <div class="md:col-span-8 relative group rounded-[2.5rem] p-10 overflow-hidden
                    bg-gradient-to-br from-[#151515] via-[#0d0d0d] to-black
                    border border-white/10 hover:border-gold/30 transition-all duration-500">

          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none">
            <div class="absolute -top-32 -right-32 w-80 h-80 bg-gold/10 blur-3xl rounded-full"></div>
            <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 blur-3xl rounded-full"></div>
          </div>

          <div class="absolute right-0 top-0 p-12 opacity-[0.06] group-hover:opacity-[0.15] transition-all duration-700 pointer-events-none">
            <span class="i-heroicons-phone text-[11rem]"></span>
          </div>

          <div class="relative z-10 space-y-8">
            <div class="flex items-center gap-3 text-gold">
              <span class="i-heroicons-phone-arrow-up-right text-xl"></span>
              <span class="text-sm font-bold tracking-widest uppercase">
                خطوط مستقیم
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                v-for="phone in info.phones"
                :key="phone"
                :href="`tel:${phone}`"
                class="group/phone relative flex items-center justify-between
                       rounded-2xl p-5 bg-white/[0.04]
                       border border-white/5 hover:border-gold/40
                       hover:bg-white/[0.08]
                       transition-all">

                <span class="absolute inset-0 rounded-2xl opacity-0 group-hover/phone:opacity-100
                             bg-gradient-to-r from-transparent via-white/10 to-transparent transition"></span>

                <span class="relative text-2xl font-mono dir-ltr">
                  {{ phone }}
                </span>

                <span class="relative w-10 h-10 rounded-full bg-gold/20 text-gold
                             flex items-center justify-center
                             group-hover/phone:scale-110 transition">
                  <span class="i-heroicons-arrow-up-left"></span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- Work Hours -->
        <div class="md:col-span-4 relative group rounded-[2.5rem] p-8
                    bg-[#0a0a0a] border border-white/10
                    hover:border-white/20 transition overflow-hidden">
          <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-green-500/10 blur-3xl rounded-full"></div>

          <div class="space-y-6 relative z-10">
            <span class="i-heroicons-clock text-4xl text-gray-500 group-hover:text-white transition"></span>
            <div>
              <h3 class="text-xl font-bold">ساعات کاری</h3>
              <p class="text-sm text-gray-400">زمان پاسخگویی آموزشگاه</p>
            </div>
            <div>
              <p class="text-lg">{{ info.work_hours }}</p>
              <p v-if="info.closed_days" class="mt-2 text-xs text-red-400 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                {{ info.closed_days }} تعطیل
              </p>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="md:col-span-7 relative group rounded-[2.5rem] p-8
                    bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition overflow-hidden">
          <div class="absolute inset-0 opacity-5 bg-cover bg-center grayscale
                      bg-[url('/images/map-pattern.png')]"></div>

          <div class="relative z-10 flex gap-6">
            <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10
                        flex items-center justify-center text-gold
                        group-hover:scale-110 transition">
              <span class="i-heroicons-map-pin text-3xl"></span>
            </div>
            <div>
              <h3 class="text-lg font-bold mb-2 group-hover:text-gold transition">
                ملاقات حضوری
              </h3>
              <p class="text-gray-300 leading-8 max-w-md">
                {{ info.address }}
              </p>
            </div>
          </div>
        </div>

        <!-- Social -->
        <div class="md:col-span-5 relative group rounded-[2.5rem] p-8
                    bg-gold text-black hover:bg-[#E5C15D]
                    transition overflow-hidden cursor-pointer">

          <div class="absolute -right-8 -top-8 w-40 h-40 bg-white/30 blur-3xl rounded-full"></div>

          <div class="relative z-10 space-y-6">
            <div>
              <h3 class="text-2xl font-black">همراه شویم</h3>
              <p class="text-sm text-black/70 font-medium">
                شبکه‌های اجتماعی آکادمی
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                v-for="(soc, idx) in info.socials"
                :key="idx"
                :href="soc.link"
                target="_blank"
                class="w-11 h-11 rounded-full bg-black/10
                       hover:bg-black hover:text-gold
                       flex items-center justify-center transition">
                <span :class="getSocialIcon(soc.platform)" class="text-xl"></span>
              </a>
            </div>

            <div v-if="info.email" class="pt-6 border-t border-black/10">
              <p class="text-xs tracking-widest font-bold uppercase opacity-60 mb-1">
                ایمیل رسمی
              </p>
              <a :href="`mailto:${info.email}`"
                 class="block font-mono text-lg hover:text-white dir-ltr transition">
                {{ info.email }}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()

const { data: info, pending } = await useAsyncData('site_info', async () => {
  const { data } = await client.from('site_info').select('*').single()
  return data
})

const getSocialIcon = (platform: string) => {
  const map: any = {
    instagram: 'i-simple-icons-instagram',
    telegram: 'i-simple-icons-telegram',
    whatsapp: 'i-simple-icons-whatsapp',
    youtube: 'i-simple-icons-youtube',
    twitter: 'i-simple-icons-twitter',
  }
  return map[platform] || 'i-heroicons-link'
}
</script>

<style scoped>
.animate-shine {
  animation: shine 8s linear infinite;
}
@keyframes shine {
  from { background-position: 0% center; }
  to { background-position: 200% center; }
}

.animate-pulse-slow {
  animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>