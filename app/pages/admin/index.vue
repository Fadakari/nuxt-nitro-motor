<script setup>
import { gsap } from 'gsap';
definePageMeta({
  middleware: 'auth'
});

const { siteData, saveSiteData, isLoading } = useSiteData();
const { isDark, toggleTheme } = useTheme();
const activeTab = ref('menu');
const expandedCategories = ref([]);
const isEditorOpen = ref(false);
const editorTriggerRect = ref(null);
const editingItem = ref(null);
const activeCategoryIndex = ref(null);


const openProductEditor = (catIndex, event) => {
  activeCategoryIndex.value = catIndex;
  
  // آیتم خالی جدید
  editingItem.value = {
    id: `item_${Date.now()}`,
    title: '',
    price: 0,
    image: '',
    isAvailable: true,
    labels: []
  };

  // گرفتن مختصات دکمه
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  editorTriggerRect.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };

  isEditorOpen.value = true;
};

const closeEditor = () => {
  isEditorOpen.value = false;
  setTimeout(() => {
    editingItem.value = null;
    editorTriggerRect.value = null;
  }, 500);
};

const saveNewItem = () => {
  if (editingItem.value.title) {
    siteData.value.categories[activeCategoryIndex.value].items.push(editingItem.value);
    alert('غذا اضافه شد!');
    closeEditor();
  } else {
    alert('لطفا نام غذا را بنویسید');
  }
};

// هوک‌های انیمیشن
const onEditorEnter = (el, done) => {
  if (editorTriggerRect.value) {
    // 1. وضعیت اولیه: دقیقاً روی دکمه کلیک شده
    gsap.set(el, {
      position: 'fixed',
      top: editorTriggerRect.value.top,
      left: editorTriggerRect.value.left,
      width: editorTriggerRect.value.width,
      height: editorTriggerRect.value.height,
      opacity: 1,
      borderRadius: '16px', // گردی دکمه اولیه
      zIndex: 9999, // زد ایندکس خیلی بالا
      margin: 0,    // حیاتی برای رفع پرش
      padding: 0,
      overflow: 'hidden',
      transform: 'none' // جلوگیری از تداخل ترنسفورم‌ها
    });

    // 2. انیمیشن به سمت تمام صفحه
    gsap.to(el, {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '0px', // گوشه‌ها تیز می‌شوند
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: done
    });
    
    // انیمیشن محتوا
    gsap.fromTo(el.querySelector('.editor-content-wrapper'), 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.3, delay: 0.2 }
    );
  } else {
    done();
  }
};

const onEditorLeave = (el, done) => {
  if (editorTriggerRect.value) {
    // محتوا سریع محو شود
    gsap.to(el.querySelector('.editor-content-wrapper'), { opacity: 0, duration: 0.2 });

    // قاب به جای اولش برگردد
    gsap.to(el, {
      top: editorTriggerRect.value.top,
      left: editorTriggerRect.value.left,
      width: editorTriggerRect.value.width,
      height: editorTriggerRect.value.height,
      borderRadius: '16px',
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
         gsap.to(el, { opacity: 0, duration: 0.1, onComplete: done });
      }
    });
  } else {
    done();
  }
};
// --- مدیریت منو ---
const createCategory = () => {
  siteData.value.categories.push({
    id: `cat_${Date.now()}`,
    title: 'دسته جدید',
    icon: 'i-ph-fork-knife',
    isActive: true,
    items: []
  });
};

const deleteCategory = (index) => {
  if(confirm('آیا مطمئن هستید؟ تمام غذاهای این دسته حذف می‌شوند.')) {
    siteData.value.categories.splice(index, 1);
  }
};

const createItem = (categoryIndex) => {
  siteData.value.categories[categoryIndex].items.push({
    id: `item_${Date.now()}`,
    title: 'غذای جدید',
    description: '',
    price: 0,
    image: '',
    isAvailable: true,
    labels: []
  });
  // باز کردن دسته برای دیدن آیتم جدید
  if (!expandedCategories.value.includes(categoryIndex)) {
    expandedCategories.value.push(categoryIndex);
  }
};


