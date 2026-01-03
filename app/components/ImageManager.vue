<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'close']);

const images = ref([]);
const isUploading = ref(false);
const loadedImages = ref(new Set()); 

const fetchImages = async () => {
  const data = await $fetch('/api/images');
  images.value = data;
};

const onImageLoad = (imgSrc) => {
  loadedImages.value.add(imgSrc);
};

const handleUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await $fetch('/api/upload', { method: 'POST', body: formData });
    await fetchImages(); 
    selectImage(data.url);
  } catch (error) {
    alert('خطا در آپلود');
  } finally {
    isUploading.value = false;
  }
};

const handleDelete = async (imagePath) => {
  if (!confirm('آیا این تصویر حذف شود؟')) return;
  try {
    await $fetch('/api/delete-image', {
      method: 'POST',
      body: { imagePath }
    });
    // حذف از کش
    loadedImages.value.delete(imagePath);
    // حذف از آرایه محلی برای آپدیت سریع‌تر UI
    images.value = images.value.filter(img => img !== imagePath);
  } catch (e) {
    alert('خطا در حذف');
  }
};

const selectImage = (url) => {
  emit('update:modelValue', url);
  emit('close');
};

onMounted(fetchImages);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        @click="$emit('close')"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100000]"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
      enter-from-class="translate-y-full opacity-0 sm:translate-y-10 sm:scale-95"
      enter-to-class="translate-y-0 opacity-100 sm:translate-y-0 sm:scale-100"
      leave-active-class="transition-all duration-300 cubic-bezier(0.32, 0.72, 0, 1)"
      leave-from-class="translate-y-0 opacity-100 sm:scale-100"
      leave-to-class="translate-y-full opacity-0 sm:scale-95"
    >
      <div 
        class="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[100001] pointer-events-none"
      >
        <div class="pointer-events-auto bg-white dark:bg-[#1E2025] w-full sm:w-full sm:max-w-3xl h-[85vh] sm:h-[80vh] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-white/10 sm:border-t-0 ring-1 ring-black/5">
          
          <div class="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#1E2025] z-20">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <span class="i-ph-images-square text-primary text-2xl"></span>
              گالری تصاویر
            </h3>
            <button 
              @click="$emit('close')" 
              class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <span class="i-ph-x text-xl"></span>
            </button>
          </div>

          <div class="flex-grow overflow-y-auto p-5 bg-slate-50 dark:bg-[#111315]">
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              
              <label class="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5 bg-white dark:bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden">
                <input type="file" accept="image/*" class="hidden" @change="handleUpload">
                <span v-if="isUploading" class="i-ph-spinner animate-spin text-3xl text-primary"></span>
                <template v-else>
                  <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span class="i-ph-plus text-xl text-slate-500 dark:text-slate-300 group-hover:text-primary"></span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 group-hover:text-primary transition-colors">آپلود جدید</span>
                </template>
              </label>

              <div 
                v-for="img in images" 
                :key="img"
                class="relative group aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 bg-gray-100 dark:bg-gray-800"
                :class="modelValue === img 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-transparent hover:shadow-lg'"
                @click="selectImage(img)"
              >
                <div v-if="!loadedImages.has(img)" class="absolute inset-0 z-10 animate-pulse bg-gray-200 dark:bg-gray-700"></div>

                <img 
                  :src="img" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy"
                  @load="onImageLoad(img)"
                >
                
                <div v-if="modelValue === img" class="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px] z-20">
                  <div class="bg-primary text-white rounded-full p-1.5 shadow-lg transform scale-110 animate-[bounce_0.3s]">
                    <span class="i-ph-check text-xl font-bold"></span>
                  </div>
                </div>

                <button 
                  @click.stop="handleDelete(img)"
                  class="absolute top-1 right-1 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-black/60 text-red-500 rounded-full shadow-sm backdrop-blur-sm z-30 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  title="حذف تصویر"
                >
                  <span class="i-ph-trash text-sm"></span>
                </button>
              </div>

            </div>
          </div>

          <div class="p-4 bg-white dark:bg-[#1E2025] border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-400 font-medium">
            {{ images.length }} تصویر در گالری
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>