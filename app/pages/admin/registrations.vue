<template>
  <div class="min-h-screen bg-black pb-30 pt-30 px-4">
    
    <!-- <div class="container-center mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span class="i-heroicons-clipboard-document-list text-green-400"></span>
        درخواست‌های ثبت‌نام
      </h1>
      <NuxtLink to="/admin" class="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
        <span>داشبورد</span>
        <span class="i-heroicons-arrow-left"></span>
      </NuxtLink>
    </div> -->

    <div class="container-center">
      
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="glass-panel h-20 animate-pulse bg-white/5"></div>
      </div>

      <div v-else-if="items.length > 0" class="space-y-4">
        <div v-for="item in items" :key="item.id" class="glass-panel p-4 flex flex-col md:flex-row items-center justify-between border border-white/10 hover:border-green-500/30 transition-colors">
          
          <div class="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
            <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
              <span class="i-heroicons-user text-xl"></span>
            </div>
            <div>
              <h3 class="font-bold text-white text-lg">{{ item.full_name }}</h3>
              <div class="text-sm text-gray-400 flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <span class="i-heroicons-phone text-gold"></span>
                  <a :href="`tel:${item.phone}`" class="hover:text-white">{{ item.phone }}</a>
                </span>
                <span class="hidden sm:inline text-gray-600">|</span>
                <span class="flex items-center gap-1 text-primary">
                  <span class="i-heroicons-musical-note"></span>
                  {{ item.classes?.title || 'کلاس حذف شده' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
             <div class="text-xs text-gray-500 ml-2">
               {{ new Date(item.created_at).toLocaleDateString('fa-IR') }}
             </div>
             
             <a :href="`tel:${item.phone}`" class="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
               <span class="i-heroicons-phone-arrow-up-right"></span>
               تماس
             </a>
             
             <button @click="deleteItem(item.id)" class="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors border border-red-500/20">
               حذف
             </button>
          </div>

        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
        <span class="i-heroicons-inbox text-5xl mb-4 opacity-50 block mx-auto"></span>
        <p>هیچ درخواست ثبت‌نامی وجود ندارد.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const client = useSupabaseClient()
const items = ref([])
const loading = ref(true)

const fetchData = async () => {
  loading.value = true
  const { data } = await client
    .from('registrations')
    .select('*, classes(title)')
    .order('created_at', { ascending: false })
  
  items.value = data || []
  loading.value = false
}

const deleteItem = async (id: number) => {
  if (!confirm('آیا هماهنگی انجام شد و می‌خواهید این مورد را حذف کنید؟')) return
  await client.from('registrations').delete().eq('id', id)
  fetchData()
}

onMounted(() => fetchData())
</script>