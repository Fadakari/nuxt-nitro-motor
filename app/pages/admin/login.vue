<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-black relative overflow-hidden">
    
    <div class="absolute inset-0 z-0 opacity-20">
      <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/40 blur-[100px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/30 blur-[100px] rounded-full animate-pulse delay-1000"></div>
    </div>

    <div class="glass-panel w-full max-w-md p-8 relative z-10 border border-white/10 shadow-2xl">
      
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto bg-gradient-to-tr from-primary to-black rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/10">
          <span class="i-heroicons-musical-note text-3xl text-white"></span>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">مدیریت آکادمی</h1>
        <p class="text-gray-400 text-sm">لطفاً برای ورود به پنل، احراز هویت کنید.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div class="space-y-2">
          <label class="text-xs font-bold text-gold uppercase tracking-wider">پست الکترونیک</label>
          <div class="relative">
            <input 
              v-model="email"
              type="email" 
              placeholder="admin@ozanacademy.ir"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-primary focus:bg-white/10 outline-none transition-all text-left dir-ltr"
              required
            />
            <span class="i-heroicons-envelope absolute right-4 top-3.5 text-gray-500"></span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-gold uppercase tracking-wider">رمز عبور</label>
          <div class="relative">
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-primary focus:bg-white/10 outline-none transition-all text-left dir-ltr"
              required
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
            >
              <span :class="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"></span>
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl flex items-center gap-2 animate-shake">
          <span class="i-heroicons-exclamation-circle text-lg"></span>
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="i-heroicons-arrow-path animate-spin text-xl"></span>
          <span>{{ loading ? 'در حال بررسی...' : 'ورود به پنل' }}</span>
        </button>

      </form>
      
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-white transition-colors">
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    // موفقیت: هدایت به داشبورد
    router.push('/admin')
    
  } catch (error: any) {
    errorMsg.value = 'ایمیل یا رمز عبور اشتباه است.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// اگر کاربر قبلاً لاگین بود، مستقیم برود تو
onMounted(async () => {
  const { data } = await client.auth.getSession()
  if (data.session) {
    router.push('/admin')
  }
})
</script>

<style scoped>
/* انیمیشن لرزش برای خطا */
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>