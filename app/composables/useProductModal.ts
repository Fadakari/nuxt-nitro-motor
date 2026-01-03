// composables/useProductModal.ts
export const useProductModal = () => {
  const isOpen = useState('modal-is-open', () => false);
  const selectedItem = useState('modal-selected-item', () => null);
  const userSelections = useState<Record<string, any>>('modal-user-selections', () => ({}));
  const triggerRect = useState('modal-trigger-rect', () => null);

  const openModal = (item: any, event?: MouseEvent | HTMLElement) => {
    let target = null;

    if (event instanceof MouseEvent) {
      // تغییر مهم: پیدا کردن نزدیک‌ترین کارت والد (کلاس group)
      // این باعث می‌شود حتی اگر روی عکس یا متن کلیک شد، کل کارت ملاک باشد
      target = (event.currentTarget as HTMLElement).closest('.group') || (event.currentTarget as HTMLElement);
    } else if (event) {
      target = event;
    }

    if (target) {
      const rect = target.getBoundingClientRect();
      triggerRect.value = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    } else {
      triggerRect.value = null;
    }

    selectedItem.value = item;
    userSelections.value = {};
    
    // انتخاب‌های پیش‌فرض
    if (item.modifiers) {
      item.modifiers.forEach((mod: any) => {
        if (mod.required && mod.options?.length > 0 && !mod.multiSelect) {
          userSelections.value[mod.title] = mod.options[0]; 
        } else if (mod.multiSelect) {
          userSelections.value[mod.title] = [];
        }
      });
    }
    
    isOpen.value = true;
    if (import.meta.client) document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    isOpen.value = false;
    setTimeout(() => {
      selectedItem.value = null;
      userSelections.value = {};
      triggerRect.value = null;
    }, 600);
    if (import.meta.client) document.body.style.overflow = '';
  };

  return { isOpen, selectedItem, userSelections, triggerRect, openModal, closeModal };
};