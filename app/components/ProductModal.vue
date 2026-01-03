<script setup>
import { computed } from 'vue';
import { gsap } from 'gsap';

const { isOpen, selectedItem, closeModal, userSelections, triggerRect } = useProductModal();
const { siteData } = useSiteData();

const totalPrice = computed(() => {
  if (!selectedItem.value) return 0;
  let total = selectedItem.value.discountPrice || selectedItem.value.price;
  Object.keys(userSelections.value).forEach(key => {
    const selection = userSelections.value[key];
    if (Array.isArray(selection)) selection.forEach(opt => total += (opt.price || 0));
    else if (selection && selection.price) total += (selection.price || 0);
  });
  return total;
});

const handleAddToCart = () => {
  alert(`محصول با قیمت ${totalPrice.value} به سبد اضافه شد!`);
  closeModal();
};

// --- انیمیشن دقیق و بدون باگ ---
const onEnter = (el, done) => {
  if (triggerRect.value) {
    // 1. وضعیت اولیه: دقیقاً هم‌اندازه و هم‌مکان با عنصر کلیک شده
    gsap.set(el, {
      position: 'fixed',
      top: triggerRect.value.top,
      left: triggerRect.value.left,
      width: triggerRect.value.width,
      height: triggerRect.value.height,
      borderRadius: '24px', // گردی کارت اولیه
      opacity: 1,
      zIndex: 100,
      margin: 0, // حذف مارجین‌های مزاحم
      overflow: 'hidden'
    });

    // 2. انیمیشن به سمت تمام صفحه
    gsap.to(el, {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '0px', // در حالت تمام صفحه گوشه‌ها تیز می‌شوند
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: done
    });
    
    // محتوا را جداگانه ظاهر می‌کنیم تا حس بهتری بدهد
    gsap.fromTo(el.querySelector('.modal-content-inner'), 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
    );
  } else {
    // حالت فال‌بک (بدون انیمیشن خاص)
    gsap.fromTo(el, { opacity: 0, y: '100%' }, { opacity: 1, y: 0, duration: 0.4, onComplete: done });
  }
};

const onLeave = (el, done) => {
  if (triggerRect.value) {
    // اول محتوای داخلی را محو کن
    gsap.to(el.querySelector('.modal-content-inner'), { opacity: 0, duration: 0.2 });

    // سپس خود باکس را کوچک کن به جای اولش
    gsap.to(el, {
      top: triggerRect.value.top,
      left: triggerRect.value.left,
      width: triggerRect.value.width,
      height: triggerRect.value.height,
      borderRadius: '24px',
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        // در لحظه آخر محو شو
        gsap.to(el, { opacity: 0, duration: 0.1, onComplete: done });
      }
    });
  } else {
    gsap.to(el, { opacity: 0, y: '100%', duration: 0.4, onComplete: done });
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition @enter="onEnter" @leave="onLeave" :css="false">
      <div 
        v-if="isOpen && selectedItem"
        class="fixed bg-white dark:bg-[#111315] shadow-2xl flex flex-col"
        style="will-change: top, left, width, height, border-radius;"
      >
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
        >
          <span class="i-ph-x text-xl"></span>
        </button>

        <div class="modal-content-inner w-full h-full overflow-y-auto flex flex-col">
          
          <div class="w-full h-72 sm:h-96 relative shrink-0">
             <BaseImage :src="selectedItem.image" class="w-full h-full object-cover" />
             <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-[#111315] via-transparent to-transparent opacity-90"></div>
          </div>

          <div class="flex-grow px-6 pb-32 -mt-20 relative z-10 max-w-3xl mx-auto w-full">
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">{{ selectedItem.title }}</h2>
            <p class="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6">{{ selectedItem.description }}</p>

            <div v-if="selectedItem.labels && selectedItem.labels.length" class="flex flex-wrap gap-2 mb-6">
              <span v-for="tag in selectedItem.labels" :key="tag" class="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-dark dark:text-white text-xs font-bold border border-slate-200 dark:border-white/5">{{ tag }}</span>
            </div>

            <div class="h-px bg-slate-100 dark:bg-white/5 my-6"></div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>