const deleteItem = (catIndex, itemIndex) => {
  if(confirm('حذف شود؟')) {
    siteData.value.categories[catIndex].items.splice(itemIndex, 1);
  }
};

const toggleCategory = (index) => {
  const i = expandedCategories.value.indexOf(index);
  if (i === -1) expandedCategories.value.push(index);
  else expandedCategories.value.splice(i, 1);
};

// --- ذخیره سازی ---
const handleSave = async () => {
  try {
    await saveSiteData(siteData.value);
    alert('تغییرات با موفقیت ذخیره شد! 🎉');
  } catch (e) {
    alert('خطا در ذخیره سازی');
  }
};

const availableIcons = [
  'i-ph-pizza', 'i-ph-hamburger', 'i-ph-coffee', 'i-ph-cake', 
  'i-ph-ice-cream', 'i-ph-beer-bottle', 'i-ph-bowl-food', 'i-ph-fire'
];

const createLabel = () => {
  if (!siteData.value.labels) siteData.value.labels = [];
  siteData.value.labels.push({ text: 'برچسب جدید', color: 'gray', emoji: '🏷️' });
};

const deleteLabel = (index) => {
  siteData.value.labels.splice(index, 1);
};

const popularEmojis = ['🔥', '🌱', '🥩', '🍗', '🍄', '🧀', '🌶️', '🌽', '🍟', '🍰', '🍦', '☕', '🍷', '⭐', '❤️', 'new', 'chef'];

const labelColors = [
  { name: 'قرمز', class: 'red', hex: '#ef4444' },
  { name: 'سبز', class: 'green', hex: '#22c55e' },
  { name: 'آبی', class: 'blue', hex: '#3b82f6' },
  { name: 'نارنجی', class: 'orange', hex: '#f97316' },
  { name: 'بنفش', class: 'purple', hex: '#a855f7' },
  { name: 'خاکستری', class: 'gray', hex: '#64748b' },
];


watchEffect(() => {
  if (siteData.value) {
    if (!siteData.value.labels) {
      siteData.value.labels = [
        { text: 'تند 🔥', color: 'red' },
        { text: 'گیاهی 🌱', color: 'green' },
        { text: 'همراه با دسر 🍰', color: 'purple' }
      ];
    }
    if (!siteData.value.business.wifi) siteData.value.business.wifi = { ssid: '', password: '' };
    if (!siteData.value.business.socials) siteData.value.business.socials = { instagram: '', phone: '', whatsapp: '' };
    if (!siteData.value.business.fees) siteData.value.business.fees = { tax: 0, service: 0 };
    
    if (!siteData.value.appearance.announcement) siteData.value.appearance.announcement = { active: false, text: '', color: '#ef4444' };
    if (!siteData.value.appearance.radius) siteData.value.appearance.radius = 'rounded-3xl';
    if (typeof siteData.value.business.isOpen === 'undefined') siteData.value.business.isOpen = true;
    if (!siteData.value.business.waitTime) siteData.value.business.waitTime = '30 دقیقه';
  }
});

const radiusOptions = [
  { label: 'گرد', value: 'rounded-3xl' },
  { label: 'متوسط', value: 'rounded-xl' },
  { label: 'تیز', value: 'rounded-md' }
];


