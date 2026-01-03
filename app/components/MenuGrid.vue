<script setup>
defineProps({
  categories: { type: Array, required: true },
  currency: { type: String, default: 'تومان' }
});
</script>

<template>
  <div class="space-y-10 pb-24">
    <section 
      v-for="category in categories" 
      :key="category.id"
      :id="`cat-${category.id}`"
      class="scroll-mt-28"
    >
      <div class="flex items-center gap-3 mb-5 px-1">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <span :class="[category.icon, 'text-2xl']"></span>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ category.title }}</h2>
          <p v-if="category.description" class="text-xs text-slate-500">{{ category.description }}</p>
        </div>
      </div>

      <TransitionGroup 
        name="list" 
        tag="div" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <MenuItem 
          v-for="item in category.items" 
          :key="item.id" 
          :item="item"
          :currency="currency"
        />
      </TransitionGroup>
      
      <div v-if="category.items.length === 0" class="text-center py-8 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <span class="text-slate-400 text-sm">فعلا آیتمی در این دسته نیست</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
  z-index: 0;
}
</style>