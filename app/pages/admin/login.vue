<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'none',
  // میدل‌ور را اینجا هم صدا می‌زنیم که اگر لاگین بود نگذارد این صفحه را ببیند
  middleware: 'auth' 
});

const password = ref('');
const error = ref('');
const isLoading = ref(false);
const { login } = useAuth();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const success = await login(password.value);
    
    if (success) {
        await navigateTo('/admin');
    } else {
      error.value = 'رمز عبور اشتباه است!';
      if (process.client) {
        const gsap = await import('gsap').then(m => m.gsap);
        gsap.from('.error-msg', { x: -10, duration: 0.1, yoyo: true, repeat: 5 });
      }
    }
  } catch (e) {
    console.error("خطا:", e);
    error.value = 'خطایی رخ داد.';
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700">
      
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-red-500/30">🔐</div>
        <h1 class="text-2xl font-black text-slate-800 dark:text-white">ورود به پنل مدیریت</h1>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رمز عبور</label>
          <input 
            v-model="password"
            type="password" 
            class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-red-500 outline-none text-center tracking-widest text-lg"
            placeholder="••••••••"
            autofocus
          />
        </div>

        <p v-if="error" class="error-msg text-red-500 text-sm font-bold text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{{ error }}</p>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 bg-slate-900 hover:bg-red-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg flex justify-center items-center gap-2"
        >
          <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ isLoading ? 'در حال بررسی...' : 'ورود به پنل' }}</span>
        </button>
      </form>
      
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="text-sm text-slate-400 hover:text-slate-600 transition-colors">← بازگشت به سایت</NuxtLink>
      </div>
    </div>
  </div>
</template>