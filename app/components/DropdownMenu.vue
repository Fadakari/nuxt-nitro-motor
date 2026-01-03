<template>
  <div ref="dropdownRef" class="relative">
    <!-- Trigger -->
    <button
      @click.stop="toggle"
      class="flex items-center gap-2 px-3 py-2 rounded-xl
             bg-white/70 backdrop-blur
             dark:bg-slate-800/70
             border border-slate-200 dark:border-slate-700
             shadow-sm hover:shadow-md
             transition-all"
    >
      <span class="text-sm text-slate-700 dark:text-slate-200">بیشتر</span>
      <svg
        class="w-4 h-4 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Teleport to="body">
        <Transition :name="transitionName">
          <div
            v-if="isOpen"
            ref="menuRef"
            class="fixed w-48 rounded-2xl
                 bg-white dark:bg-slate-900
                 border border-slate-200/70 dark:border-slate-700/70
                 shadow-xl shadow-black/10
                 overflow-auto z-[9999]"
            :style="menuStyle"
          >
            <ul class="py-2">
              <li
                v-for="item in items"
                :key="item.id"
                @click="select(item)"
                class="px-4 py-2.5 text-sm
                       hover:bg-slate-100 dark:hover:bg-slate-800
                       transition-colors cursor-pointer"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
        </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

const menuStyle = ref<Record<string, string>>({})

interface Item {
  id: number
  label: string
}

const items: Item[] = [
  { id: 1, label: `نام شبکه {{ siteData?.business?.wifi?.ssid }}` },
  { id: 2, label: `رمز: {{ siteData?.business?.wifi?.password }}` }
]

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const menuPositionClass = ref('right-0 top-full mt-3')
const transitionName = ref('dropdown-down')

const toggle = async (): Promise<void> => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    calculatePosition()
  }
}

const calculatePosition = (): void => {
  if (!menuRef.value || !dropdownRef.value) return

  const menu = menuRef.value
  const trigger = dropdownRef.value

  const menuRect = menu.getBoundingClientRect()
  const triggerRect = trigger.getBoundingClientRect()

  const padding = 8

  let top = triggerRect.bottom + 8
  let left = triggerRect.right - menuRect.width

  // Vertical clamp
  if (top + menuRect.height > window.innerHeight - padding) {
    top = triggerRect.top - menuRect.height - 8
  }

  if (top < padding) {
    top = padding
  }

  // Horizontal clamp
  if (left + menuRect.width > window.innerWidth - padding) {
    left = window.innerWidth - menuRect.width - padding
  }

  if (left < padding) {
    left = padding
  }

  menuStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    maxHeight: `calc(100vh - ${padding * 2}px)`
  }

  transitionName.value =
    top < triggerRect.top ? 'dropdown-up' : 'dropdown-down'
}


const select = (item: Item): void => {
  isOpen.value = false
  console.log(item)
}

/* Close on outside click */
const onClickOutside = (e: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.dropdown-down-enter-active,
.dropdown-down-leave-active,
.dropdown-up-enter-active,
.dropdown-up-leave-active {
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-scroll {
  overscroll-behavior: contain;
}

.dropdown-down-enter-from {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
.dropdown-down-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

.dropdown-up-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}
.dropdown-up-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.97);
}
</style>