</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#111315] pb-24 font-sans">
    
    <header class="hidden md:flex bg-white dark:bg-[#1E2025] border-b border-slate-200 dark:border-white/5 sticky top-0 z-30 px-6 py-4 items-center justify-between">
      <h1 class="font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
        <span class="i-ph-gear-six-fill text-primary text-2xl"></span>
        پنل مدیریت
      </h1>
      <div class="flex gap-3">
        <button @click="toggleTheme" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-yellow-400 hover:scale-110 transition-transform">
          <span :class="isDark ? 'i-ph-sun-fill' : 'i-ph-moon-fill'" class="text-xl"></span>
        </button>

        <NuxtLink to="/" class="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">مشاهده سایت</NuxtLink>
        <button @click="handleSave" :disabled="isLoading" class="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <span v-if="isLoading" class="i-ph-spinner animate-spin text-xl"></span>
          <span v-else class="i-ph-floppy-disk text-xl"></span>
          {{ isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </button>
      </div>
    </header>

    <header class="md:hidden fixed top-0 z-30 bg-white/90 dark:bg-[#1E2025]/90 w-[100%] backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <button @click="toggleTheme" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-yellow-400">
          <span :class="isDark ? 'i-ph-sun-fill' : 'i-ph-moon-fill'" class="text-lg"></span>
        </button>

        <NuxtLink to="/" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <span class="i-ph-eye text-lg"></span>
        </NuxtLink>
        <span class="font-bold text-sm text-slate-800 dark:text-white">مدیریت</span>
      </div>
      
      <button @click="handleSave" :disabled="isLoading" class="bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <span v-if="isLoading" class="i-ph-spinner animate-spin text-lg"></span>
        <span v-else class="i-ph-floppy-disk text-lg"></span>
        <span>ذخیره</span>
      </button>
    </header>

    <div class="container mx-auto max-w-4xl p-6">
      
      <div class="hidden md:flex sticky top-[72px] z-20 bg-slate-50 dark:bg-[#111315] pt-2 pb-4 -mx-6 px-6 overflow-x-auto gap-3 scrollbar-hide mb-4">
        <button 
          v-for="tab in [
            { id: 'menu', label: 'مدیریت منو', icon: 'i-ph-fork-knife' },
            { id: 'settings', label: 'تنظیمات برند', icon: 'i-ph-paint-brush' },
            { id: 'operations', label: 'امور رستوران', icon: 'i-ph-storefront' }
          ]" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all font-bold text-sm border shadow-sm"
          :class="activeTab === tab.id 
            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
            : 'bg-white dark:bg-[#1E2025] text-slate-500 border-slate-200 dark:border-white/5'"
        >
          <span :class="tab.icon" class="text-lg"></span>
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'menu'" class="space-y-6 mt-[5rem]">
        
        <div 
          v-for="(category, catIndex) in siteData?.categories" 
          :key="category.id"
          class="bg-white dark:bg-[#1E2025] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden transition-all"
          :class="{'shadow-lg ring-1 ring-primary/20': expandedCategories.includes(catIndex)}"
        >
          <div class="p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 bg-slate-50/50 dark:bg-white/5 select-none" @click.self="toggleCategory(catIndex)">
            
            <div class="flex items-center gap-2">
              <button @click="toggleCategory(catIndex)" class="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400">
                 <span class="text-xl block transition-transform duration-300" :class="expandedCategories.includes(catIndex) ? 'rotate-180' : ''">▼</span>
              </button>

              <div class="relative group">
                 <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border shadow-sm text-2xl text-primary shrink-0">
                   <span :class="category.icon"></span>
                 </div>
                 <div class="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 grid grid-cols-4 gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-40">
                   <button v-for="icon in availableIcons" :key="icon" @click="category.icon = icon" class="w-8 h-8 rounded-lg hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-xl">
                     <span :class="icon"></span>
                   </button>
                 </div>
              </div>
            </div>

            <input 
              v-model="category.title" 
              class="order-last sm:order-none w-full sm:w-auto flex-grow bg-transparent font-bold text-lg outline-none text-slate-800 dark:text-white placeholder:text-slate-300 dark:bg-dark-100 rounded-2 pr-2 py-1 border-b border-transparent focus:border-primary/50 transition-colors"
              placeholder="نام دسته‌بندی"
            />

            <div class="flex items-center gap-2 ms-auto sm:ml-0">
               <label class="flex items-center cursor-pointer">
                 <input type="checkbox" v-model="category.isActive" class="hidden peer">
                 <div class="w-9 h-5 bg-slate-200 peer-checked:bg-green-500 rounded-full relative transition-colors">
                   <div class="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                 </div>
               </label>
               <button @click="deleteCategory(catIndex)" class="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
                 <span class="i-ph-trash text-xl"></span>
               </button>
            </div>
          </div>

          <div v-show="expandedCategories.includes(catIndex)" class="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div 
                v-for="(item, itemIndex) in category.items" 
                :key="item.id"
                class="bg-white dark:bg-[#1E2025] p-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm relative group"
              >
                <button @click="deleteItem(catIndex, itemIndex)" class="absolute top-2 left-2 p-1.5 text-slate-300 hover:text-red-500 transition-colors z-10">
                  <span class="i-ph-x text-lg"></span>
                </button>

                <div class="flex gap-1 flex-wrap">
                  <div class="w-20 h-20 shrink-0">
                    <ImageUploader v-model="item.image" class="h-full rounded-xl" />
                  </div>
                  
                  <div class="flex-grow space-y-3">
                    <div class="flex flex-col sm:flex-row gap-3">
                      <input v-model="item.title" class="flex-grow font-black text-slate-800 dark:text-white bg-transparent outline-none border-b-2 border-transparent focus:border-primary transition-colors pb-1 placeholder:text-slate-300" placeholder="نام غذا (مثلا: پیتزا مخصوص)">

                      <div class="flex items-center gap-2 bg-slate-100 dark:bg-black/20 px-3 py-1 rounded-xl w-fit">
                          <span class="text-xs text-slate-400">قیمت:</span>
                          <input type="number" v-model="item.price" class="w-20 bg-transparent font-bold text-slate-800 dark:text-white outline-none text-left" placeholder="0">
                          <span class="text-[10px] text-slate-400">{{ siteData?.business?.currency }}</span>
                      </div>
                    </div>
                  
                    <textarea v-model="item.description" rows="2" class="w-full text-sm text-slate-500 bg-slate-50 dark:bg-black/20 rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary/50 resize-none transition-shadow" placeholder="مواد تشکیل دهنده و توضیحات جذاب..."></textarea>

                    <div class="mt-3 border-t border-slate-100 dark:border-white/5 pt-2">
                      <span class="text-[10px] font-bold text-slate-400 block mb-1.5">انتخاب ویژگی‌ها:</span>
                      <div class="flex flex-wrap gap-2">
                        <button 
                          v-for="label in siteData.labels" 
                          :key="label.text"
                          @click="item.labels = item.labels?.includes(label.text) ? item.labels.filter(l => l !== label.text) : [...(item.labels||[]), label.text]"
                          class="px-2.5 py-1.5 rounded-lg text-[11px] border transition-all flex items-center gap-1.5 font-medium"
                          :class="item.labels?.includes(label.text) 
                            ? `bg-${label.color}-50 text-${label.color}-600 border-${label.color}-200 dark:bg-${label.color}-500/20 dark:text-${label.color}-300 dark:border-${label.color}-500/30` 
                            : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-transparent opacity-70 grayscale hover:grayscale-0 hover:opacity-100'"
                        >
                            <span>{{ label.emoji || '🏷️' }}</span>
                            {{ label.text }}
                        </button>
                        
                        <button v-if="siteData.labels.length === 0" @click="activeTab = 'settings'" class="text-[10px] text-primary border border-dashed border-primary/30 px-2 py-1 rounded-lg hover:bg-primary/5">
                          + ساخت ویژگی جدید در تنظیمات
                        </button>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 pt-2">

                      <label class="flex items-center gap-2 cursor-pointer bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg select-none transition-colors" :class="item.isAvailable ? 'border-green-500/50 bg-green-50/50' : ''">
                        <div class="relative w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors" :class="{'!bg-green-500': item.isAvailable}">
                          <div class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform" :class="{'translate-x-4': item.isAvailable}"></div>
                        </div>
                        <span class="text-xs font-bold" :class="item.isAvailable ? 'text-green-600' : 'text-slate-400'">{{ item.isAvailable ? 'موجود' : 'ناموجود' }}</span>
                        <input type="checkbox" v-model="item.isAvailable" class="hidden">
                      </label>
                    
                      <div class="flex items-center gap-2 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5">
                         <span class="i-ph-tag text-slate-400 text-sm"></span>
                         <input type="number" v-model="item.discountPrice" class="w-20 bg-transparent text-xs font-bold outline-none" placeholder="قیمت با تخفیف">
                      </div>
                    
                      <div class="flex gap-1">
                        <button 
                          @click="item.labels = item.labels.includes('تند 🔥') ? item.labels.filter(l => l !== 'تند 🔥') : [...(item.labels||[]), 'تند 🔥']"
                          class="px-2 py-1 rounded-md text-[10px] border transition-colors"
                          :class="item.labels?.includes('تند 🔥') ? 'bg-red-50 text-red-600 border-red-200' : 'border-slate-200 text-slate-400'"
                        >🔥 تند</button>
                        <button 
                          @click="item.labels = item.labels.includes('گیاهی 🌱') ? item.labels.filter(l => l !== 'گیاهی 🌱') : [...(item.labels||[]), 'گیاهی 🌱']"
                          class="px-2 py-1 rounded-md text-[10px] border transition-colors"
                          :class="item.labels?.includes('گیاهی 🌱') ? 'bg-green-50 text-green-600 border-green-200' : 'border-slate-200 text-slate-400'"
                        >🌱 گیاهی</button>
                      </div>
                    
                    </div>
                  </div>
                </div>
              </div>

              <button 
                @click="(e) => openProductEditor(catIndex, e)"
                class="h-full min-h-[140px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              >
                <span class="i-ph-plus text-3xl"></span>
                <span class="text-sm font-bold">افزودن غذا</span>
              </button>

            </div>
          </div>
        </div>

        <button 
          @click="createCategory"
          class="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-slate-500 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <span class="i-ph-plus text-2xl"></span>
          افزودن دسته‌بندی جدید
        </button>

      </div>
  
        <div v-if="activeTab === 'settings'" class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 animate-fast-fade mt-[5rem]">
  
        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div class="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
            <span class="i-ph-paint-brush-broad text-primary text-xl"></span>
            <h3 class="font-bold text-lg">شخصی‌سازی ظاهر</h3>
          </div>
        
          <div class="space-y-5">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-400">لوگوی رستوران</label>
              <div class="h-32 w-full">
                 <ImageUploader v-model="siteData.business.logo" />
              </div>
            </div>
          
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-400">رنگ برند (تم سایت)</label>
              <div class="flex gap-3 items-center bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-100 dark:border-white/5">
                 <input type="color" v-model="siteData.appearance.primaryColor" class="h-12 w-16 rounded-xl cursor-pointer border-none bg-transparent shadow-sm">
                 <div class="flex-grow">
                   <div class="text-xs opacity-50 mb-1">کد رنگ:</div>
                   <div class="font-mono font-bold text-slate-700 dark:text-white uppercase">{{ siteData.appearance.primaryColor }}</div>
                 </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-400">استایل دکمه‌ها و کادرها</label>
              <div class="flex bg-slate-50 dark:bg-black/20 p-1.5 rounded-2xl">
                <button v-for="r in radiusOptions" :key="r.value"
                  @click="siteData.appearance.radius = r.value"
                  class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300"
                  :class="siteData.appearance.radius === r.value ? 'bg-white dark:bg-slate-700 shadow-md text-primary scale-105' : 'text-slate-400 hover:text-slate-600'"
                >{{ r.label }}</button>
              </div>
            </div>
          </div>
        </div>
      
        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div class="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
            <span class="i-ph-identification-card text-primary text-xl"></span>
            <h3 class="font-bold text-lg">اطلاعات رستوران</h3>
          </div>
          
          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400">نام نمایشی</label>
              <input v-model="siteData.business.name" class="w-full bg-slate-50 dark:bg-black/20 text-dark dark:text-white rounded-2xl p-4 text-sm font-bold outline-none border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-black/40 transition-all" placeholder="نام رستوران">
            </div>
            
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-400">شعار یا توضیحات کوتاه</label>
              <textarea v-model="siteData.business.slogan" rows="3" class="w-full bg-slate-50 text-dark dark:text-white dark:bg-black/20 rounded-2xl p-4 text-sm outline-none border-2 border-transparent focus:border-primary/30 transition-all resize-none" placeholder="مثلا: طعمی که فراموش نمی‌کنید..."></textarea>
            </div>
            
            <div class="flex gap-4">
               <div class="flex-1 space-y-1">
                 <label class="text-xs font-bold text-slate-400">واحد پول</label>
                 <input v-model="siteData.business.currency" class="w-full bg-slate-50 text-dark dark:text-white dark:bg-black/20 rounded-2xl p-3 text-sm font-bold text-center outline-none" placeholder="تومان">
               </div>
               <div class="flex-1 space-y-1">
                 <label class="text-xs font-bold text-slate-400">مالیات / سرویس</label>
                 <input type="number" v-model="siteData.business.fees.tax" class="w-full text-dark dark:text-white bg-slate-50 dark:bg-black/20 rounded-2xl p-3 text-sm font-bold text-center outline-none" placeholder="0">
               </div>
            </div>
          </div>
        </div>
      
        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm md:col-span-2 relative overflow-visible">
          <div class="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-white/5 pb-3">
            <div class="flex items-center gap-2">
              <span class="i-ph-tag text-primary text-xl"></span>
              <div>
                <h3 class="font-bold text-lg">ویژگی‌های غذا (Tags)</h3>
                <p class="text-xs text-slate-400">این ویژگی‌ها را بسازید تا بتوانید به غذاها اختصاص دهید</p>
              </div>
            </div>
            <button @click="createLabel" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
              <span class="i-ph-plus font-bold"></span>
              ویژگی جدید
            </button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
            <div v-for="(label, idx) in siteData.labels" :key="idx" class="group flex items-center gap-2 bg-slate-50 dark:bg-black/20 p-2 pl-3 rounded-2xl border border-slate-200 dark:border-white/5 transition-all hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              
              <div class="relative group/emoji">
                 <input v-model="label.emoji" class="w-10 h-10 text-center bg-white dark:bg-white/5 rounded-xl outline-none text-xl border border-slate-100 dark:border-white/5 focus:border-primary transition-colors" placeholder="🏷️">
              </div>
            
              <input v-model="label.text" class="flex-grow bg-transparent text-sm font-bold outline-none text-slate-700 dark:text-slate-200" placeholder="نام ویژگی (مثلا: تند)">
              
              <div class="relative flex items-center">
                <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer relative">
                  <input type="color" v-model="label.color" class="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer opacity-0">
                  <div class="w-full h-full" :style="{ backgroundColor: label.color }"></div>
                </div>
              </div>
              
              <button @click="deleteLabel(idx)" class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 bg-transparent hover:bg-red-50 rounded-xl transition-all">
                <span class="i-ph-trash"></span>
              </button>
            </div>
          </div>
          
          <div class="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide opacity-60">
            <span class="text-[10px] px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg whitespace-nowrap">💡 پیشنهاد: تند 🔥</span>
            <span class="text-[10px] px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg whitespace-nowrap">💡 پیشنهاد: گیاهی 🌱</span>
            <span class="text-[10px] px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg whitespace-nowrap">💡 پیشنهاد: رژیمی 💪</span>
          </div>
        </div>
      
      
      </div>


      <div v-else-if="activeTab === 'operations'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[5rem]">

        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2"><span class="i-ph-share-network text-blue-500"></span> فضای مجازی</h3>
          
          <div class="space-y-4 relative z-10">
            <div class="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-blue-500 transition-colors">
              <span class="i-ph-instagram-logo text-xl text-pink-600"></span>
              <input v-model="siteData.business.socials.instagram" class="flex-grow bg-transparent text-dark dark:text-white text-sm outline-none" placeholder="آیدی اینستاگرام (بدون @)">
            </div>
            <div class="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-blue-500 transition-colors">
              <span class="i-ph-whatsapp-logo text-xl text-green-600"></span>
              <input v-model="siteData.business.socials.whatsapp" class="flex-grow bg-transparent text-dark dark:text-white text-sm outline-none" placeholder="شماره واتساپ (مثلا 0912...)">
            </div>
            <div class="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5 focus-within:border-blue-500 transition-colors">
              <span class="i-ph-phone text-xl text-slate-500"></span>
              <input v-model="siteData.business.socials.phone" class="flex-grow bg-transparent text-dark dark:text-white text-sm outline-none" placeholder="شماره تماس رستوران">
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2"><span class="i-ph-clock text-green-600"></span> وضعیت سفارش‌گیری</h3>
          
          <div class="space-y-4 relative z-10">
            <label class="flex items-center justify-between cursor-pointer bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
              <span class="text-sm font-bold" :class="siteData.business.isOpen ? 'text-green-600' : 'text-red-500'">
                {{ siteData.business.isOpen ? 'رستوران باز است 🟢' : 'رستوران بسته است 🔴' }}
              </span>
              <div class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="siteData.business.isOpen" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </div>
            </label>

            <div class="space-y-1">
               <label class="text-[10px] font-bold text-slate-400">میانگین زمان تحویل</label>
               <input v-model="siteData.business.waitTime" class="w-full bg-slate-50 dark:bg-black/20 text-dark dark:text-white text-dark dark:text-white rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-green-500 transition-all" placeholder="مثلا: ۴۵ دقیقه">
            </div>
          </div>
        </div>
      
        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2"><span class="i-ph-wifi-high text-amber-500"></span> خدمات رفاهی</h3>
        
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                 <label class="text-[10px] font-bold text-slate-400 uppercase">نام شبکه (SSID)</label>
                 <input v-model="siteData.business.wifi.ssid" class="w-full bg-slate-50 dark:bg-black/20 text-dark dark:text-white text-dark dark:text-white rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-amber-500">
              </div>
              <div class="space-y-1">
                 <label class="text-[10px] font-bold text-slate-400 uppercase">رمز وای‌فای</label>
                 <input v-model="siteData.business.wifi.password" class="w-full bg-slate-50 dark:bg-black/20 text-dark dark:text-white text-dark dark:text-white rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-amber-500">
              </div>
            </div>
            
            <div class="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              <span class="i-ph-info inline-block align-middle text-lg mr-1"></span>
              اگر این فیلدها را پر کنید، کارت وای‌فای به صورت خودکار در منوی مشتری نمایش داده می‌شود.
            </div>
          </div>
        </div>
      
        <div class="bg-white dark:bg-[#1E2025] p-6 rounded-3xl border border-slate-200 dark:border-white/5 relative overflow-hidden md:col-span-2">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <span class="i-ph-megaphone text-red-500"></span> 
            نوار اعلان (Notification Bar)
            <label class="relative inline-flex items-center cursor-pointer mr-auto">
              <input type="checkbox" v-model="siteData.appearance.announcement.active" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </h3>
          
          <div v-if="siteData.appearance.announcement.active" class="flex gap-4 items-start animate-fade-in-up">
            <textarea v-model="siteData.appearance.announcement.text" class="flex-grow bg-slate-50 dark:bg-black/20 text-dark dark:text-white rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500/50" placeholder="متن اعلان (مثلا: امشب به دلیل تعمیرات تعطیل هستیم)"></textarea>
            <input type="color" v-model="siteData.appearance.announcement.color" class="w-10 h-10 rounded-xl cursor-pointer shadow-sm border border-slate-200">
          </div>
        </div>
      
      </div>

    </div>
  </div>

  <div class="md:hidden fixed bottom-6 inset-x-4 z-50">
      <div class="bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl text-white dark:text-slate-900 rounded-[2rem] p-1.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10">
        
        <button @click="activeTab = 'menu'" class="flex-1 flex flex-col items-center gap-1 py-3 rounded-[1.5rem] transition-all" :class="activeTab === 'menu' ? 'bg-white/10 dark:bg-black/10 shadow-inner' : 'opacity-50'">
          <span class="i-ph-fork-knife text-xl"></span>
          <span v-if="activeTab === 'menu'" class="text-[9px] font-bold animate-fade-in-up">منو</span>
        </button>

        <button @click="activeTab = 'settings'" class="flex-1 flex flex-col items-center gap-1 py-3 rounded-[1.5rem] transition-all" :class="activeTab === 'settings' ? 'bg-white/10 dark:bg-black/10 shadow-inner' : 'opacity-50'">
          <span class="i-ph-paint-brush text-xl"></span>
          <span v-if="activeTab === 'settings'" class="text-[9px] font-bold animate-fade-in-up">تنظیمات</span>
        </button>

        <button @click="activeTab = 'operations'" class="flex-1 flex flex-col items-center gap-1 py-3 rounded-[1.5rem] transition-all" :class="activeTab === 'operations' ? 'bg-white/10 dark:bg-black/10 shadow-inner' : 'opacity-50'">
          <span class="i-ph-storefront text-xl"></span>
          <span v-if="activeTab === 'operations'" class="text-[9px] font-bold animate-fade-in-up">امور</span>
        </button>
        
      </div>
  </div>


  <Teleport to="body">
    <Transition @enter="onEditorEnter" @leave="onEditorLeave" :css="false">
      <div v-if="isEditorOpen && editingItem" class="fixed bg-white dark:bg-[#111315] shadow-2xl overflow-hidden z-[1000]">
        
        <div class="editor-content-wrapper w-full h-full flex flex-col">
            
            <div class="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/5 shrink-0">
              <h2 class="text-xl font-black text-slate-800 dark:text-white">افزودن محصول</h2>
              <button @click="closeEditor" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                <span class="i-ph-x text-xl"></span>
              </button>
            </div>

            <div class="flex-grow overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full">
               <div class="aspect-video w-full rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-white/10">
                 <ImageUploader v-model="editingItem.image" />
               </div>
               
               <div class="space-y-4">
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-400">نام محصول</label>
                    <input v-model="editingItem.title" class="w-full text-2xl font-black bg-transparent border-b-2 border-slate-200 dark:border-white/10 focus:border-primary py-2 outline-none dark:text-white" placeholder="مثلا: پیتزا">
                  </div>
                  
                  <div class="flex gap-4">
                     <div class="flex-1 space-y-1">
                       <label class="text-xs font-bold text-slate-400">قیمت</label>
                       <input type="number" v-model="editingItem.price" class="w-full bg-slate-50 dark:bg-white/5 rounded-xl p-4 text-lg font-bold outline-none dark:text-white">
                     </div>
                     <div class="flex-1 space-y-1">
                       <label class="text-xs font-bold text-slate-400">تخفیف</label>
                       <input type="number" v-model="editingItem.discountPrice" class="w-full bg-slate-50 dark:bg-white/5 rounded-xl p-4 text-lg font-bold outline-none dark:text-white" placeholder="0">
                     </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-xs font-bold text-slate-400">توضیحات</label>
                    <textarea v-model="editingItem.description" rows="3" class="w-full bg-slate-50 dark:bg-white/5 rounded-xl p-4 outline-none resize-none dark:text-white"></textarea>
                  </div>

                  <div class="space-y-2">
                     <label class="text-xs font-bold text-slate-400">ویژگی‌ها</label>
                     <div class="flex flex-wrap gap-2">
                        <button 
                          v-for="label in siteData.labels" 
                          :key="label.text"
                          @click="editingItem.labels = editingItem.labels?.includes(label.text) ? editingItem.labels.filter(l => l !== label.text) : [...(editingItem.labels||[]), label.text]"
                          class="px-3 py-2 rounded-xl text-xs border transition-all flex items-center gap-2"
                          :class="editingItem.labels?.includes(label.text) 
                            ? `bg-${label.color}-50 text-${label.color}-600 border-${label.color}-200` 
                            : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-transparent'"
                        >
                            <span>{{ label.emoji }}</span>
                            {{ label.text }}
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div class="p-4 border-t border-slate-100 dark:border-white/5 shrink-0">
              <button @click="saveNewItem" class="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
                افزودن محصول
              </button>
            </div>

        </div> 
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
/* انیمیشن سریع و نرم */
@keyframes fastFadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fast-fade {
  animation: fastFadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

/* رفع مشکل اسکرول افقی مزاحم */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>