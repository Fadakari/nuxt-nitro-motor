<script setup lang="ts">
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const showModal = ref(false)
const client = useSupabaseClient()

// تبدیل مسیر نسبی به لینک کامل برای نمایش
const imageUrl = computed(() => {
  if (!props.modelValue) return null
  if (props.modelValue.startsWith('http')) return props.modelValue
  return client.storage.from('images').getPublicUrl(props.modelValue).data.publicUrl
})
</script>

<template>
  <div>
    <div 
      @click="showModal = true"
      class="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-white/20 bg-white/5 cursor-pointer hover:border-gold/50 hover:bg-white/10 transition-all group"
    >
      <img v-if="imageUrl" :src="imageUrl" class="w-full h-full object-cover">
      
      <div class="absolute inset-0 flex flex-col items-center justify-center transition-all"
           :class="imageUrl ? 'bg-black/60 opacity-0 group-hover:opacity-100' : 'text-gray-400'">
        <span class="i-heroicons-photo text-3xl mb-2" :class="imageUrl ? 'text-white' : 'text-gray-500'"></span>
        <span class="text-sm font-bold" :class="imageUrl ? 'text-white' : 'text-gray-400'">
          {{ imageUrl ? 'تغییر تصویر' : 'انتخاب تصویر' }}
        </span>
      </div>
    </div>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <ImageManager 
        v-if="showModal" 
        :modelValue="modelValue"
        @update:modelValue="val => emit('update:modelValue', val)" 
        @close="showModal = false" 
      />
    </Transition>
  </div>
</template>